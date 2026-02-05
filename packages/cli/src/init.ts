/**
 * Init command: generate middleware, handler, config, and add dependency.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { detectProject } from './detect.js';
import { scanProject } from '@accept-md/core';
import {
  MIDDLEWARE_TEMPLATE,
  APP_ROUTE_HANDLER_TEMPLATE,
  PAGES_API_HANDLER_TEMPLATE,
} from 'accept-md-runtime';

const MARKDOWN_MARKER = 'accept-md';

/** Get the current CLI version to use for accept-md-runtime. */
function getRuntimeVersion(): string {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const cliPkgPath = join(__dirname, '..', 'package.json');
    if (existsSync(cliPkgPath)) {
      const cliPkg = JSON.parse(readFileSync(cliPkgPath, 'utf-8'));
      const version = cliPkg.version;
      if (version && typeof version === 'string') {
        return `^${version}`;
      }
    }
  } catch {
    // Fall through to default
  }
  // Fallback: use current version (update this when publishing)
  return '^1.0.24';
}

/** When writing .ts files, add type annotations so strict type-check passes. Leaves .js content unchanged. */
function forTypeScript(
  content: string,
  kind: 'app-route' | 'pages-handler' | 'middleware' | 'wrapper',
  ext: string
): string {
  if (ext !== 'ts') return content;
  if (kind === 'app-route') {
    return content
      .replace(
        "import { NextResponse } from 'next/server';",
        "import { NextResponse } from 'next/server';\nimport type { NextRequest } from 'next/server';"
      )
      .replace(/\/\*\* @param \{import\('next\/server'\)\.NextRequest\} request \*\/\n/, '')
      .replace('export async function GET(request) {', 'export async function GET(request: NextRequest) {');
  }
  if (kind === 'pages-handler') {
    return content
      .replace(
        "import { getMarkdownForPath, loadConfig } from 'accept-md-runtime';",
        "import type { NextApiRequest, NextApiResponse } from 'next';\nimport { getMarkdownForPath, loadConfig } from 'accept-md-runtime';"
      )
      .replace(
        /\/\*\* @param \{import\('next'\)\.NextApiRequest\} req @param \{import\('next'\)\.NextApiResponse\} res \*\/\n/,
        ''
      )
      .replace(
        'export default async function handler(req, res) {',
        'export default async function handler(req: NextApiRequest, res: NextApiResponse) {'
      );
  }
  if (kind === 'middleware' || kind === 'wrapper') {
    const withImport = content.replace(
      "import { NextResponse } from 'next/server';",
      "import { NextResponse } from 'next/server';\nimport type { NextRequest } from 'next/server';"
    );
    const noJsdoc = withImport
      .replace(/\/\*\* @param \{import\('next\/server'\)\.NextRequest\} request \*\/\n/g, '')
      .replace('function markdownMiddleware(request) {', 'function markdownMiddleware(request: NextRequest) {')
      .replace('export function middleware(request) {', 'export function middleware(request: NextRequest) {')
      .replace('export async function middleware(request) {', 'export async function middleware(request: NextRequest) {');
    // For wrapper files, add type assertion for default export access
    if (kind === 'wrapper') {
      return noJsdoc.replace(
        "mod['default']",
        "(mod as { default?: typeof mod.middleware }).default"
      );
    }
    return noJsdoc;
  }
  return content;
}

function getMiddlewareWithExisting(existingPath: string, projectRoot: string): string {
  const content = readFileSync(join(projectRoot, existingPath), 'utf-8');
  if (content.includes(MARKDOWN_MARKER)) return MIDDLEWARE_TEMPLATE;

  // Import without extension - TypeScript/Next.js will resolve .ts/.js at runtime
  const userImportPath = './middleware.user';

  const wrapper = `// Wrapper: accept-md runs first, then your middleware
import { NextResponse } from 'next/server';

const MARKDOWN_ACCEPT = new RegExp('\\\\btext/markdown\\\\b', 'i');
const EXCLUDED_PREFIXES = ['/api/', '/_next/'];

/** @param {import('next/server').NextRequest} request */
async function markdownMiddleware(request) {
  const pathname = request.nextUrl.pathname;
  const accept = (request.headers.get('accept') || '').toLowerCase();
  if (!MARKDOWN_ACCEPT.test(accept)) return null;
  if (EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  const url = request.nextUrl.clone();
  url.pathname = '/api/accept-md';
  url.searchParams.set('path', pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-accept-md-path', pathname);
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

/** @param {import('next/server').NextRequest} request */
export async function middleware(request) {
  const markdownRes = await markdownMiddleware(request);
  if (markdownRes) return markdownRes;
  const mod = await import('${userImportPath}');
  // Support both named export and default export
  const userMiddleware = mod.middleware ?? mod['default'];
  if (!userMiddleware) {
    throw new Error('middleware.user must export either a named "middleware" function or a default export');
  }
  return userMiddleware(request);
}
`;
  const userPath = existingPath.replace(/\.(ts|js)$/, '.user.$1');
  writeFileSync(join(projectRoot, userPath), content);
  return wrapper;
}

export interface InitOverrides {
  appDir?: string;
  pagesDir?: string;
  middlewarePath?: string;
}

