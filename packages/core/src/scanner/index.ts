/**
 * Unified route scanner for App Router and Pages Router.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { scanAppRouter } from './app-router.js';
import { scanPagesRouter } from './pages-router.js';
import type { ParsedRoute, RouterType } from '../types.js';

export { scanAppRouter } from './app-router.js';
export { scanPagesRouter } from './pages-router.js';

export interface ScanProjectOptions {
  appDir?: string;
  pagesDir?: string;
}

export function scanProject(
  projectRoot: string,
  options?: ScanProjectOptions
): { routes: ParsedRoute[]; routerType: RouterType | null } {
  const appDirPath = join(projectRoot, options?.appDir ?? 'app');
  const pagesDirPath = join(projectRoot, options?.pagesDir ?? 'pages');
  const hasApp = existsSync(appDirPath);
  const hasPages = existsSync(pagesDirPath);

  const routes: ParsedRoute[] = [];
  let routerType: RouterType | null = null;

  if (hasApp) {
    routes.push(...scanAppRouter(appDirPath));
    routerType = 'app';
  }
  if (hasPages) {
    const pageRoutes = scanPagesRouter(pagesDirPath).filter(
      (r) => !r.sourcePath.includes('/api/')
    );
    routes.push(...pageRoutes);
    if (!routerType) routerType = 'pages';
  }

  // Dedupe by path (app and pages can both exist)
  const seen = new Set<string>();
  const unique = routes.filter((r) => {
    const key = r.path;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { routes: unique, routerType };
}
