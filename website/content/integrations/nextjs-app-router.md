---
title: "Next.js App Router"
description: "Serve Markdown from Next.js App Router pages with accept-md rewrites and a route handler."
date: "2026-06-04"
order: 1
category: "Next.js"
keywords:
  - Next.js App Router markdown
  - accept-md Next.js
  - Accept: text/markdown Next.js
  - route handler markdown
---

accept-md supports App Router projects with `app/` or `src/app/`.

## Install

Run from the Next.js app root:

```bash
npx --yes accept-md@latest init
pnpm install
```

The CLI detects the App Router, adds the handler at `app/api/accept-md/route.js` or `.ts`, and configures requests with `Accept: text/markdown` to reach that handler.

## Preferred routing path

For current Next.js projects, accept-md prefers `next.config` rewrites over middleware. Middleware remains supported for older projects and fallback setups, but rewrites are the future-facing path.

## Test a page

```bash
curl -s -H "Accept: text/markdown" http://localhost:3000/
```

Then inspect headers:

```bash
curl -sI -H "Accept: text/markdown" http://localhost:3000/
```

## Common exclusions

Keep API and framework paths excluded:

```javascript
module.exports = {
  exclude: ["/api/**", "/_next/**"],
};
```

Add page-specific selectors to remove nav, footer, and other layout elements before conversion.
