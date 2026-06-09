---
title: "Configuration"
description: "Configure which routes serve Markdown, what gets cleaned, and how responses are cached."
date: "2026-06-09"
order: 2
category: "Reference"
keywords:
  - accept-md config
  - accept markdown configuration
  - cleanSelectors
  - markdown transformers
---

accept-md reads `accept-md.config.js` from your project root.

```javascript
/** @type { import('accept-md-runtime').NextMarkdownConfig } */
module.exports = {
  include: ["/**"],
  exclude: ["/api/**", "/_next/**"],
  cleanSelectors: ["nav", "footer", ".no-markdown", "[data-no-markdown]"],
  outputMode: "markdown",
  cache: true,
  transformers: [
    (markdown) => markdown.trim(),
  ],
  baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  debug: false,
};
```

## Route matching

Use `include` to choose routes that should have a Markdown representation. Use `exclude` for API routes, framework internals, private pages, or pages that do not make sense outside the browser.

The default posture is broad enough for content sites and conservative around API and framework paths.

## Cleaning HTML before conversion

`cleanSelectors` removes elements before HTML becomes Markdown. Common selectors include:

- `nav`
- `footer`
- `.no-markdown`
- `[data-no-markdown]`
- cookie banners, modals, and related-content rails

Good cleanup keeps AI agents focused on the primary page content instead of layout chrome.

## Transformers

Transformers run after conversion and receive the Markdown string:

```javascript
module.exports = {
  transformers: [
    (markdown) => markdown.replace(/\n{3,}/g, "\n\n"),
  ],
};
```

Use transformers for small project-specific cleanup. If the HTML contains the wrong content, prefer fixing selectors or page markup first.

## Base URL

`baseUrl` tells the runtime where to fetch the HTML version of a page. On Vercel, `VERCEL_URL` is a common fallback when the incoming request host is not enough.

## Debug mode

Enable `debug` while diagnosing route matching or fetch behavior:

```javascript
module.exports = {
  debug: true,
};
```

Turn it off in normal production traffic to keep logs clean.
