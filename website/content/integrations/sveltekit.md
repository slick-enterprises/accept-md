---
title: "SvelteKit"
description: "Serve Markdown from SvelteKit routes with accept-md hooks and a generated +server handler."
date: "2026-06-06"
order: 3
category: "SvelteKit"
keywords:
  - SvelteKit markdown
  - accept-md SvelteKit
  - Accept: text/markdown SvelteKit
  - hooks.server markdown
---

accept-md supports SvelteKit projects with `routes/` or `src/routes/`.

## Install

```bash
npx --yes accept-md@latest init
pnpm install
```

The CLI generates a route handler at `src/routes/api/accept-md/[...path]/+server.js` or `.ts` and wires `src/hooks.server` so Markdown requests are rewritten to that handler.

## Request flow

1. A client sends `Accept: text/markdown`.
2. `hooks.server` detects the request and rewrites it to the accept-md route.
3. The handler fetches the original SvelteKit page as HTML.
4. accept-md converts the HTML to Markdown and returns it with Markdown headers.

## Test locally

```bash
curl -s -H "Accept: text/markdown" http://localhost:5173/
```

## Deploying

SvelteKit deployments need a stable `baseUrl` when the runtime fetches the HTML version of a page. On Vercel, use `VERCEL_URL`:

```javascript
module.exports = {
  baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
};
```

If you use another adapter, set `baseUrl` to the deployed origin when needed.
