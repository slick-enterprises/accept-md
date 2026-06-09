---
title: "Accept Headers and Quality Values"
description: "Understand how clients express Markdown preference with Accept headers and q-values."
date: "2026-06-09"
order: 4
category: "HTTP Correctness"
keywords:
  - Accept header q values
  - text/markdown q
  - content negotiation
  - accept markdown
---

The `Accept` header can list multiple media types. Quality values, or q-values, tell the server which representation the client prefers.

```text
Accept: text/markdown, text/html;q=0.9, */*;q=0.1
```

In this example, Markdown is preferred over HTML, and any other type is a last resort.

## Common patterns

Markdown-first clients may send:

```text
Accept: text/markdown, text/html;q=0.9, */*;q=0.1
```

Browsers usually send headers that prefer HTML:

```text
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
```

## What q=0 means

A q-value of `0` means "not acceptable." A server should not return that representation when another acceptable option exists.

```text
Accept: text/html;q=0, text/markdown
```

That client is explicitly rejecting HTML and requesting Markdown.

## Practical accept-md behavior

accept-md focuses on clients asking for Markdown and routes those requests to the Markdown handler. Normal browser requests continue to receive HTML. For most sites, that gives the right behavior without requiring application code to implement a full content negotiation library.

## When to be stricter

If you are building a public API or custom server, parse q-values carefully, respect `q=0`, and return `406 Not Acceptable` only when the request cannot be satisfied by any representation you support.