export async function runInit(
  projectRoot: string,
  overrides?: InitOverrides
): Promise<{ ok: boolean; messages: string[] }> {
  const messages: string[] = [];
  const detection = detectProject(projectRoot);

  if (!detection.isNext) {
    const msg = detection.nextAppPath
      ? `Not a Next.js project in this directory. Run from the app that has "next": cd ${detection.nextAppPath} && npx accept-md init`
      : 'Not a Next.js project (no "next" in dependencies, devDependencies, optionalDependencies, or peerDependencies).';
    return { ok: false, messages: [msg] };
  }

  if (!detection.routerType) {
    return { ok: false, messages: ['No app/ or pages/ directory found.'] };
  }

  const appDir = overrides?.appDir ?? detection.appDir ?? 'app';
  const pagesDir = overrides?.pagesDir ?? detection.pagesDir ?? 'pages';
  const routesUnderSrc = appDir.startsWith('src/') || pagesDir.startsWith('src/');
  const middlewareExt = detection.hasTypeScript ? 'ts' : 'js';
  const defaultMiddlewarePath = routesUnderSrc ? `src/middleware.${middlewareExt}` : `middleware.${middlewareExt}`;
  const middlewarePathRel =
    overrides?.middlewarePath ?? detection.middlewarePath ?? defaultMiddlewarePath;

  messages.push(`Detected Next.js (${detection.routerType} router).`);

  const { routes } = scanProject(projectRoot, { appDir, pagesDir });
  messages.push(`Found ${routes.length} route(s).`);

  const middlewarePathAbs = join(projectRoot, middlewarePathRel);

  let middlewareContent: string;
  if (detection.middlewarePath && existsSync(middlewarePathAbs)) {
    middlewareContent = getMiddlewareWithExisting(middlewarePathRel, projectRoot);
    if (middlewareContent.includes('middleware.user')) {
      const userPath = middlewarePathRel.replace(/\.(ts|js)$/, '.user.$1');
      messages.push(`Existing middleware backed up to ${userPath} – markdown runs first.`);
    }
  } else {
    middlewareContent = MIDDLEWARE_TEMPLATE;
  }
  const middlewareOutputExt = middlewarePathRel.match(/\.(ts|js)$/)?.[1] ?? 'js';
  middlewareContent = forTypeScript(
    middlewareContent,
    middlewareContent.includes('middleware.user') ? 'wrapper' : 'middleware',
    middlewareOutputExt
  );

  writeFileSync(middlewarePathAbs, middlewareContent);
  messages.push(`Wrote ${middlewarePathRel}.`);

  const routeExt = detection.hasTypeScript ? 'ts' : 'js';
  if (detection.routerType === 'app') {
    const handlerDir = join(projectRoot, appDir, 'api', 'accept-md');
    mkdirSync(handlerDir, { recursive: true });
    const routePath = join(handlerDir, `route.${routeExt}`);
    const routeContent = forTypeScript(
      APP_ROUTE_HANDLER_TEMPLATE.replace(/\\\\/g, '\\'),
      'app-route',
      routeExt
    );
    writeFileSync(routePath, routeContent);
    messages.push(`Wrote ${routePath}.`);
  } else {
    const apiDir = join(projectRoot, pagesDir, 'api');
    mkdirSync(apiDir, { recursive: true });
    const markdownDir = join(apiDir, 'accept-md');
    mkdirSync(markdownDir, { recursive: true });
    const indexPath = join(markdownDir, `index.${routeExt}`);
    const indexContent = forTypeScript(
      PAGES_API_HANDLER_TEMPLATE.replace(/\\\\/g, '\\'),
      'pages-handler',
      routeExt
    );
    writeFileSync(indexPath, indexContent);
    messages.push(`Wrote ${pagesDir}/api/accept-md/index.${routeExt}.`);
  }

  const configPath = join(projectRoot, 'accept-md.config.js');
  if (!existsSync(configPath)) {
    const configContent = `/** @type { import('accept-md-runtime').NextMarkdownConfig } */
module.exports = {
  include: ['/**'],
  exclude: ['/api/**', '/_next/**'],
  cleanSelectors: ['nav', 'footer', '.no-markdown'],
  outputMode: 'markdown',
  cache: true,
  transformers: [],
};
`;
    writeFileSync(configPath, configContent);
    messages.push('Created accept-md.config.js.');
  } else {
    messages.push('accept-md.config.js already exists; skipping.');
  }

  const pkgPath = join(projectRoot, 'package.json');
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    let pkgModified = false;
    const runtimeVersion = getRuntimeVersion();
    const hasRuntimeInDeps = pkg.dependencies?.['accept-md-runtime'];
    const hasRuntimeInDevDeps = pkg.devDependencies?.['accept-md-runtime'];
    
    if (!hasRuntimeInDeps && !hasRuntimeInDevDeps) {
      pkg.dependencies = pkg.dependencies || {};
      pkg.dependencies['accept-md-runtime'] = runtimeVersion;
      pkgModified = true;
      messages.push(`Added accept-md-runtime@${runtimeVersion} to dependencies. Run pnpm install (or npm install).`);
    } else {
      // Update existing installation to latest version
      const currentVersion = hasRuntimeInDeps || hasRuntimeInDevDeps;
      if (currentVersion !== runtimeVersion) {
        if (hasRuntimeInDeps) {
          pkg.dependencies['accept-md-runtime'] = runtimeVersion;
        } else {
          pkg.devDependencies['accept-md-runtime'] = runtimeVersion;
        }
        pkgModified = true;
        messages.push(`Updated accept-md-runtime to ${runtimeVersion}. Run pnpm install (or npm install).`);
      }
    }
    // Next.js 15+ expects routes-manifest.dataRoutes to be iterable; add postbuild to patch if missing
    if (!pkg.scripts) pkg.scripts = {};
    if (!pkg.scripts.postbuild) {
      pkg.scripts.postbuild = 'npx accept-md fix-routes';
      pkgModified = true;
      messages.push('Added postbuild script (npx accept-md fix-routes) for Next.js 15 compatibility.');
    }
    if (pkgModified) writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }

  return { ok: true, messages };
}
