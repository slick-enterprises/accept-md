/**
 * Runtime config loader for accept-md (avoids pulling in scanner).
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import type { NextMarkdownConfig } from './types.js';

const require = createRequire(import.meta.url);

const DEFAULTS: NextMarkdownConfig = {
  include: ['/**'],
  exclude: ['/api/**', '/_next/**', '/__markdown/**'],
  cleanSelectors: ['nav', 'footer', '.no-markdown', '[data-no-markdown]', 'script', 'style'],
  outputMode: 'markdown',
  cache: true,
  transformers: [],
  debug: false,
};

const CONFIG_NAMES = ['accept-md.config.js', 'accept-md.config.mjs', 'accept-md.config.cjs'];

export function loadConfig(projectRoot: string = process.cwd()): NextMarkdownConfig {
  for (const name of CONFIG_NAMES) {
    const path = join(projectRoot, name);
    if (!existsSync(path)) continue;
    try {
      const mod = require(path);
      const user = mod.default ?? mod;
      return { ...DEFAULTS, ...user };
    } catch {
      //
    }
  }
  return { ...DEFAULTS };
}
