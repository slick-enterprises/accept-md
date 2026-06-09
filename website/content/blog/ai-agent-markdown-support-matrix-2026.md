---
title: "Which AI Agents Request Markdown? The 2026 Support Matrix Explained"
description: "A breakdown of which AI agents send Accept: text/markdown, how they negotiate, and what site owners should do today—even when most browse tools still fetch HTML."
date: 2026-06-10
author: accept-md team
keywords:
  - ai agent markdown support
  - Accept text/markdown agents
  - content negotiation ai agents
  - claude code markdown
  - cursor accept header
  - codex cli markdown
faq:
  - question: "Which AI agents send Accept: text/markdown?"
    answer: "As of May 2026, Claude Code, Cursor, OpenClaw, and OpenCode send Accept headers that prefer text/markdown. Codex CLI uses a partial pattern—it fetches HTML first, then follows a link rel=\"alternate\" tag for a Markdown sibling. Most general-purpose browse tools (ChatGPT, Perplexity, Gemini, Copilot, and others) still fetch HTML only."
  - question: "Should I implement Accept Markdown if only a few agents use it?"
    answer: "Yes. The coding agents that already negotiate are the ones developers rely on for documentation and product research. Vercel, Checkly, and Cloudflare have all converged on text/markdown as the agent representation. Implementing now means you are ready as browse tools adopt the same pattern."
  - question: "Is serving Markdown to agents cloaking?"
    answer: "No. Content negotiation returns a different representation of the same URL based on what the client requests—it is not user-agent spoofing. Search crawlers like Googlebot do not send Accept: text/markdown and continue to receive HTML, which preserves SEO parity."
  - question: "How do I test whether an agent requests Markdown?"
    answer: "Log the Accept header in your access logs, trigger the agent against a URL you control, and grep for the request. The accept= field tells you whether text/markdown was advertised. See the verification section below or the full workflow on the AI agent support matrix page."
  - question: "What headers should my server return for Markdown requests?"
    answer: "Return Content-Type: text/markdown; charset=utf-8 and Vary: Accept on every Markdown response. Without Vary, caches may serve Markdown to browsers or HTML to agents. Optionally return 406 for unsupported Accept types when you want strict negotiation."
  - question: "Does Codex CLI need Accept: text/markdown support?"
    answer: "Codex CLI does not send Accept: text/markdown on its first request. It fetches HTML, parses the document head for link rel=\"alternate\" type=\"text/markdown\", and makes a second request for the Markdown URL. Ship both Accept negotiation and alternate links for maximum coverage."
---

