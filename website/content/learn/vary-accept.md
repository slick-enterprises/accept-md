---
title: "Why Vary: Accept Is Required"
description: "Use Vary: Accept so caches do not mix HTML and Markdown responses for the same URL."
date: "2026-05-22"
order: 3
category: "HTTP Correctness"
keywords:
  - Vary Accept
  - accept markdown cache
  - content negotiation cache
  - Markdown CDN
---

When one URL can return both HTML and Markdown, caches need to know which request header changes the response.

That is what `Vary: Accept` does.

```text
Vary: Accept
```

## The failure mode

Without `Vary: Accept`, a cache can store the Markdown version of a page and later return it to a browser. It can also store the HTML version and return it to an agent that asked for Markdown.

Both responses may be valid for the URL, but they are not valid for every request.

## What to test

Run:

```bash
curl -sI -H "Accept: text/markdown" https://your-site.com/page
```

Confirm the response includes both:

```text
Content-Type: text/markdown; charset=utf-8
Vary: Accept
```

Then test HTML:

```bash
curl -sI -H "Accept: text/html" https://your-site.com/page
```

The HTML path should still work as before.

## CDN notes

Some CDNs need additional cache-key configuration even when the origin sends `Vary`. If you see representation mixing, bypass caching for Markdown responses or configure the CDN to include `Accept` in the cache key.
