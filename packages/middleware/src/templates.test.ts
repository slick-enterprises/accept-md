/**
 * Ensure generated handler/middleware templates are valid and type-check friendly.
 */

import { describe, it, expect } from 'vitest';
import {
  MIDDLEWARE_TEMPLATE,
  APP_ROUTE_HANDLER_TEMPLATE,
  PAGES_API_HANDLER_TEMPLATE,
  SVELTEKIT_ROUTE_HANDLER_TEMPLATE,
  getNextConfigRewrite,
} from './templates.js';

describe('templates', () => {
  it('MIDDLEWARE_TEMPLATE has JSDoc for request so .ts files type-check', () => {
    expect(MIDDLEWARE_TEMPLATE).toContain("import('next/server').NextRequest");
    expect(MIDDLEWARE_TEMPLATE).toContain('@param');
    expect(MIDDLEWARE_TEMPLATE).toMatch(/export function middleware\(request\)/);
  });

  it('APP_ROUTE_HANDLER_TEMPLATE has JSDoc for request so .ts files type-check', () => {
    expect(APP_ROUTE_HANDLER_TEMPLATE).toContain("import('next/server').NextRequest");
    expect(APP_ROUTE_HANDLER_TEMPLATE).toContain('@param');
    expect(APP_ROUTE_HANDLER_TEMPLATE).toMatch(/export async function GET\(request\)/);
  });

  it('PAGES_API_HANDLER_TEMPLATE has JSDoc for req and res so .ts files type-check', () => {
    expect(PAGES_API_HANDLER_TEMPLATE).toContain("import('next').NextApiRequest");
    expect(PAGES_API_HANDLER_TEMPLATE).toContain("import('next').NextApiResponse");
    expect(PAGES_API_HANDLER_TEMPLATE).toContain('@param');
    expect(PAGES_API_HANDLER_TEMPLATE).toMatch(/export default async function handler\(req, res\)/);
  });

  it('templates are plain JavaScript (no TypeScript type annotations)', () => {
    const noTsParam = (s: string) => {
      expect(s).not.toMatch(/request\s*:\s*NextRequest/);
      expect(s).not.toMatch(/req\s*:\s*NextApiRequest/);
      expect(s).not.toMatch(/res\s*:\s*NextApiResponse/);
      expect(s).not.toContain('import type ');
    };
    noTsParam(MIDDLEWARE_TEMPLATE);
    noTsParam(APP_ROUTE_HANDLER_TEMPLATE);
    noTsParam(PAGES_API_HANDLER_TEMPLATE);
    noTsParam(SVELTEKIT_ROUTE_HANDLER_TEMPLATE);
  });

  it('SVELTEKIT_ROUTE_HANDLER_TEMPLATE exports a GET handler and calls getMarkdownForPath', () => {
    expect(SVELTEKIT_ROUTE_HANDLER_TEMPLATE).toContain('export async function GET(');
    expect(SVELTEKIT_ROUTE_HANDLER_TEMPLATE).toContain('getMarkdownForPath');
    expect(SVELTEKIT_ROUTE_HANDLER_TEMPLATE).toContain('loadConfig');
  });

  it('middleware rewrites to handler with original path in query', () => {
    expect(MIDDLEWARE_TEMPLATE).toContain("url.searchParams.set('path', pathname)");
    expect(MIDDLEWARE_TEMPLATE).toContain('NextResponse.rewrite(url)');
    
  });

  it('App route handler reads path from header first, then query, then pathname', () => {
    expect(APP_ROUTE_HANDLER_TEMPLATE).toContain("request.headers.get('x-accept-md-path')");
    expect(APP_ROUTE_HANDLER_TEMPLATE).toContain('pathFromMatchedHeader');
    expect(APP_ROUTE_HANDLER_TEMPLATE).toContain('pathFromQuery');
    expect(APP_ROUTE_HANDLER_TEMPLATE).toContain('pathFromHeader');
    expect(APP_ROUTE_HANDLER_TEMPLATE).toContain('Never use the handler path itself');
  });

  it('Pages API handler reads path from header first, then query', () => {
    expect(PAGES_API_HANDLER_TEMPLATE).toContain("req.headers['x-accept-md-path']");
    expect(PAGES_API_HANDLER_TEMPLATE).toContain('pathFromMatchedHeader');
    expect(PAGES_API_HANDLER_TEMPLATE).toContain('pathFromQuery');
  });

  it('handler templates set Vary: Accept for content negotiation', () => {
    expect(APP_ROUTE_HANDLER_TEMPLATE).toContain("'Vary': 'Accept'");
    expect(PAGES_API_HANDLER_TEMPLATE).toContain("res.setHeader('Vary', 'Accept')");
    expect(SVELTEKIT_ROUTE_HANDLER_TEMPLATE).toContain("'Vary': 'Accept'");
  });

  describe('getNextConfigRewrite', () => {
    it('returns the query-param destination form (issue #16)', () => {
      // The rewrite destination must use the query-param form so that the
      // request hits the static handler at /api/accept-md/route.{js,ts}.
      // The legacy slug form '/api/accept-md/:path*' produced 404s because
      // it would route to a sub-path that has no catch-all handler.
      const rewrite = getNextConfigRewrite();
      expect(rewrite.destination).toBe('/api/accept-md?path=:path*');
      expect(rewrite.source).toBe('/:path*');
    });

    it('does not regress to the legacy slug form', () => {
      const rewrite = getNextConfigRewrite();
      expect(rewrite.destination).not.toBe('/api/accept-md/:path*');
    });

    it('keeps the accept: text/markdown header rule', () => {
      const rewrite = getNextConfigRewrite();
      expect(rewrite.has).toEqual([
        {
          type: 'header',
          key: 'accept',
          value: '(.*)text/markdown(.*)',
        },
      ]);
    });
  });
});
