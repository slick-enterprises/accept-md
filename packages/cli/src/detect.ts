/**
 * Detect Next.js project, router type, and existing middleware.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { ProjectDetection } from '@accept-md/core';

function hasNextInPackage(pkgPath: string): boolean {
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const deps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.optionalDependencies,
      ...pkg.peerDependencies,
    };
    return typeof deps['next'] === 'string' || typeof deps['next'] === 'object';
  } catch {
    return false;
  }
}

function findNextAppInWorkspace(projectRoot: string): string | undefined {
  const workspaceDirs = ['apps', 'packages'];
  for (const dir of workspaceDirs) {
    const workspacePath = join(projectRoot, dir);
    if (!existsSync(workspacePath)) continue;
    try {
      const subdirs = readdirSync(workspacePath, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
      for (const sub of subdirs) {
        const subPkg = join(workspacePath, sub, 'package.json');
        if (existsSync(subPkg) && hasNextInPackage(subPkg)) return `${dir}/${sub}`;
      }
    } catch {
      //
    }
  }
  return undefined;
}

/**
 * Check if next.config has accept-md rewrite configuration.
 * Uses pattern matching to avoid executing the config file.
 */
function hasAcceptMdRewrite(projectRoot: string): boolean {
  const configPaths = [
    'next.config.js',
    'next.config.ts',
    'next.config.mjs',
    'src/next.config.js',
    'src/next.config.ts',
    'src/next.config.mjs',
  ];
  for (const configPath of configPaths) {
    const fullPath = join(projectRoot, configPath);
    if (!existsSync(fullPath)) continue;
    try {
      const content = readFileSync(fullPath, 'utf-8');
      // Check for accept-md rewrite pattern:
      // - destination: '/api/accept-md?path=:path*' or '/api/accept-md?path=:path'
      // - has header with accept and text/markdown
      const hasDestination = /['"]\/api\/accept-md\?path=:path/.test(content);
      const hasAcceptHeader = /accept.*text\/markdown|text\/markdown.*accept/i.test(content);
      const hasBeforeFiles = /beforeFiles/i.test(content);
      if (hasDestination && hasAcceptHeader && hasBeforeFiles) {
        return true;
      }
    } catch {
      // Continue to next config file
    }
  }
  return false;
}

export function detectProject(projectRoot: string): ProjectDetection {
  const pkgPath = join(projectRoot, 'package.json');
  let nextVersion: string | undefined;
  let isNext = false;
  let nextAppPath: string | undefined;
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      const deps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
        ...pkg.optionalDependencies,
        ...pkg.peerDependencies,
      };
      const nextDep = deps['next'];
      if (nextDep) {
        isNext = true;
        nextVersion = typeof nextDep === 'string' ? nextDep : undefined;
      }
    } catch {
      //
    }
  }
  if (!isNext) nextAppPath = findNextAppInWorkspace(projectRoot);
  const appDirCandidates = ['src/app', 'app'];
  const pagesDirCandidates = ['src/pages', 'pages'];
  let appDir: string | null = null;
  let pagesDir: string | null = null;
  for (const p of appDirCandidates) {
    if (existsSync(join(projectRoot, p))) {
      appDir = p;
      break;
    }
  }
  for (const p of pagesDirCandidates) {
    if (existsSync(join(projectRoot, p))) {
      pagesDir = p;
      break;
    }
  }
  const hasAppDir = appDir !== null;
  const hasPagesDir = pagesDir !== null;

  const middlewarePaths = ['middleware.ts', 'middleware.js', 'src/middleware.ts', 'src/middleware.js'];
  let middlewarePath: string | null = null;
  for (const p of middlewarePaths) {
    if (existsSync(join(projectRoot, p))) {
      middlewarePath = p;
      break;
    }
  }
  const configPaths = ['accept-md.config.js', 'accept-md.config.mjs', 'next.config.js', 'next.config.mjs'];
  let configPath: string | null = null;
  for (const p of configPaths) {
    if (existsSync(join(projectRoot, p)) && p.startsWith('accept-md')) {
      configPath = p;
      break;
    }
  }
  let routerType: 'app' | 'pages' | null = null;
  if (hasAppDir) routerType = 'app';
  else if (hasPagesDir) routerType = 'pages';

  const hasTypeScript = existsSync(join(projectRoot, 'tsconfig.json'));
  const hasRewriteConfig = hasAcceptMdRewrite(projectRoot);

  return {
    isNext,
    routerType,
    hasAppDir,
    hasPagesDir,
    appDir,
    pagesDir,
    nextVersion,
    middlewarePath,
    configPath,
    nextAppPath,
    hasTypeScript,
    hasRewriteConfig,
  };
}
