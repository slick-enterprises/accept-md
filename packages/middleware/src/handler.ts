/**
 * Handler logic: fetch page HTML and return markdown. Used by generated route/API.
 */

import { htmlToMarkdown } from './markdown.js';
import type { NextMarkdownConfig } from './types.js';

function pathMatches(pathname: string, patterns: string[]): boolean {
  const norm = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
  const parts = norm.split('/').filter(Boolean);
  for (const p of patterns) {
    const segs = p.split('/').filter(Boolean);
    if (segs[0] === '**') return true;
    let i = 0;
    for (const seg of segs) {
      if (seg === '**') return true;
      if (i >= parts.length) break;
      if (seg === '*' || seg === parts[i]) {
        i++;
        continue;
      }
      break;
    }
    if (i === segs.length && i === parts.length) return true;
  }
  return false;
}

function shouldExclude(pathname: string, config: NextMarkdownConfig): boolean {
  if (config.exclude?.length && pathMatches(pathname, config.exclude)) return true;
  if (config.include && config.include.length > 0 && !pathMatches(pathname, config.include))
    return true;
  return false;
}

export interface GetMarkdownOptions {
  pathname: string;
  baseUrl: string;
  config: NextMarkdownConfig;
  /** In-memory cache (pathname -> markdown). Caller can pass a Map for caching. */
  cache?: Map<string, string>;
  /** Optional headers to forward to the internal fetch (e.g., for Vercel deployment protection) */
  headers?: HeadersInit;
}

/**
 * Fetch the page at baseUrl + pathname (as HTML), convert to markdown, optionally cache.
 */
export async function getMarkdownForPath(options: GetMarkdownOptions): Promise<string> {
  const { pathname, baseUrl, config, cache, headers } = options;
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (shouldExclude(normalizedPath, config)) {
    throw new Error(`Path excluded from markdown: ${normalizedPath}`);
  }
  const cacheKey = normalizedPath;
  if (config.cache !== false && cache?.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  // Prefer the public/base URL first; only fall back to VERCEL_URL when needed.
  const primaryOrigin = baseUrl.replace(/\/$/, '');
  let fallbackOrigin: string | null = null;
  if (
    typeof process !== 'undefined' &&
    process.env?.VERCEL_URL &&
    process.env.VERCEL_URL.trim() !== '' &&
    baseUrl.startsWith('http')
  ) {
    try {
      const vercelUrl = process.env.VERCEL_URL.startsWith('http')
        ? process.env.VERCEL_URL
        : `https://${process.env.VERCEL_URL}`;
      const vercelOrigin = vercelUrl.replace(/\/$/, '');
      if (vercelOrigin !== primaryOrigin) {
        fallbackOrigin = vercelOrigin;
      }
    } catch {
      // Ignore malformed VERCEL_URL and just use primaryOrigin.
      fallbackOrigin = null;
    }
  }

  async function fetchOnce(origin: string): Promise<Response> {
    const url = `${origin}${normalizedPath}`;
    // Build headers: forward provided headers but override Accept to get HTML
    const fetchHeaders = new Headers();
    if (headers) {
      const headerObj = headers instanceof Headers ? headers : new Headers(headers);
      for (const [key, value] of headerObj.entries()) {
        fetchHeaders.set(key, value);
      }
    }
    fetchHeaders.set('Accept', 'text/html');
    return fetch(url, { headers: fetchHeaders });
  }

  let res: Response;
  let lastError: unknown = null;
  let lastStatus: number | null = null;

  try {
    res = await fetchOnce(primaryOrigin);
  } catch (err) {
    lastError = err;
    res = undefined as unknown as Response;
  }

  if (!res || !res.ok) {
    if (res && !res.ok) {
      lastStatus = res.status;
    }
    if (fallbackOrigin) {
      try {
        const fallbackRes = await fetchOnce(fallbackOrigin);
        if (fallbackRes.ok) {
          res = fallbackRes;
        } else {
          lastStatus = fallbackRes.status;
        }
      } catch (err) {
        lastError = err;
      }
    }
  }

  if (!res || !res.ok) {
    if (lastStatus != null) {
      throw new Error(`Failed to fetch page: ${lastStatus}`);
    }
    const message =
      lastError instanceof Error ? lastError.message : lastError ? String(lastError) : 'Unknown error';
    throw new Error(`Failed to fetch page: ${message}`);
  }

  const html = await res.text();
  const md = htmlToMarkdown(html, {
    cleanSelectors: config.cleanSelectors,
    transformers: config.transformers,
  });
  if (config.cache !== false && cache) {
    cache.set(cacheKey, md);
  }
  return md;
}
