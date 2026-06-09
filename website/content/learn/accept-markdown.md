---
title: "What Accept Markdown Means"
description: "A practical explanation of serving Markdown from the same URL when clients send Accept: text/markdown."
date: "2026-06-09"
order: 1
category: "Fundamentals"
keywords:
  - accept markdown
  - Accept: text/markdown
  - markdown content negotiation
  - HTTP Accept header
---

Accept Markdown is the practice of returning a Markdown representation when a client asks for it with the HTTP `Accept` header:

```text
Accept: text/markdown
```

The URL does not need to change. A browser can receive HTML from `/docs`, while an agent can receive Markdown from the same `/docs` URL.

## Why the same URL matters

One URL keeps canonical links, analytics, permissions, and routing simple. The server chooses the representation based on the request:

- `Accept: text/html` returns the normal page.
- `Accept: text/markdown` returns Markdown.
- Broad headers can fall back to HTML when Markdown is not requested.

## Where accept-md fits

accept-md adds this behavior to existing Next.js and SvelteKit apps. It does not ask you to move content into a separate Markdown-only CMS. Your page renders as HTML, then the runtime converts that HTML into a clean Markdown response for clients that request it.

## What makes it production-ready

A production implementation should:

- return `Content-Type: text/markdown` for Markdown requests
- set `Vary: Accept`
- keep HTML behavior unchanged for browsers
- exclude API and private routes
- preserve useful metadata for agents

That is the core contract accept-md is designed to make easy.
