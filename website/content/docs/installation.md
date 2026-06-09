---
title: "Installation"
description: "Install accept-md in Next.js or SvelteKit and verify that Markdown negotiation works."
date: "2026-05-28"
order: 1
category: "Start"
keywords:
  - accept markdown
  - accept-md installation
  - Next.js markdown
  - SvelteKit markdown
faq:
  - question: "Does accept-md work with App Router and Pages Router?"
    answer: "Yes. The CLI detects your Next.js router and generates the correct handler for App Router or Pages Router."
  - question: "Will Accept Markdown affect my SEO?"
    answer: "No. Search engines still receive HTML. Markdown is served only when a client sends Accept: text/markdown."
  - question: "Do I need to change my page components?"
    answer: "No. accept-md serves Markdown from your existing rendered pages through content negotiation."
  - question: "How do I verify installation worked?"
    answer: "Run curl -s -H \"Accept: text/markdown\" https://your-site.com/ and confirm you receive Markdown with Content-Type text/markdown and Vary: Accept."
---

## Run init from your app

From the directory that contains your Next.js or SvelteKit app, run:

```bash
npx --yes accept-md@latest init
```

The CLI detects your framework and router, writes `accept-md.config.js`, adds the runtime dependency, and creates the handler route needed to serve Markdown.

In a monorepo, run the command inside the app package, not at the workspace root:

```bash
cd apps/web
npx --yes accept-md@latest init
```

## What init adds

For Next.js, accept-md prefers `next.config` rewrites and falls back to middleware only when needed. It also creates the API handler for App Router or Pages Router.

For SvelteKit, accept-md creates a route handler under `src/routes/api/accept-md/[...path]` and wires `src/hooks.server` so Markdown requests are rewritten to that handler.

Generated handler files stay JavaScript-compatible. TypeScript projects may receive `.ts` files, but the generated code does not require TypeScript-only syntax.

## Install dependencies

After init updates `package.json`, install dependencies with your package manager:

```bash
pnpm install
# or npm install / yarn
```

## Verify the route

Request a normal page with the Markdown accept header:

```bash
curl -s -H "Accept: text/markdown" https://your-site.com/
```

Then inspect headers:

```bash
curl -sI -H "Accept: text/markdown" https://your-site.com/
```

You should see a Markdown content type and `Vary: Accept`. Browser requests should continue receiving HTML.

## Next steps

- Configure route inclusion and cleanup selectors in `/docs/configuration`.
- Learn the output shape in `/docs/output`.
- Use `/integrations` for framework-specific setup notes.
