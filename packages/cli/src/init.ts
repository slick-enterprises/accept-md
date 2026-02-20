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
  SVELTEKIT_ROUTE_HANDLER_TEMPLATE,
} from 'accept-md-runtime';

const MARKDOWN_MARKER = 'accept-md';

/**
 * Fetch the latest published version of a package from npm registry.
 */
async function fetchLatestVersionFromRegistry(packageName: string): Promise<string | null> {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`, {
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.version || null;
  } catch {
    return null;
  }
}

/** Get the current CLI version to use for accept-md-runtime. */
export async function getRuntimeVersion(): Promise<string> {
  // Try fetching latest from npm registry first
  const latestVersion = await fetchLatestVersionFromRegistry('accept-md');
  if (latestVersion) {
    return latestVersion; // Return exact version, no ^ prefix
  }

  // Fallback to local package.json version
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const cliPkgPath = join(__dirname, '..', 'package.json');
    if (existsSync(cliPkgPath)) {
      const cliPkg = JSON.parse(readFileSync(cliPkgPath, 'utf-8'));
      const version = cliPkg.version;
      if (version && typeof version === 'string') {
        return version; // Return exact version, no ^ prefix
      }
    }
  } catch {
    // Fall through to default
  }
  // Fallback: use current version (update this when publishing)
  return '4.0.2';
}

/**
 * Check if installed accept-md-runtime version matches expected version.
 */
export function checkRuntimeVersion(
  projectRoot: string,
  expectedVersion: string
): { compatible: boolean; installed?: string; message: string } {
  const pkgPath = join(projectRoot, 'package.json');
  if (!existsSync(pkgPath)) {
    return {
      compatible: true,
      message: 'accept-md-runtime not installed yet.',
    };
  }

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const installedVersion =
      pkg.dependencies?.['accept-md-runtime'] || pkg.devDependencies?.['accept-md-runtime'];

    if (!installedVersion) {
      return {
        compatible: true,
        message: 'accept-md-runtime not installed yet.',
      };
    }

    // Extract version number from version string (handle ranges like ^2.0.1, ~2.0.1, 2.0.1)
    const extractVersion = (v: string): string => {
      // Remove range prefixes
      return v.replace(/^[\^~>=<]+\s*/, '').trim();
    };

    const installed = extractVersion(installedVersion);
    const expected = extractVersion(expectedVersion);

    if (installed === expected) {
      return {
        compatible: true,
        installed,
        message: `Version match: accept-md-runtime@${installed}`,
      };
    }

    // Check if it's a major version mismatch (more serious)
    const installedMajor = installed.split('.')[0];
    const expectedMajor = expected.split('.')[0];
    const isMajorMismatch = installedMajor !== expectedMajor;

    return {
      compatible: false,
      installed,
      message: isMajorMismatch
        ? `⚠️  Major version mismatch: CLI expects accept-md-runtime@${expected} but found ${installedVersion}. This may cause compatibility issues. Run: npm install accept-md-runtime@${expected}`
        : `⚠️  Version mismatch: CLI expects accept-md-runtime@${expected} but found ${installedVersion}. Run: npm install accept-md-runtime@${expected}`,
    };
  } catch {
    return {
      compatible: true,
      message: 'Could not check version (package.json parse error).',
    };
  }
}

/**
 * Find next.config file in project root.
 */
function findNextConfig(projectRoot: string): string | null {
  const configPaths = [
    'next.config.js',
    'next.config.ts',
    'next.config.mjs',
  ];
  for (const configPath of configPaths) {
    const fullPath = join(projectRoot, configPath);
    if (existsSync(fullPath)) {
      return configPath;
    }
  }
  return null;
}

/**
 * Check if next.config already has accept-md rewrite.
 * Matches the rewrite format: /api/accept-md/:path*
 * Detection is flexible - only requires destination and accept header (source pattern can vary)
 */
function hasAcceptMdRewriteInConfig(projectRoot: string, configPath: string): boolean {
  try {
    const fullPath = join(projectRoot, configPath);
    const content = readFileSync(fullPath, 'utf-8');
    // Check for accept-md rewrite pattern - match the actual format
    // Pattern: destination: '/api/accept-md/:path*' (path parameter)
    const hasDestinationPathParam = /['"]\/api\/accept-md\/:path\*['"]/.test(content);
    // Check for accept header - look for both 'accept' key and 'text/markdown' value
    // They may be on different lines, so check independently
    const hasAcceptKey = /\bkey\s*:\s*['"]accept['"]/i.test(content);
    const hasMarkdownValue = /text\/markdown/i.test(content);
    const hasAcceptHeader = hasAcceptKey && hasMarkdownValue;
    // If we have the destination and accept header, it's an accept-md rewrite
    // Source pattern can vary (with or without _next exclusion, different regex patterns)
    return hasDestinationPathParam && hasAcceptHeader;
  } catch {
    return false;
  }
}

/**
 * Add accept-md rewrite to next.config file.
 * Uses string manipulation to safely add the rewrite without executing the config.
 * Idempotent: safe to run multiple times.
 */
function addRewriteToNextConfig(projectRoot: string, configPath: string): { success: boolean; message: string } {
  try {
    const fullPath = join(projectRoot, configPath);
    let content = readFileSync(fullPath, 'utf-8');
    
    // Check if rewrite already exists before proceeding (idempotent check)
    if (hasAcceptMdRewriteInConfig(projectRoot, configPath)) {
      return { success: true, message: `Accept-md rewrite already exists in ${configPath}.` };
    }
    
    // Detect if this is an ES module (.mjs or uses export default)
    const isESModule = configPath.endsWith('.mjs') || /export\s+default/.test(content);
    
    // Ensure .mjs files use export default, not module.exports
    if (isESModule && /module\.exports\s*=/.test(content)) {
      // Replace module.exports with export default
      content = content.replace(/module\.exports\s*=\s*nextConfig;?/, 'export default nextConfig;');
    }
    
    // Format the rewrite object as a string (JS-compatible)
    // Use path parameter format in destination for catch-all patterns
    const rewriteStr = `    {
      source: '/:path*',
      destination: '/api/accept-md/:path*',
      has: [
        {
          type: 'header',
          key: 'accept',
          value: '(.*)text/markdown(.*)',
        },
      ],
    }`;
    
    // Check if rewrites already exist
    const hasRewrites = /rewrites\s*[:=]/.test(content);
    const hasBeforeFiles = /beforeFiles\s*[:=]/.test(content);
    
    if (hasRewrites && hasBeforeFiles) {
      // Find beforeFiles array and add to it
      const beforeFilesRegex = /beforeFiles\s*[:=]\s*\[/;
      const beforeFilesMatch = content.match(beforeFilesRegex);
      if (beforeFilesMatch) {
        const insertPos = beforeFilesMatch.index! + beforeFilesMatch[0].length;
        // Find the matching closing bracket for this array
        const afterBracket = content.slice(insertPos);
        let bracketCount = 1;
        let inString = false;
        let stringChar = '';
        let arrayEndPos = -1;
        
        for (let i = 0; i < afterBracket.length; i++) {
          const char = afterBracket[i];
          if (!inString && (char === '"' || char === "'" || char === '`')) {
            inString = true;
            stringChar = char;
          } else if (inString && char === stringChar && (i === 0 || afterBracket[i - 1] !== '\\')) {
            inString = false;
          } else if (!inString) {
            if (char === '[') bracketCount++;
            if (char === ']') {
              bracketCount--;
              if (bracketCount === 0) {
                arrayEndPos = i;
                break;
              }
            }
          }
        }
        
        if (arrayEndPos === -1) {
          return { success: false, message: `Could not find closing bracket for beforeFiles array in ${configPath}.` };
        }
        
        const arrayContent = afterBracket.slice(0, arrayEndPos);
        
        // Check if accept-md rewrite already exists in this array (more robust check)
        // Check for both path parameter and query string formats
        // Only need destination and accept header - source pattern can vary
        const hasAcceptMdPathParam = /\/api\/accept-md\/:path\*/.test(arrayContent);
        const hasAcceptMdQuery = /\/api\/accept-md\?path=:path\*/.test(arrayContent);
        const hasAcceptHeader = /accept.*text\/markdown|text\/markdown.*accept/i.test(arrayContent);
        if ((hasAcceptMdPathParam || hasAcceptMdQuery) && hasAcceptHeader) {
          return { success: true, message: `Accept-md rewrite already exists in ${configPath}.` };
        }
        
        // Determine if we need a comma before the new entry
        // Find the last non-whitespace, non-comment character before the closing bracket
        const trimmedArray = arrayContent.trim();
        const needsComma = trimmedArray.length > 0 && 
                          !/^(\s*\/\/[^\n]*\s*)*$/.test(trimmedArray) &&
                          !trimmedArray.endsWith(',');
        
        // Insert the rewrite before the closing bracket
        const beforeInsert = content.slice(0, insertPos + arrayEndPos);
        const afterInsert = content.slice(insertPos + arrayEndPos);
        
        let newContent = beforeInsert;
        if (needsComma) {
          newContent += ',\n';
        } else if (trimmedArray.length > 0) {
          newContent += '\n';
        }
        newContent += rewriteStr + '\n' + afterInsert;
        
        // Ensure ES modules use export default
        if (isESModule && /module\.exports\s*=/.test(newContent)) {
          newContent = newContent.replace(/module\.exports\s*=\s*nextConfig;?/, 'export default nextConfig;');
        }
        
        writeFileSync(fullPath, newContent);
        return { success: true, message: `Added accept-md rewrite to ${configPath}.` };
      }
    } else if (hasRewrites) {
      // Has rewrites but no beforeFiles - add beforeFiles
      // Find the rewrites object/function
      const rewritesRegex = /rewrites\s*[:=]\s*(async\s*\(\)\s*=>\s*\{|\(\)\s*=>\s*\{|\{)/;
      const rewritesMatch = content.match(rewritesRegex);
      if (rewritesMatch) {
        let insertPos = rewritesMatch.index! + rewritesMatch[0].length;
        
        // If it's a function, find the return statement and the opening brace of the returned object
        if (rewritesMatch[0].includes('=>')) {
          const afterMatch = content.slice(insertPos);
          const returnMatch = afterMatch.match(/\s*return\s*\{/);
          if (returnMatch) {
            insertPos = insertPos + returnMatch.index! + returnMatch[0].length;
          }
        }
        
        let newContent =
          content.slice(0, insertPos) +
          '\n    beforeFiles: [\n' +
          rewriteStr +
          '\n    ],\n' +
          content.slice(insertPos);
        
        // Ensure ES modules use export default
        if (isESModule && /module\.exports\s*=/.test(newContent)) {
          newContent = newContent.replace(/module\.exports\s*=\s*nextConfig;?/, 'export default nextConfig;');
        }
        
        writeFileSync(fullPath, newContent);
        return { success: true, message: `Added accept-md rewrite to ${configPath}.` };
      }
    } else {
      // No rewrites at all - add rewrites function or object
      const configMatch = content.match(/(const|let|var)\s+nextConfig\s*[:=]/);
      
      if (configMatch) {
        const insertPos = configMatch.index! + configMatch[0].length;
        // Find the closing brace of nextConfig
        let braceCount = 0;
        let inString = false;
        let stringChar = '';
        let pos = insertPos;
        while (pos < content.length) {
          const char = content[pos];
          if (!inString && (char === '"' || char === "'" || char === '`')) {
            inString = true;
            stringChar = char;
          } else if (inString && char === stringChar && (pos === 0 || content[pos - 1] !== '\\')) {
            inString = false;
          } else if (!inString) {
            if (char === '{') braceCount++;
            if (char === '}') {
              braceCount--;
              if (braceCount === 0) {
                // Found closing brace - insert before it
                const newContent =
                  content.slice(0, pos) +
                  '\n  rewrites: async () => {\n    return {\n      beforeFiles: [\n' +
                  rewriteStr +
                  '\n      ],\n    };\n  },\n' +
                  content.slice(pos);
                
                // Ensure ES modules use export default
                let finalContent = newContent;
                if (isESModule && !/export\s+default/.test(finalContent)) {
                  // Replace module.exports with export default if it exists
                  finalContent = finalContent.replace(/module\.exports\s*=\s*nextConfig;?/, 'export default nextConfig;');
                  // Or add export default if it doesn't exist
                  if (!/export\s+default/.test(finalContent) && !/module\.exports/.test(finalContent)) {
                    finalContent = finalContent.trimEnd() + '\n\nexport default nextConfig;';
                  }
                }
                
                writeFileSync(fullPath, finalContent);
                return { success: true, message: `Added accept-md rewrite to ${configPath}.` };
              }
            }
          }
          pos++;
        }
      }
    }
    
    return { success: false, message: `Could not automatically add rewrite to ${configPath}. Please add it manually.` };
  } catch (err) {
    return {
      success: false,
      message: `Error modifying ${configPath}: ${err instanceof Error ? err.message : 'Unknown error'}`,
    };
  }
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

async function runInitSvelteKit(
  projectRoot: string,
  detection: any,
  messages: string[]
): Promise<{ ok: boolean; messages: string[] }> {
  messages.push('Detected SvelteKit project.');

  // Determine routes directory (src/routes or routes)
  let routesDir = detection.svelteKitRoutesDir ?? null;
  if (!routesDir) {
    if (existsSync(join(projectRoot, 'src/routes'))) {
      routesDir = 'src/routes';
    } else if (existsSync(join(projectRoot, 'routes'))) {
      routesDir = 'routes';
    }
  }
  if (!routesDir) {
    return {
      ok: false,
      messages: [
        ...messages,
        'Could not find SvelteKit routes directory (expected src/routes or routes).',
      ],
    };
  }

  const hasRoutesDir = existsSync(join(projectRoot, routesDir));
  if (!hasRoutesDir) {
    return {
      ok: false,
      messages: [
        ...messages,
        `SvelteKit routes directory "${routesDir}" does not exist.`,
      ],
    };
  }

  const routeExt = detection.hasTypeScript ? 'ts' : 'js';

  // Create /api/accept-md/[...path]/+server.{js,ts}
  const handlerDir = join(projectRoot, routesDir, 'api', 'accept-md', '[...path]');
  mkdirSync(handlerDir, { recursive: true });
  const handlerPath = join(handlerDir, `+server.${routeExt}`);
  const handlerContent = SVELTEKIT_ROUTE_HANDLER_TEMPLATE.replace(/\\\\/g, '\\');
  writeFileSync(handlerPath, handlerContent);
  messages.push(`Wrote ${join(routesDir, 'api', 'accept-md', '[...path]', `+server.${routeExt}`)}.`);

  // Write accept-md.config.js if it does not exist (shared config shape with Next.js)
  const configPath = join(projectRoot, 'accept-md.config.js');
  if (!existsSync(configPath)) {
    const configContent = `/** @type { import('accept-md-runtime').NextMarkdownConfig } */
module.exports = {
  include: ['/**'],
  exclude: ['/api/**', '/_next/**'],
  cleanSelectors: ['nav', 'footer', '.no-markdown', '[data-no-markdown]', 'script', 'style'],
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

  // Ensure accept-md-runtime dependency is present and aligned with CLI version
  const pkgPath = join(projectRoot, 'package.json');
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    let pkgModified = false;
    const runtimeVersion = await getRuntimeVersion();
    const hasRuntimeInDeps = pkg.dependencies?.['accept-md-runtime'];
    const hasRuntimeInDevDeps = pkg.devDependencies?.['accept-md-runtime'];

    // Check version compatibility before installing/updating
    if (hasRuntimeInDeps || hasRuntimeInDevDeps) {
      const versionCheck = checkRuntimeVersion(projectRoot, runtimeVersion);
      if (!versionCheck.compatible) {
        messages.push(versionCheck.message);
      }
    }

    if (!hasRuntimeInDeps && !hasRuntimeInDevDeps) {
      pkg.dependencies = pkg.dependencies || {};
      pkg.dependencies['accept-md-runtime'] = runtimeVersion;
      pkgModified = true;
      messages.push(
        `Added accept-md-runtime@${runtimeVersion} to dependencies. Run pnpm install (or npm install).`
      );
    } else {
      // Update existing installation to exact matching version
      const currentVersion = hasRuntimeInDeps || hasRuntimeInDevDeps;
      const extractVersion = (v: string): string => v.replace(/^[\^~>=<]+\s*/, '').trim();
      if (extractVersion(currentVersion) !== runtimeVersion) {
        if (hasRuntimeInDeps) {
          pkg.dependencies['accept-md-runtime'] = runtimeVersion;
        } else {
          pkg.devDependencies['accept-md-runtime'] = runtimeVersion;
        }
        pkgModified = true;
        messages.push(
          `Updated accept-md-runtime to ${runtimeVersion}. Run pnpm install (or npm install).`
        );
      }
    }

    if (pkgModified) {
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }
  }

  return { ok: true, messages };
}

/**
 * Check version compatibility between CLI and installed runtime.
 * Exported for use in version-check command.
 */
export async function runVersionCheck(projectRoot: string): Promise<{ ok: boolean; messages: string[] }> {
  const messages: string[] = [];
  
  // Get CLI version
  const cliVersion = await getRuntimeVersion();
  messages.push(`CLI version: ${cliVersion}`);
  
  // Check installed runtime version
  const versionCheck = checkRuntimeVersion(projectRoot, cliVersion);
  
  if (versionCheck.installed) {
    messages.push(`Installed accept-md-runtime: ${versionCheck.installed}`);
  } else {
    messages.push('accept-md-runtime: not installed');
  }
  
  if (versionCheck.compatible) {
    messages.push('✓ Version compatibility: OK');
    return { ok: true, messages };
  } else {
    messages.push(versionCheck.message);
    return { ok: false, messages };
  }
}

export async function runInit(
  projectRoot: string,
  overrides?: InitOverrides
): Promise<{ ok: boolean; messages: string[] }> {
  const messages: string[] = [];
  const detection = detectProject(projectRoot);

  const framework = (detection as any).framework as string | undefined;
  const isSvelteKitFlag = (detection as any).isSvelteKit as boolean | undefined;
  const isSvelteKit = framework === 'sveltekit' || !!isSvelteKitFlag;

  // SvelteKit path: handle before enforcing Next.js-only checks.
  if (isSvelteKit && !detection.isNext) {
    return runInitSvelteKit(projectRoot, detection, messages);
  }

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

  // Prefer rewrites in next.config over middleware
  const nextConfigPath = findNextConfig(projectRoot);
  let useRewrites = false;
  
  if (nextConfigPath) {
    if (hasAcceptMdRewriteInConfig(projectRoot, nextConfigPath)) {
      messages.push(`Accept-md rewrite already exists in ${nextConfigPath}.`);
      useRewrites = true;
    } else {
      const result = addRewriteToNextConfig(projectRoot, nextConfigPath);
      if (result.success) {
        messages.push(result.message);
        useRewrites = true;
      } else {
        messages.push(`Could not add rewrite to ${nextConfigPath}: ${result.message}. Falling back to middleware.`);
      }
    }
  } else {
    // No next.config found - create one with rewrites
    const newConfigPath = detection.hasTypeScript ? 'next.config.ts' : 'next.config.js';
    const configContent = detection.hasTypeScript
      ? `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          destination: '/api/accept-md?path=:path*',
          has: [
            {
              type: 'header',
              key: 'accept',
              value: '(.*)text/markdown(.*)',
            },
          ],
        },
      ],
    };
  },
};

