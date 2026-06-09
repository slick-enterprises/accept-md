---
title: "Cloudflare Markdown for Agents vs accept-md: Same Protocol, Different Layer"
description: "Compare Cloudflare's edge Markdown for Agents with accept-md's app-level Accept: text/markdown handlers for Next.js and SvelteKit."
date: 2026-06-10
author: accept-md team
keywords:
  - cloudflare markdown for agents
  - accept text/markdown
  - markdown for agents
  - next.js markdown
  - cloudflare vs accept-md
---

Cloudflare's [Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/) and **accept-md** solve the same problem: let AI crawlers and agents request clean Markdown instead of noisy HTML. Both use the same HTTP mechanism—**content negotiation** via the `Accept` header on your existing URLs.

The difference is where conversion happens. Cloudflare converts at the **CDN edge**. accept-md converts inside your **Next.js or SvelteKit app**. Same protocol, different layer.

## The shared protocol

Agents request Markdown the same way on either approach:

```bash
# Normal HTML (browsers, most crawlers)
curl https://example.com/docs/page

# Markdown representation (AI agents)
curl -H "Accept: text/markdown" https://example.com/docs/page
```

No separate `/markdown/*` routes. No duplicate content URLs. The client expresses what it wants; the server (or edge) returns the matching representation.

## What Cloudflare Markdown for Agents does

Cloudflare added Markdown for Agents as a zone-level feature on their network. When enabled:

1. A request arrives with `Accept: text/markdown`.
2. Cloudflare's edge detects the header.
3. Cloudflare fetches the **HTML version** from your origin.
4. The edge converts HTML to Markdown and returns it to the client.

### Enabling it

