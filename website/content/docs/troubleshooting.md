---
title: "Troubleshooting"
description: "Fix common accept-md setup issues, including HTML responses, 404s, route detection, and version mismatches."
date: "2026-06-09"
order: 6
category: "Production"
keywords:
  - accept-md troubleshooting
  - Accept: text/markdown not working
  - Next.js markdown handler
  - SvelteKit markdown handler
---

Start with `doctor`:

```bash
npx accept-md doctor
```

It reports detected framework paths, handler files, config, and version compatibility.

## Markdown requests return HTML

Check that your request includes the header:

```bash
curl -sI -H "Accept: text/markdown" https://your-site.com/
```

If the response is still HTML, verify that rewrites, middleware, or SvelteKit hooks are active and that the route is included by `accept-md.config.js`.

## The handler returns 404

Confirm the generated handler exists in the expected location:

- App Router: `app/api/accept-md/route.js` or `.ts`
- Pages Router: `pages/api/accept-md/index.js` or `.ts`
- SvelteKit: `src/routes/api/accept-md/[...path]/+server.js` or `.ts`

JavaScript handler files are supported and should not be converted to TypeScript-only syntax.

## The Markdown includes too much navigation

Add selectors to `cleanSelectors`:

```javascript
module.exports = {
  cleanSelectors: ["nav", "footer", ".cookie-banner", ".related-posts"],
};
```

Prefer removing layout chrome before conversion instead of cleaning large chunks of Markdown afterward.

## Next.js start fails after build

Run:

```bash
npx accept-md fix-routes
```

If it fixes the issue, add it as a `postbuild` script.

## Versions do not match

Run:

```bash
npx accept-md version-check
```

If the CLI and `accept-md-runtime` differ, reinstall with the latest CLI:

```bash
npx --yes accept-md@latest init
pnpm install
```
