/**
 * Default config and config loading for accept-md.
 */

import type { NextMarkdownConfig } from './types.js';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export const DEFAULT_CONFIG: NextMarkdownConfig = {
  include: ['/**'],
  exclude: ['/api/**', '/_next/**', '/__markdown/**'],
  cleanSelectors: ['nav', 'footer', '.no-markdown', '[data-no-markdown]', 'script', 'style'],
  outputMode: 'markdown',
  cache: true,
  transformers: [],
  debug: false,
};

const CONFIG_NAMES = ['accept-md.config.js', 'accept-md.config.mjs', 'accept-md.config.cjs'];

export function loadConfig(projectRoot: string): NextMarkdownConfig {
  for (const name of CONFIG_NAMES) {
    const path = join(projectRoot, name);
    if (!existsSync(path)) continue;
    try {
      // Dynamic import for ESM/CJS
      const mod = require(path);
      const user = mod.default ?? mod;
      return mergeConfig(DEFAULT_CONFIG, user);
    } catch {
      // try next name
    }
  }
  return { ...DEFAULT_CONFIG };
}

function mergeConfig(
  base: NextMarkdownConfig,
  user: Partial<NextMarkdownConfig>
): NextMarkdownConfig {
  return {
    ...base,
    ...user,
    include: user.include ?? base.include,
    exclude: user.exclude ?? base.exclude,
    cleanSelectors: user.cleanSelectors ?? base.cleanSelectors,
    transformers: user.transformers ?? base.transformers,
  };
}

export function pathMatchesGlobs(pathname: string, globs: string[]): boolean {
  const normalized = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
  for (const pattern of globs) {
    if (matchGlob(normalized, pattern)) return true;
  }
  return false;
}

/** Simple glob: * matches one segment, ** matches rest. */
function matchGlob(pathname: string, pattern: string): boolean {
  if (pattern === '/**') return true;
  const pathParts = pathname.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);
  let p = 0;
  let q = 0;
  while (p < patternParts.length && q < pathParts.length) {
    const part = patternParts[p];
    if (part === '**') return true;
    if (part === '*') {
      p++;
      q++;
      continue;
    }
    if (part !== pathParts[q]) return false;
    p++;
    q++;
  }
  if (p < patternParts.length && patternParts[p] === '**') return true;
  return p === patternParts.length && q === pathParts.length;
}

export function shouldExcludePath(pathname: string, config: NextMarkdownConfig): boolean {
  if (config.exclude?.length && pathMatchesGlobs(pathname, config.exclude)) return true;
  if (config.include?.length && !pathMatchesGlobs(pathname, config.include)) return true;
  return false;
}
