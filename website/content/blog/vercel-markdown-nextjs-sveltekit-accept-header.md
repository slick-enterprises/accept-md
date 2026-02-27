---
title: "Why Vercel + Accept: text/markdown Is the Best Way to Serve Markdown from Next.js & SvelteKit"
description: "See why using the Accept header on Vercel is the cleanest way to serve Markdown from Next.js and SvelteKit, and how accept-md automates the setup."
date: 2026-02-28
author: accept-md team
keywords:
  - vercel markdown
  - next.js vercel markdown
  - sveltekit vercel markdown
  - vercel accept header
  - vercel nextjs sveltekit markdown
---

If you're deploying **Next.js** or **SvelteKit** to **Vercel** and need Markdown representations of your pages—for AI crawlers, documentation exports, or data pipelines—the simplest and most scalable pattern is to use the **HTTP Accept header**.

Instead of adding a second site, running Puppeteer, or bolting on a custom server, you can let Vercel handle routing while a small handler converts HTML → Markdown when clients send `Accept: text/markdown`.

## Why Vercel is a perfect match

Vercel gives you:

- Native support for **Next.js** and **SvelteKit**
- **Rewrites/middleware** (Next.js) and **hooks** (SvelteKit)
- Serverless and edge runtimes with automatic scaling

That means you can:

- Keep your existing routes
- Let Vercel route `Accept: text/markdown` traffic to a handler
- Keep everything in one deployment—no separate "markdown export" service

## The Accept header pattern on Vercel

The pattern is simple:

```bash
# Normal HTML
curl https://your-app.vercel.app/docs

# Markdown representation
curl -H "Accept: text/markdown" https://your-app.vercel.app/docs
```

Behind the scenes:

1. Vercel matches the request to your app.
2. A rewrite/middleware (Next.js) or `handle` hook (SvelteKit) sees `Accept: text/markdown`.
3. The request is routed to `/api/accept-md/...`.
4. The handler fetches the original page HTML and converts it to Markdown.

## Next.js on Vercel

On Next.js, the flow looks like:

- `next.config.js` rewrites `Accept: text/markdown` to an internal handler.
- The handler uses `accept-md-runtime` to:
  - Fetch `https://your-app.vercel.app/path` as HTML.
  - Strip nav/footer/UI chrome.
  - Extract metadata to YAML frontmatter.
  - Preserve JSON-LD as code blocks.

Vercel is a great fit here:

- Internal fetches stay inside Vercel's network.
- Serverless functions scale automatically.
- No need for a separate markdown export service.

## SvelteKit on Vercel

On SvelteKit, the same idea uses hooks instead of middleware:

- A `+server` route under `src/routes/api/accept-md/[...path]` generates Markdown.
- A `hooks.server` handle rewrites `Accept: text/markdown` requests to that route.
- Vercel's SvelteKit adapter runs both pieces with no extra configuration.

With `accept-md`, this is generated for you:

```bash
npx accept-md init
```

From a SvelteKit project root, this command:

- Detects `routes/` or `src/routes/`
- Creates the API route for Markdown
- Creates or wraps `src/hooks.server.(ts|js)` to route markdown requests
- Adds `accept-md.config.js` for shared configuration

## Why not a custom server or Puppeteer?

On Vercel, custom Node servers are discouraged for good reason:

- They bypass Vercel's optimized runtimes.
- You lose out on automatic scaling and routing.
- Deployments become more complex and fragile.

Puppeteer has similar issues:

- Heavy binaries and cold starts
- High memory usage
- Awkward fit for serverless functions

By contrast, the Accept header pattern:

- Uses standard Vercel primitives (rewrites, middleware, hooks).
- Keeps your app fully compatible with Vercel's platform.
- Adds minimal overhead—just one extra handler.

## accept-md: the Vercel-native implementation

`accept-md` is designed to work **out of the box on Vercel**:

- For **Next.js**:
  - Adds rewrites in `next.config` (preferred) or middleware.
  - Creates a handler that understands Vercel's internal headers and deployment URLs.
- For **SvelteKit**:
  - Creates the `+server` handler.
  - Wires up `hooks.server` so `Accept: text/markdown` is routed correctly.
- In both cases:
  - Caching respects builds and revalidation.
  - No custom server is required.

Once it's set up, your Vercel deployment can serve both HTML and Markdown from the same URLs, depending on the `Accept` header.

## Conclusion

If you're on Vercel with Next.js or SvelteKit and need Markdown:

- **Use the Accept header**, not a separate service.
- Let **Vercel** handle routing and scaling.
- Use **accept-md** to wire up handlers and config automatically.

That combination—Vercel + Accept header + accept-md—gives you a production-ready Markdown API with almost zero friction and no changes to your existing pages. 

