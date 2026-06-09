---
title: "Markdown Output"
description: "Understand the Markdown, YAML frontmatter, and JSON-LD that accept-md returns to agents."
date: "2026-06-09"
order: 3
category: "Reference"
keywords:
  - markdown output
  - YAML frontmatter
  - JSON-LD markdown
  - AI readable content
---

accept-md converts your rendered HTML page into Markdown and preserves useful metadata for AI agents, search tools, and content pipelines.

## Markdown body

The body keeps the semantic content agents need:

- headings
- paragraphs
- links
- images
- tables
- lists
- code blocks

Cleanup selectors run before conversion, so navigation, footers, modals, and other layout elements can be removed.

## YAML frontmatter

HTML metadata is extracted into YAML frontmatter:

```yaml
---
title: "Page Title"
description: "Page description"
keywords:
  - "accept markdown"
  - "AI crawlers"
canonical: "https://example.com/page"
language: "en"
og_title: "OpenGraph Title"
og_description: "OpenGraph Description"
twitter_card: "summary_large_image"
robots_index: true
robots_follow: true
---
```

This gives agents a compact summary before the full page content.

## JSON-LD blocks

Structured data from `<script type="application/ld+json">` is preserved as formatted JSON at the end of the Markdown:

````markdown
## Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title"
}
```
````

That makes the Markdown representation more useful than a plain text scrape because schema.org data survives the conversion.

## Response headers

Markdown responses include:

```text
Content-Type: text/markdown; charset=utf-8
Vary: Accept
```

When caching is enabled in config, responses also include `Cache-Control: public, s-maxage=60, stale-while-revalidate`.

## Disabling metadata

Advanced users can disable frontmatter with runtime markdown options. Most sites should keep it enabled because it helps agents understand title, canonical URL, Open Graph fields, and robots hints.
