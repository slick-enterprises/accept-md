/**
 * HTML to Markdown conversion tests and internal fetch behavior.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { htmlToMarkdown } from './markdown.js';
import { getMarkdownForPath } from './handler.js';
import type { GetMarkdownOptions } from './handler.js';

describe('htmlToMarkdown', () => {
  it('converts headings', () => {
    const html = '<html><body><h1>Title</h1><h2>Sub</h2></body></html>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('Title');
    expect(md).toContain('Sub');
  });

  it('converts links', () => {
    const html = '<p><a href="/about">About</a></p>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('[About](/about)');
  });

  it('converts images', () => {
    const html = '<p><img src="/img.png" alt="Image" /></p>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('![Image](/img.png)');
  });

  it('removes elements by selector', () => {
    const html = '<nav>Skip</nav><main><p>Keep</p></main>';
    const md = htmlToMarkdown(html, { cleanSelectors: ['nav'] });
    expect(md).not.toContain('Skip');
    expect(md).toContain('Keep');
  });

  it('applies transformers', () => {
    const html = '<p>Hello</p>';
    const md = htmlToMarkdown(html, {
      transformers: [(s) => s.replace('Hello', 'Hi')],
    });
    expect(md).toContain('Hi');
  });
});

describe('getMarkdownForPath internal fetch', () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = process.env.VERCEL_URL;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.VERCEL_URL = originalEnv;
  });

  it('uses primary origin when request succeeds', async () => {
    const fetchMock = vi.fn(async (url: RequestInfo | URL) => {
      const u = typeof url === 'string' ? url : url.toString();
      expect(u).toBe('https://example.com/blog');
      return new Response('<html><body><h1>Blog</h1></body></html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    process.env.VERCEL_URL = 'example-deployment.vercel.app';

    const options: GetMarkdownOptions = {
      pathname: '/blog',
      baseUrl: 'https://example.com',
      config: { include: ['**'], cache: false },
      cache: undefined,
      headers: { 'X-Test': '1' },
    };

    const md = await getMarkdownForPath(options);

    expect(md).toContain('Blog');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('falls back to VERCEL_URL when primary origin fails', async () => {
    const calls: string[] = [];
    const fetchMock = vi.fn(async (url: RequestInfo | URL) => {
      const u = typeof url === 'string' ? url : url.toString();
      calls.push(u);
      if (u.startsWith('https://example.com')) {
        return new Response('Unauthorized', { status: 401 });
      }
      if (u.startsWith('https://example-deployment.vercel.app')) {
        return new Response('<html><body><h1>OK</h1></body></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        });
      }
      return new Response('Not found', { status: 404 });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    process.env.VERCEL_URL = 'https://example-deployment.vercel.app';

    const options: GetMarkdownOptions = {
      pathname: '/',
      baseUrl: 'https://example.com',
      config: { include: ['**'], cache: false },
      cache: undefined,
      headers: { 'X-Test-Fallback': '1' },
    };

    const md = await getMarkdownForPath(options);

    expect(md).toContain('OK');
    expect(calls).toEqual([
      'https://example.com/',
      'https://example-deployment.vercel.app/',
    ]);
  });
});

