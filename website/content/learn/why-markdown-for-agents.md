---
title: "Why AI Agents Prefer Markdown"
description: "Markdown gives agents a smaller, cleaner, higher-signal version of the content already present in your HTML."
date: "2026-05-21"
order: 2
category: "AI Retrieval"
keywords:
  - AI agents markdown
  - LLM retrieval
  - markdown for crawlers
  - accept markdown SEO
---

HTML is built for browsers. Markdown is often better for agents.

A browser needs scripts, layout, navigation, CSS hooks, responsive wrappers, and interactive elements. An agent usually needs the title, headings, body copy, links, images, tables, and metadata.

## Smaller context

Markdown removes most layout noise before the content reaches an LLM context window. That means fewer tokens are spent on wrappers and more tokens are spent on the actual article, documentation, or product page.

## Better retrieval signal

Search and retrieval pipelines work best when the text is focused. Removing nav, footers, cookie banners, and related-content blocks keeps embeddings closer to the page's primary topic.

## Faster downstream work

Markdown is easier to chunk, summarize, diff, index, and transform than arbitrary browser HTML. Agents can start from semantic text instead of first cleaning a DOM.

## Metadata still matters

Plain Markdown alone can lose context. accept-md preserves frontmatter and JSON-LD so agents can see canonical URLs, descriptions, Open Graph metadata, and structured data alongside the content.

## Browsers are unchanged

The point is not to replace HTML. The point is to let each client receive the representation it can use best from the same URL.
