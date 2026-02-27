---
title: "Serve Markdown from SvelteKit on Vercel with Accept: text/markdown"
description: "Learn how to serve Markdown from SvelteKit routes on Vercel using the Accept header and accept-md. No custom server, no Puppeteer."
date: 2026-02-28
author: accept-md team
keywords:
  - sveltekit markdown vercel
  - sveltekit accept header
  - serve markdown sveltekit
  - sveltekit hooks markdown
  - sveltekit vercel markdown
---

SvelteKit makes it easy to build modern apps on Vercel, but what if you want to expose your pages as **Markdown** for AI crawlers, documentation exports, or content syndication? You don't need Puppeteer or a custom server—HTTP's `Accept` header and a small SvelteKit hook are enough.

In this guide you'll see how to serve Markdown from SvelteKit on Vercel using the same pattern that works for Next.js: requests with `Accept: text/markdown` are transparently rewritten to a handler that converts HTML → Markdown.

## Why SvelteKit + Vercel is a great fit

SvelteKit on Vercel already gives you:

- **File-based routes** under `src/routes`
- **Adapters** that know how to run on Vercel edge/serverless
- **Hooks** (`hooks.server.ts/js`) for request-level logic

That means you can:

1. Keep your existing Svelte components and pages.
2. Add a single `+server` route to generate Markdown.
3. Use a `handle` hook to route `Accept: text/markdown` traffic there.

No custom server, no extra deployment complexity.

## Step 1: Add the Markdown handler route

First, create a catch-all API route:

```bash
mkdir -p src/routes/api/accept-md/[...path]
touch src/routes/api/accept-md/[...path]/+server.ts
```

Example `+server.ts` using `accept-md-runtime`:

```ts
// src/routes/api/accept-md/[...path]/+server.ts
import { getMarkdownForPath, loadConfig } from 'accept-md-runtime';

const cache = new Map();
const HANDLER_PATH = '/api/accept-md';

export async function GET(event) {
  const url = event.url;
  const request = event.request;

  const pathFromHeader = request.headers.get('x-accept-md-path');
  const pathFromQuery = url.searchParams.get('path');
  const pathname = url.pathname;

  let path = pathFromHeader && pathFromHeader.trim() !== '' ? pathFromHeader : null;
  if (!path && pathFromQuery && pathFromQuery.trim() !== '') {
    path = pathFromQuery;
  }
  if (!path && pathname.startsWith(HANDLER_PATH + '/')) {
    path = pathname.slice(HANDLER_PATH.length) || '/';
  }
  if (!path || path === HANDLER_PATH) {
    path = '/';
  }
  if (!path.startsWith('/')) path = '/' + path;

  const config = loadConfig(process.cwd());
  let baseUrl = config.baseUrl;
  if (!baseUrl) {
    baseUrl = url.origin || 'http://localhost:' + (process.env.PORT || 5173);
  }

  const headers = new Headers(request.headers);
  headers.delete('accept');

  const markdown = await getMarkdownForPath({
    pathname: path,
    baseUrl,
    config,
    cache: config.cache !== false ? cache : undefined,
    headers,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': config.cache
        ? 'public, s-maxage=60, stale-while-revalidate'
        : 'no-store',
    },
  });
}
```

This is essentially the same handler accept-md generates for you.

## Step 2: Add a SvelteKit handle hook

Next, wire up a `handle` hook so SvelteKit knows to send `Accept: text/markdown` requests to the handler:

```ts
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const url = new URL(event.request.url);

  // Avoid loops – never rewrite the handler itself
  if (url.pathname.startsWith('/api/accept-md')) {
    return resolve(event);
  }

  const accept = event.request.headers.get('accept') || '';

  if (/\btext\/markdown\b/i.test(accept)) {
    const markdownUrl = new URL(`/api/accept-md${url.pathname}`, url.origin);
    markdownUrl.searchParams.set('path', url.pathname);

    return await fetch(markdownUrl.toString(), {
      method: 'GET',
      headers: event.request.headers,
    });
  }

  return resolve(event);
};
```

On Vercel this hook runs inside SvelteKit's serverless/edge runtime—no special configuration needed.

## Step 3: Use accept-md to automate it

Manually wiring the handler and hook works, but you don't have to do it by hand. With `accept-md`:

```bash
npx accept-md init
```

From your SvelteKit project root this will:

- Detect `routes/` or `src/routes/`
- Create `src/routes/api/accept-md/[...path]/+server.(js|ts)`
- Create or wrap `src/hooks.server.(ts|js)` so `Accept: text/markdown` is routed correctly
- Generate a shared `accept-md.config.js`

It also works perfectly on Vercel:

- No custom server—just the standard SvelteKit adapter.
- Internal fetch uses your deployment URL.
- Caching respects builds and revalidation.

## Step 4: Deploy to Vercel and test

Deploy your SvelteKit app to Vercel as usual, then test:

```bash
curl https://your-sveltekit-app.vercel.app/contact
curl -H "Accept: text/markdown" https://your-sveltekit-app.vercel.app/contact
```

You should see:

- HTML for the first request.
- Clean Markdown (with metadata and JSON-LD preserved) for the second.

## Conclusion

SvelteKit + Vercel is a great platform for serving Markdown alongside HTML:

- You keep your existing routes and components.
- `accept-md` wires up the handler and hook for you.
- Vercel handles deployment, scaling, and caching.

If you're building AI crawlers, documentation exports, or content pipelines on SvelteKit, using `Accept: text/markdown` with accept-md is the cleanest, most production-ready path. 

