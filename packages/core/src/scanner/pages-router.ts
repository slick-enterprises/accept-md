/**
 * Pages Router (pages/) route scanner for Next.js.
 */

import { readdirSync, type Dirent } from 'node:fs';
import { join } from 'node:path';
import type { ParsedRoute, RouteSegment, DynamicSegmentType } from '../types.js';

const PAGE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];

function parseDynamicSegment(name: string): DynamicSegmentType | undefined {
  if (name.startsWith('[[...') && name.endsWith(']]')) return 'optional-catch-all';
  if (name.startsWith('[...') && name.endsWith(']')) return 'catch-all';
  if (name.startsWith('[') && name.endsWith(']')) return 'dynamic';
  return undefined;
}

function segmentToPath(seg: string): string {
  if (seg.startsWith('[[...') && seg.endsWith(']]')) return '*' + seg.slice(5, -2);
  if (seg.startsWith('[...') && seg.endsWith(']')) return '*' + seg.slice(4, -1);
  if (seg.startsWith('[') && seg.endsWith(']')) return ':' + seg.slice(1, -1);
  return seg;
}

export function scanPagesRouter(pagesDir: string, baseSegments: string[] = []): ParsedRoute[] {
  const routes: ParsedRoute[] = [];
  interface Entry {
    name: string;
    isFile: boolean;
    isDirectory: boolean;
  }
  let entries: Entry[];
  try {
    entries = readdirSync(pagesDir, { withFileTypes: true }).map((e: Dirent) => ({
      name: e.name,
      isFile: e.isFile(),
      isDirectory: e.isDirectory(),
    }));
  } catch {
    return routes;
  }

  for (const ent of entries) {
    const name = ent.name;
    const fullPath = join(pagesDir, name);

    if (name.startsWith('_') || name.startsWith('.')) continue;
    if (name === 'api') continue; // skip API routes

    if (ent.isFile) {
      const ext = PAGE_EXTENSIONS.find((e: string) => name.endsWith(e));
      if (!ext) continue;
      const base = name.slice(0, -ext.length);
      if (base !== 'index') {
        const pathSegments = [...baseSegments, base];
        const path = '/' + pathSegments.map(segmentToPath).join('/');
        const segments: RouteSegment[] = pathSegments.map((seg) => ({
          name: seg,
          type: 'page',
          relativePath: pathSegments.join('/'),
          dynamicType: parseDynamicSegment(seg),
        }));
        routes.push({
          path,
          isDynamic: pathSegments.some((s) => !!parseDynamicSegment(s)),
          segments,
          router: 'pages',
          sourcePath: fullPath,
        });
      } else {
        const path = baseSegments.length ? '/' + baseSegments.map(segmentToPath).join('/') : '/';
        const segments: RouteSegment[] = baseSegments.map((seg) => ({
          name: seg,
          type: 'page',
          relativePath: baseSegments.join('/'),
          dynamicType: parseDynamicSegment(seg),
        }));
        if (baseSegments.length) {
          segments.push({ name: 'index', type: 'page', relativePath: name, dynamicType: undefined });
        }
        routes.push({
          path,
          isDynamic: baseSegments.some((s) => !!parseDynamicSegment(s)),
          segments,
          router: 'pages',
          sourcePath: fullPath,
        });
      }
      continue;
    }

    if (ent.isDirectory) {
      const nextSegments = [...baseSegments, name];
      routes.push(...scanPagesRouter(fullPath, nextSegments));
    }
  }

  return routes;
}
