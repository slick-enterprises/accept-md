---
title: "When to Return 406 Not Acceptable"
description: "Return 406 only when a client asks for representations your server truly cannot provide."
date: "2026-06-09"
order: 5
category: "HTTP Correctness"
keywords:
  - 406 Not Acceptable
  - Accept header
  - content negotiation
  - accept markdown
---

`406 Not Acceptable` means the server understood the request but cannot return any representation allowed by the `Accept` header.

It is useful, but easy to overuse.

## Do not return 406 too early

Most browser requests include broad fallbacks such as `*/*`. Those requests can usually receive HTML.

For a normal website, this should work:

```text
Accept: text/html,*/*;q=0.8
```

Returning `406` to a browser because it did not explicitly ask for Markdown would be wrong.

## When 406 is appropriate

Consider `406` when the client rejects every representation you can serve:

```text
Accept: application/json
```

If the route only has HTML and Markdown representations, and no wildcard fallback applies, a `406` response can be correct.

## Product guidance

For accept-md-enabled websites, the main goal is simple:

- Markdown requests receive Markdown.
- Browser requests receive HTML.
- Unsupported private and API paths stay excluded.

If you need stricter negotiation for a custom endpoint, implement explicit parsing and test q-values, wildcards, and `q=0`.
