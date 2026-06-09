---
title: "Troubleshooting"
description: "Fix common accept-md setup issues, including HTML responses, 404s, route detection, and version mismatches."
date: "2026-06-03"
order: 6
category: "Production"
keywords:
  - accept-md troubleshooting
  - Accept: text/markdown not working
  - Next.js markdown handler
  - SvelteKit markdown handler
faq:
  - question: "How do I diagnose accept-md setup issues?"
    answer: "Run npx accept-md doctor. It reports detected framework paths, handler files, config, and version compatibility."
  - question: "Why do Markdown requests return HTML?"
    answer: "Verify the request includes Accept: text/markdown, then confirm rewrites, middleware, or SvelteKit hooks are active and the route is included by accept-md.config.js."
  - question: "Why does the handler return 404?"
    answer: "Confirm the generated handler exists at app/api/accept-md/route.js or .ts (App Router), pages/api/accept-md/index.js or .ts (Pages Router), or src/routes/api/accept-md/[...path]/+server.js or .ts (SvelteKit)."
  - question: "Why does the Markdown include too much navigation?"
    answer: "Add selectors to cleanSelectors in accept-md.config.js, such as nav, footer, .cookie-banner, and .related-posts. Remove layout chrome before conversion instead of cleaning Markdown afterward."
  - question: "Why does Next.js start fail after build?"
    answer: "Run npx accept-md fix-routes. If it fixes the issue, add it as a postbuild script."
  - question: "What if CLI and runtime versions do not match?"
    answer: "Run npx accept-md version-check. If versions differ, reinstall with npx --yes accept-md@latest init and pnpm install."
---

Start with `doctor`:

```bash
npx accept-md doctor
```

It reports detected framework paths, handler files, config, and version compatibility.

### Why do Markdown requests return HTML?

Check that your request includes the header:

```bash
curl -sI -H "Accept: text/markdown" https://your-site.com/
```

If the response is still HTML, verify that rewrites, middleware, or SvelteKit hooks are active and that the route is included by `accept-md.config.js`.

### Why does the handler return 404?

Confirm the generated handler exists in the expected location:

- App Router: `app/api/accept-md/route.js` or `.ts`
- Pages Router: `pages/api/accept-md/index.js` or `.ts`
- SvelteKit: `src/routes/api/accept-md/[...path]/+server.js` or `.ts`

JavaScript handler files are supported and should not be converted to TypeScript-only syntax.

### Why does the Markdown include too much navigation?

Add selectors to `cleanSelectors`:

```javascript
module.exports = {
  cleanSelectors: ["nav", "footer", ".cookie-banner", ".related-posts"],
};
```

Prefer removing layout chrome before conversion instead of cleaning large chunks of Markdown afterward.

### Why does Next.js start fail after build?

Run:

```bash
npx accept-md fix-routes
```

If it fixes the issue, add it as a `postbuild` script.

### What if CLI and runtime versions do not match?

Run:

```bash
npx accept-md version-check
```

If the CLI and `accept-md-runtime` differ, reinstall with the latest CLI:

```bash
npx --yes accept-md@latest init
pnpm install
```
