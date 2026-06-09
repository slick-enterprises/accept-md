---
title: "Caching and CDN Behavior"
description: "Cache Markdown responses safely with Vary: Accept, ISR-aware fetches, and deployment-specific checks."
date: "2026-06-01"
order: 5
category: "Production"
keywords:
  - Vary Accept
  - markdown caching
  - Vercel markdown
  - CDN content negotiation
---

Markdown and HTML can share the same URL only when caches understand that the response varies by `Accept`.

## Vary: Accept

A Markdown response should include:

```text
Vary: Accept
```

Generated handlers (App Router, Pages Router, and SvelteKit) set this automatically. Without it, a CDN or browser cache can store the Markdown response and serve it to a browser, or store the HTML response and serve it to an agent.

## Runtime cache

accept-md can keep converted Markdown in an in-memory cache:

```javascript
module.exports = {
  cache: true,
  maxCacheEntries: 500,
};
```

Use this for high-traffic pages where the same Markdown representation is requested repeatedly. Disable it when content changes on every request.

## ISR and generated pages

For static and ISR pages, the runtime fetches the HTML representation your app already renders. That means Markdown output follows the same source content and deployment behavior as the HTML page.

If Markdown looks stale, check the HTML page first, then inspect cache headers and ISR revalidation.

## CDN checklist

- Confirm `Vary` includes `Accept`.
- Confirm the CDN cache key respects `Accept` or bypasses Markdown responses.
- Test both `Accept: text/html` and `Accept: text/markdown`.
- Exclude API and private routes from Markdown conversion.

Use the [Markdown Audit tool](/markdown-audit) for a quick production-readiness report.
