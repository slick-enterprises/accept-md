---
title: "Next.js Pages Router"
description: "Add Accept Markdown support to Pages Router sites with a generated API route."
date: "2026-06-05"
order: 2
category: "Next.js"
keywords:
  - Next.js Pages Router markdown
  - accept-md pages router
  - Accept: text/markdown Next.js
  - pages api markdown
---

Pages Router projects are supported with `pages/` or `src/pages/`.

## Install

```bash
npx --yes accept-md@latest init
pnpm install
```

The CLI creates `pages/api/accept-md/index.js` or `.ts` and configures Markdown requests to reach it.

## How requests flow

1. A client requests `/some-page` with `Accept: text/markdown`.
2. Next.js routes that request to the accept-md handler.
3. The handler fetches the HTML version of `/some-page`.
4. The runtime converts HTML to Markdown and returns it.

Normal browser requests continue through the existing Pages Router page.

## JavaScript compatibility

Generated handler content is plain JavaScript-compatible. If your project has `tsconfig.json`, init may write `.ts`; otherwise it writes `.js`.

Do not convert generated user-facing handlers to TypeScript-only syntax if your app is JavaScript.

## Verify

```bash
curl -s -H "Accept: text/markdown" http://localhost:3000/about
```

If the response is HTML, run:

```bash
npx accept-md doctor
```