export default nextConfig;
`
      : `/** @type { import('next').NextConfig } */
const nextConfig = {
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          destination: '/api/accept-md?path=:path*',
          has: [
            {
              type: 'header',
              key: 'accept',
              value: '(.*)text/markdown(.*)',
            },
          ],
        },
      ],
    };
  },
};

module.exports = nextConfig;
`;
    writeFileSync(join(projectRoot, newConfigPath), configContent);
    messages.push(`Created ${newConfigPath} with accept-md rewrite.`);
    useRewrites = true;
  }

  // Only create middleware if rewrites weren't successfully added
  if (!useRewrites) {
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
  } else if (detection.middlewarePath && existsSync(join(projectRoot, middlewarePathRel))) {
    // Rewrites are being used, but middleware exists - inform user
    const middlewareContent = readFileSync(join(projectRoot, middlewarePathRel), 'utf-8');
    if (middlewareContent.includes(MARKDOWN_MARKER)) {
      messages.push(`Note: ${middlewarePathRel} exists but rewrites are preferred. You can remove the middleware file if desired.`);
    }
  }

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
    const runtimeVersion = await getRuntimeVersion();
    const hasRuntimeInDeps = pkg.dependencies?.['accept-md-runtime'];
    const hasRuntimeInDevDeps = pkg.devDependencies?.['accept-md-runtime'];
    
    // Check version compatibility before installing/updating
    if (hasRuntimeInDeps || hasRuntimeInDevDeps) {
      const versionCheck = checkRuntimeVersion(projectRoot, runtimeVersion);
      if (!versionCheck.compatible) {
        messages.push(versionCheck.message);
      }
    }
    
    if (!hasRuntimeInDeps && !hasRuntimeInDevDeps) {
      pkg.dependencies = pkg.dependencies || {};
      pkg.dependencies['accept-md-runtime'] = runtimeVersion;
      pkgModified = true;
      messages.push(`Added accept-md-runtime@${runtimeVersion} to dependencies. Run pnpm install (or npm install).`);
    } else {
      // Update existing installation to exact matching version
      const currentVersion = hasRuntimeInDeps || hasRuntimeInDevDeps;
      // Extract version number for comparison (handle ranges)
      const extractVersion = (v: string): string => v.replace(/^[\^~>=<]+\s*/, '').trim();
      if (extractVersion(currentVersion) !== runtimeVersion) {
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