Markdown for Agents is available on **Pro, Business, and Enterprise** plans. You enable it in the [AI Crawl Control](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/#how-to-enable) dashboard, via the Cloudflare API, or through configuration rules for specific subdomains or paths.

### Output format

Cloudflare's converted responses follow a predictable layout:

1. **YAML frontmatter** with metadata from `<meta>` tags—`title`, `description`, and `image` (when present).
2. **Body Markdown** converted from the document body, with nav, footers, scripts, and styles stripped.
3. **JSON-LD** preserved as a fenced `json` code block at the end (when the source HTML contains it).

### Response headers

Cloudflare adds useful headers beyond `Content-Type: text/markdown`:

- `Vary: Accept` — signals that responses differ by Accept header.
- `x-markdown-tokens` — estimated token count of the Markdown body.
- `x-original-tokens` — estimated token count of the original HTML.
- `Content-Signal` — signals AI usage preferences (e.g. `ai-train=yes, search=yes, ai-input=yes`).

### Limitations

- Requires your site to be behind Cloudflare on a paid plan.
- Origin responses cannot exceed **2 MB**.
- Conversion rules are fixed—you cannot customize what gets stripped per page.
- Frontmatter is limited to title, description, and image.
- No framework integration; it works on any HTML origin, but offers no Next.js or SvelteKit wiring.

## What accept-md does

accept-md implements the same `Accept: text/markdown` pattern at the **application layer**. A small handler inside your Next.js or SvelteKit app intercepts markdown requests, fetches the rendered HTML for the requested path, and converts it using `accept-md-runtime`.

### Setup

```bash
npx accept-md init
```

The CLI detects your framework, creates the handler route, wires rewrites or middleware (Next.js) or hooks (SvelteKit), and adds `accept-md.config.js` for shared configuration.

### Output format

accept-md produces Markdown designed for agent consumption:

- **YAML frontmatter** with richer metadata: title, description, keywords, canonical URL, language, Open Graph fields, Twitter card fields, article metadata, and robots hints. See the [Markdown output reference](/docs/output) for the full list.
- **Body Markdown** with configurable cleanup—strip nav, footers, modals, and any element matching your selectors.
- **JSON-LD** preserved as formatted code blocks at the end of the document.

### Response headers

Markdown responses include:

```text
Content-Type: text/markdown; charset=utf-8
Vary: Accept
```

When caching is enabled, responses also include `Cache-Control` with `s-maxage` and `stale-while-revalidate`.

### Where it runs

accept-md works on **any host**—Vercel, self-hosted Node, Cloudflare Pages, AWS, and others. There is no CDN plan requirement because conversion happens in your app, not at a specific provider's edge.

## Comparison

| | Cloudflare Markdown for Agents | accept-md |
|---|---|---|
| **Layer** | CDN edge | App handler |
| **Requirements** | CF Pro+ zone behind Cloudflare | Next.js or SvelteKit project |
| **Protocol** | `Accept: text/markdown` | `Accept: text/markdown` |
| **Frontmatter** | title, description, image | title, description, canonical, OG, Twitter, article, robots, etc. |
| **JSON-LD** | Appended as fenced `json` block | Appended as fenced `json` block |
| **Customization** | Fixed edge conversion | `accept-md.config.js` cleanSelectors, cache, transformers |
| **Token metrics** | `x-markdown-tokens` response headers | Debug comment mode only (no response headers today) |
| **Content signals** | `Content-Signal` header | Not emitted today |
| **Size limit** | 2 MB origin response | Your app's limits |
| **Framework integration** | None | CLI, rewrites/middleware, doctor |

## When Cloudflare is a good fit

Cloudflare Markdown for Agents makes sense when:

- Your site is **already on Cloudflare Pro+** and you want zero application changes.
- You run a **static or marketing site** where default HTML stripping is sufficient.
- You want **zone-wide enablement** with a dashboard toggle—no deploy required.
- **Token-count headers** matter for your agent pipeline's context budgeting.
- You need **Content-Signal** headers to express AI usage preferences.

For teams that treat Cloudflare as their primary infrastructure layer and don't need per-page conversion control, edge conversion is a low-friction option.

## When accept-md is a good fit

accept-md is the better choice when:

- You run a **Next.js or SvelteKit** application and want framework-native integration.
- You need **richer frontmatter**—canonical URLs, keywords, Open Graph fields, article dates—for RAG or indexing pipelines.
- You deploy on **Vercel**, self-hosted infrastructure, or any platform without a Cloudflare Pro plan.
- You want **control over cleanup**—exclude nav, cookie banners, modals, or mark regions with `.no-markdown` / `[data-no-markdown]`.
- Your site is **not fully behind Cloudflare**, or you prefer not to depend on a CDN vendor for content conversion.

For developers building on Next.js or SvelteKit who want conversion logic they own and can version alongside their app, accept-md keeps everything in the deployment you already manage.

## Using both

These approaches operate at different layers, so understanding how they interact matters:

- If **Cloudflare edge conversion is enabled**, Cloudflare intercepts `Accept: text/markdown` requests before they reach your origin. Your accept-md handler will not see those requests.
- Sites on **Cloudflare Pages** can use accept-md as the origin implementation. Leave edge conversion off if you want full control over output format and cleanup selectors.
- **Avoid double conversion.** Pick one layer unless you have a deliberate split—for example, edge conversion for public marketing pages and accept-md for app routes, configured via Cloudflare path-based rules.

Running accept-md on Cloudflare Pages gives you Markdown conversion without requiring a Pro plan or enabling the zone-level edge feature.

## Quick start with accept-md

If accept-md fits your stack, setup takes one command:

```bash
npx accept-md init
```

Then test:

```bash
curl -H "Accept: text/markdown" https://your-site.com/docs
```

You should receive Markdown with YAML frontmatter instead of HTML.

Integration guides:

- [Next.js App Router](/integrations/nextjs-app-router)
- [Next.js Pages Router](/integrations/nextjs-pages-router)
- [SvelteKit](/integrations/sveltekit)
- [Deploy on Vercel](/integrations/vercel)

## Conclusion

Cloudflare and accept-md both embrace the same emerging standard: serve Markdown from the same URL when clients send `Accept: text/markdown`. The choice comes down to **infrastructure vs application control**.

Cloudflare converts at the edge with zero code—ideal for sites already on their network that want a dashboard toggle. accept-md converts inside your app with richer metadata, configurable cleanup, and framework-native wiring—ideal for Next.js and SvelteKit teams who want ownership over the conversion pipeline.

Neither replaces the other in every scenario. Both make your content more accessible to the agents and crawlers that increasingly drive discovery and retrieval.

## Related resources

- [Why AI agents prefer Markdown](/learn/why-markdown-for-agents)
- [Markdown output reference](/docs/output)
- [Deploy accept-md on Vercel](/integrations/vercel)
- [Run a Markdown audit](/markdown-audit)
- [Cloudflare Markdown for Agents documentation](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)