Site owners ask: *"Should I implement Accept Markdown?"* Agent users ask: *"Does this site support it?"* The [AI agent support matrix](https://acceptmarkdown.com/status) answers both by recording what each agent's fetch tool actually sends when it hits a URL—not what a marketing page claims.

The stakes are real. Agents that receive HTML spend context on navigation, footers, scripts, and layout wrappers instead of your prose. [Roboto Studio](https://robotostudio.com/blog/aeo-seo-best-practices-for-sanity) cites a Vercel example where a page compressed from roughly 500 KB of HTML to about 3 KB of Markdown—a 99% reduction. Slower ingestion, burned tokens, and noisier citations follow when agents parse browser markup instead of clean text.

This article explains the matrix, how agents negotiate, and what to do about it. The matrix is a living snapshot (last verified **2026-05-09** on the [status page](https://acceptmarkdown.com/status)); behavior shifts across versions, plans, and newly added tools.

## What the matrix actually measures

The matrix tracks one thing: **the HTTP `Accept` header (and related discovery mechanisms) that an agent's built-in browse or fetch tool sends when it requests a URL.**

It does not measure:

- Whether a vendor mentions Markdown in documentation
- Whether an agent *could* be configured to send a custom header
- Whether a separate `.md` URL exists on your site

It does measure what happens in production when you ask Claude Code to read a doc, Cursor to summarize a page, or Perplexity to fetch a link.

### A 30-second primer on content negotiation

HTTP content negotiation lets a client express format preferences via the `Accept` header. When an agent sends `Accept: text/markdown`, a server that supports negotiation returns Markdown from the **same URL** that serves HTML to browsers.

For the full contract, see:

- [What Accept Markdown means](/learn/accept-markdown)
- [Why AI agents prefer Markdown](/learn/why-markdown-for-agents)
- [Vary: Accept](/learn/vary-accept)
- [Accept header quality values (q-values)](/learn/accept-header-quality-values)

Test any URL yourself:

```bash
curl -sI -H "Accept: text/markdown" https://yoursite.com/page
```

Look for `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept` in the response.

## The 2026 support matrix

The matrix groups agents into three tiers based on observed fetch behavior.

### Supports — full Accept negotiation (4 agents)

These agents send `Accept: text/markdown` (or list it with highest preference) on their first request. A server that honors content negotiation returns Markdown immediately.

| Agent | Vendor | Mechanism | Verified |
| --- | --- | --- | --- |
| Claude Code | Anthropic | `Accept: text/markdown, text/html, */*` · [RFC 7763](https://www.rfc-editor.org/rfc/rfc7763) · [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) | 2025-11-13 |
| Cursor | Anysphere | `Accept: text/markdown, text/plain;q=0.9, */*;q=0.8` · [RFC 7763](https://www.rfc-editor.org/rfc/rfc7763) · [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) | 2026-04-18 |
| OpenClaw | OpenClaw | `Accept: text/markdown, text/html;q=0.9, */*;q=0.1` · [RFC 7763](https://www.rfc-editor.org/rfc/rfc7763) · [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) | 2026-05-04 |
| OpenCode | SST | `Accept: text/markdown;q=1.0, text/x-markdown;q=0.9, text/plain;q=0.8, text/html;q=0.7, */*;q=0.1` · [RFC 7763](https://www.rfc-editor.org/rfc/rfc7763) · [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) | 2026-05-04 |

**Notable patterns:**

- **Claude Code** lists `text/markdown` first and relies on header order rather than explicit `q=` weights—a pattern [Checkly documented](https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/) in their February 2026 agent tests.
- **Cursor and OpenCode** use explicit quality factors (`q=1.0`, `q=0.9`, etc.) to weight Markdown above HTML.
- **OpenClaw** strongly prefers Markdown with `text/html;q=0.9` and `*/*;q=0.1` as fallbacks.

[Cloudflare](https://blog.cloudflare.com/markdown-for-agents/) and [Vercel](https://vercel.com/blog/making-agent-friendly-pages-with-content-negotiation) both named Claude Code and OpenCode as early adopters when they launched Markdown-for-agents features in early 2026.

### Partial — discovery without Accept negotiation (1 agent)

| Agent | Vendor | Mechanism | Verified |
| --- | --- | --- | --- |
| Codex CLI | OpenAI | Follows `<link rel="alternate" type="text/markdown" href="https://example.com/page.md">` · [RFC 7763](https://www.rfc-editor.org/rfc/rfc7763) · [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) | 2026-04-18 |

**Codex CLI** fetches the canonical URL as HTML first—without an `Accept: text/markdown` preference—then parses the document `<head>` for a Markdown alternate link and makes a second request for the `.md` sibling.

This is partial support: your site must expose discovery metadata even if Accept negotiation is not triggered on the first pass. [Vercel's content negotiation guide](https://vercel.com/blog/making-agent-friendly-pages-with-content-negotiation) recommends shipping `link rel="alternate"` alongside Accept negotiation for exactly this reason.

### No — HTML-only fetch (15 agents)

These agents fetch HTML without advertising a Markdown preference:

| Agent | Vendor | Verified |
| --- | --- | --- |
| Aider | Aider | 2026-05-09 |
| ChatGPT (browse) | OpenAI | 2026-04-18 |
| Claude.ai (web app) | Anthropic | 2026-04-18 |
| Cline | Cline | 2026-05-09 |
| Copilot Chat (VS Code) | GitHub / Microsoft | 2026-04-18 |
| Copilot CLI | GitHub / Microsoft | 2026-04-18 |
| Devin | Cognition | 2026-05-09 |
| Gemini (web app) | Google | 2026-04-18 |
| Gemini CLI | Google | 2026-04-18 |
| Grok | xAI | 2026-04-18 |
| Microsoft Copilot | Microsoft | 2026-05-09 |
| Perplexity | Perplexity | 2026-04-18 |
| v0 | Vercel | 2026-05-09 |
| Windsurf | Cognition | 2026-05-09 |
| Zed | Zed Industries | 2026-05-09 |

**The central insight:** coding agents (Claude Code, Cursor, OpenCode, OpenClaw) negotiate for Markdown; **general-purpose browse and chat tools largely do not—yet.** That split defines who benefits from server-side Accept Markdown today and who will benefit tomorrow.

## How each tier negotiates

### Header order vs q-values

Not all agents express preference the same way. [Checkly's February 2026 analysis](https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/) found two patterns:

1. **Order-based preference** — Claude Code lists `text/markdown` first in the Accept header and skips explicit `q=` values.
2. **Quality-factor weighting** — Cursor and OpenCode set `q=1.0` for Markdown and lower weights for HTML and wildcards.

Both patterns are valid under [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110). Server implementations must honor proper content negotiation—not just check whether the Accept string contains the substring `text/markdown`. See [Accept header quality values](/learn/accept-header-quality-values) for how q-values affect which representation wins.

### Codex CLI's two-step pattern

Codex CLI demonstrates that Accept negotiation is not the only discovery path. Agents can also use [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) link relations:

```html
<link rel="alternate" type="text/markdown" href="https://example.com/page.md">
```

Publishers who want maximum agent coverage should implement **both**:

- Return Markdown when `Accept: text/markdown` is sent (covers Claude Code, Cursor, OpenCode, OpenClaw)
- Expose `link rel="alternate"` in HTML `<head>` (covers Codex CLI)

[Vercel](https://vercel.com/blog/making-agent-friendly-pages-with-content-negotiation) also recommends markdown sitemaps (`/sitemap.md`) and `llms.txt` as complementary discovery aids—orthogonal to the matrix but useful for agents that do not negotiate.

### What "No" really means

An agent in the "No" tier is not ignoring your site maliciously. Those fetch tools were built for general web browsing, not token-efficient documentation ingestion. They request HTML because that is what browsers request.

This is consistent with how search crawlers behave. [Ekamoira's 2026 guide](https://www.ekamoira.com/blog/how-to-serve-markdown-to-ai-crawlers-content-negotiation-token-economics-guide) notes that Googlebot and Google-Extended do not send `Accept: text/markdown`—and that is correct. Google wants the same HTML users see. Content negotiation serves agents without changing what search engines receive.

Serving Markdown via Accept negotiation is **not cloaking**. Same URL, same content, different representation based on what the client asks for.

### The Cloudflare layer

[Cloudflare Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/) converts HTML to Markdown at the edge when a request includes `Accept: text/markdown`. It adds useful response headers:

- `Vary: Accept` — separate cache entries for HTML and Markdown
- `x-markdown-tokens` — estimated token count of the Markdown body
- `Content-Signal` — AI usage preferences (e.g. `ai-train=yes, search=yes, ai-input=yes`)

But edge conversion only activates when the agent sends the header. Enabling Cloudflare's toggle helps the four "Supports" agents immediately; it does nothing for the fifteen HTML-only fetchers until they adopt negotiation. See [Cloudflare Markdown for Agents vs accept-md](/blog/cloudflare-markdown-for-agents-vs-accept-md) for a full comparison of edge vs application-layer conversion.

## Two audiences, two playbooks

### For site owners and developers

**1. Implement Accept Markdown now—even for a minority of agents.**

[Checkly](https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/) tested seven agents in February 2026 and found only three requested Markdown. By May 2026, the matrix lists four full supporters plus OpenClaw. Adoption is accelerating, and Vercel, Checkly, and Cloudflare all treat `text/markdown` as the direction of travel.

**2. Return the right headers.**

Every Markdown response needs:

```http
Content-Type: text/markdown; charset=utf-8
Vary: Accept
```

Without `Vary: Accept`, CDNs and proxies may serve Markdown to browsers or HTML to agents. Optionally return [406 for unsupported Accept types](/learn/when-to-return-406) when you want strict negotiation.

**3. Cover both negotiation and discovery.**

- Accept negotiation for Claude Code, Cursor, OpenCode, OpenClaw
- `link rel="alternate"` for Codex CLI
- `/sitemap.md` or `llms.txt` for agents that discover content through indexes ([Vercel](https://vercel.com/blog/making-agent-friendly-pages-with-content-negotiation), [Roboto Studio](https://robotostudio.com/blog/aeo-seo-best-practices-for-sanity))

**4. Keep HTML behavior unchanged for browsers and search crawlers.**

[Ekamoira](https://www.ekamoira.com/blog/how-to-serve-markdown-to-ai-crawlers-content-negotiation-token-economics-guide) recommends handling both Accept-header negotiation and `.md` URL rewrites through internal routing—not redirects—so the canonical URL stays the same.

**5. Pick your implementation layer.**

- **Cloudflare edge toggle** — zero origin code, paid plan required. See the [comparison post](/blog/cloudflare-markdown-for-agents-vs-accept-md).
- **accept-md in your app** — framework-native handlers for Next.js and SvelteKit with configurable cleanup and metadata extraction. See [serve Markdown without Puppeteer](/blog/serve-markdown-nextjs-without-puppeteer) for the pattern.

```bash
npx accept-md init
```

### For agent users

If token efficiency on documentation matters, **pick tools that send `Accept: text/markdown`**. [Checkly's recommendation](https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/) is direct: some agents optimize for you, others force HTML parsing. Know which one you are using.

Test your stack:

1. Deploy a page on a server where you control access logs.
2. Ask your agent to fetch or summarize that URL.
3. Grep the log line for `accept=` and confirm whether `text/markdown` appears.

## How to verify an agent yourself

We test the matrix ourselves, but agent behavior shifts. You can corroborate any row—or catch a regression—by reading your own access logs.

### Step 1: Log the Accept header

Default log formats usually drop it. Add it once:

```nginx
# Nginx
log_format with_accept '$remote_addr - $remote_user [$time_local] '
                       '"$request" $status $body_bytes_sent '
                       '"$http_referer" "$http_user_agent" '
                       'accept="$http_accept"';
access_log /var/log/nginx/access.log with_accept;
```

```apache
# Apache
LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\" accept=\"%{Accept}i\"" with_accept
```

Caddy JSON access logs include `request.headers.Accept` by default.

Full snippets for all three are on the [status page](https://acceptmarkdown.com/status).

### Step 2: Trigger a known agent

Pick a URL on your site—ideally a unique or freshly published one so the request is not masked by background traffic. Then ask the agent to fetch or summarize it:

- **ChatGPT** — *"Summarize https://yoursite.com/article-xyz"* (with browse enabled)
- **Claude Code** — *"What does https://yoursite.com/article-xyz say?"*
- **Perplexity** — paste the URL directly into a query

### Step 3: Report what you saw

Grep for the URL in your access log and send the line(s) to [feedback](https://acceptmarkdown.com/about#feedback), along with the agent you used and the prompt you sent. The `accept=` field tells us whether `text/markdown` was advertised.

The [status page](https://acceptmarkdown.com/status) remains the **living canonical matrix**. This blog post is the explainer—it does not need rewriting every time a row changes.

## What's changing

The landscape is moving fast:

- **February 2026:** [Checkly](https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/) tested seven agents and found three negotiators.
- **Early 2026:** [Vercel](https://vercel.com/blog/making-agent-friendly-pages-with-content-negotiation) and [Cloudflare](https://blog.cloudflare.com/markdown-for-agents/) shipped content negotiation for their own properties and published implementation guides.
- **May 2026:** The matrix lists four full supporters, Codex CLI as partial, and OpenClaw as a new entrant.

All three infrastructure vendors converge on [RFC 7763](https://www.rfc-editor.org/rfc/rfc7763) `text/markdown` as the agent representation. Browse tools may follow coding agents. Implement server-side negotiation now so you are ready when they do.

## Conclusion

The AI agent support matrix makes the chicken-and-egg problem concrete. Four coding agents already request Markdown via `Accept: text/markdown`. One (Codex CLI) discovers Markdown through alternate links. Fifteen general-purpose tools still fetch HTML only.

For site owners, the playbook is clear: honor Accept negotiation, set `Vary: Accept`, add discovery metadata, and keep HTML unchanged for browsers and search crawlers. For agent users, pick tools that negotiate if token efficiency matters.

**Next steps:**

- **Track the matrix:** [AI agent support matrix](https://acceptmarkdown.com/status)
- **Check your site:** [Markdown audit](/markdown-audit)
- **Implement:** `npx accept-md init` or enable [Cloudflare Markdown for Agents](/blog/cloudflare-markdown-for-agents-vs-accept-md)
- **Deploy on Vercel:** [Vercel + Accept header guide](/blog/vercel-markdown-nextjs-sveltekit-accept-header)
- **Compare tooling approaches:** [Best tools for AI crawlers on Next.js](/blog/best-tools-ai-crawlers-index-nextjs-content)

## Related resources

- [AI agent support matrix](https://acceptmarkdown.com/status) — living compatibility data
- [What Accept Markdown means](/learn/accept-markdown)
- [Why AI agents prefer Markdown](/learn/why-markdown-for-agents)
- [Cloudflare Markdown for Agents vs accept-md](/blog/cloudflare-markdown-for-agents-vs-accept-md)
- [Making agent-friendly pages with content negotiation (Vercel)](https://vercel.com/blog/making-agent-friendly-pages-with-content-negotiation)
- [The current state of content negotiation for AI agents (Checkly)](https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/)
- [Introducing Markdown for Agents (Cloudflare)](https://blog.cloudflare.com/markdown-for-agents/)
