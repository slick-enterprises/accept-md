/**
 * App Router (app/) route scanner for Next.js 13+.
 */

import { readdirSync, type Dirent } from 'node:fs';
import { join } from 'node:path';
import type { ParsedRoute, RouteSegment, DynamicSegmentType } from '../types.js';

function parseDynamicSegment(name: string): DynamicSegmentType | undefined {
  if (name.startsWith('[[...') && name.endsWith(']]')) return 'optional-catch-all';
  if (name.startsWith('[...') && name.endsWith(']')) return 'catch-all';
  if (name.startsWith('[') && name.endsWith(']')) return 'dynamic';
  return undefined;
}

function isLayoutOrPageDir(dirPath: string): boolean {
  try {
    const entries = readdirSync(dirPath);
    return entries.some((e: string) => {
      const base = e.replace(/\.(tsx?|jsx?)$/, '');
      return base === 'page' || base === 'layout';
    });
  } catch {
    return false;
  }
}

/**
 * Recursively scan app directory and collect page routes (paths that have a page.tsx/js).
 */
export function scanAppRouter(appDir: string, baseSegments: string[] = []): ParsedRoute[] {
  const routes: ParsedRoute[] = [];
  let entries: Dirent[];
  try {
    entries = readdirSync(appDir, { withFileTypes: true }) as Dirent[];
  } catch {
    return routes;
  }

  for (const ent of entries) {
    const fullPath = join(appDir, ent.name);
    const name = ent.name;

    // Skip private / internal
    if (name.startsWith('_') || name.startsWith('.')) continue;
    // Skip route groups (parentheses) for path - they don't affect URL
    const segmentName = name.startsWith('(') && name.endsWith(')') ? '' : name;
    // Parallel routes @xxx
    const parallelRoute = name.startsWith('@') ? name : undefined;
    // Intercepting (.) (..) etc.
    const intercepting = /^\(\.\)|^\(\.\.\)/.test(name) ? name : undefined;

    if (ent.isFile()) {
      const base = name.replace(/\.(tsx?|jsx?)$/, '');
      if (base === 'page' || base === 'route') {
        const pathSegments = baseSegments;
        const path = '/' + pathSegments.map(segmentToPath).filter(Boolean).join('/');
        const segments: RouteSegment[] = pathSegments.map((seg) => ({
          name: seg,
          type: 'page',
          relativePath: pathSegments.join('/'),
          dynamicType: parseDynamicSegment(seg),
        }));
        routes.push({
          path: path || '/',
          isDynamic: pathSegments.some((s) => !!parseDynamicSegment(s)),
          segments,
          router: 'app',
          sourcePath: fullPath,
          parallelRoute,
          intercepting,
        });
      }
      continue;
    }

    if (ent.isDirectory()) {
      const nextSegments = segmentName ? [...baseSegments, segmentName] : baseSegments;
      const childPath = join(appDir, ent.name);
      // Recurse into layout/page directories
      if (isLayoutOrPageDir(childPath) || segmentName.startsWith('[')) {
        routes.push(...scanAppRouter(childPath, nextSegments));
      }
    }
  }

  return routes;
}

function segmentToPath(seg: string): string {
  if (seg.startsWith('[[...') && seg.endsWith(']]')) return '*' + seg.slice(5, -2);
  if (seg.startsWith('[...') && seg.endsWith(']')) return '*' + seg.slice(4, -1);
  if (seg.startsWith('[') && seg.endsWith(']')) return ':' + seg.slice(1, -1);
  return seg;
}
