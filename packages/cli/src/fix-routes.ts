/**
 * Fix routes manifest: ensure dataRoutes exists so Next.js 15+ server can iterate it.
 * Addresses: [TypeError: routesManifest.dataRoutes is not iterable]
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROUTES_MANIFEST = '.next/routes-manifest.json';

export interface FixRoutesResult {
  ok: boolean;
  patched: boolean;
  message: string;
}

export function runFixRoutes(projectRoot: string): FixRoutesResult {
  const manifestPath = join(projectRoot, ROUTES_MANIFEST);

  if (!existsSync(manifestPath)) {
    return { ok: true, patched: false, message: 'No .next/routes-manifest.json found (run after next build).' };
  }

  let manifest: { dataRoutes?: unknown; [key: string]: unknown };
  try {
    const raw = readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(raw) as { dataRoutes?: unknown; [key: string]: unknown };
  } catch (err) {
    return {
      ok: false,
      patched: false,
      message: `Failed to read or parse ${ROUTES_MANIFEST}: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  if (Array.isArray(manifest.dataRoutes)) {
    return { ok: true, patched: false, message: 'routes-manifest.json already has dataRoutes.' };
  }

  manifest.dataRoutes = [];
  try {
    writeFileSync(manifestPath, JSON.stringify(manifest) + '\n', 'utf-8');
  } catch (err) {
    return {
      ok: false,
      patched: false,
      message: `Failed to write ${ROUTES_MANIFEST}: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  return {
    ok: true,
    patched: true,
    message: 'Added missing dataRoutes to routes-manifest.json (Next.js 15 compatibility).',
  };
}
