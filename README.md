# accept-md

**Serve clean Markdown representations of any Next.js or SvelteKit page** when clients request `Accept: text/markdown`. No changes to your existing pages; works with App Router, Pages Router, SSG, SSR, ISR, and SvelteKit’s file-based routing.

## Use cases

- **AI crawlers & LLM ingestion** – expose content as markdown for indexing
- **Documentation exports** – one command to get markdown from docs sites
- **Content syndication** – reuse content in other systems
- **SEO tooling** – alternate representations for analysis
- **Content portability** – canonical markdown alongside HTML

## How it works

1. **Rewrites in `next.config`** (preferred) or **middleware** intercept requests with `Accept: text/markdown` in Next.js; in SvelteKit, a `hooks.server` handle performs the same rewrite.
2. The request is **rewritten** to an internal handler with the original path.
3. The handler **fetches the same URL** as HTML (your app renders it once), then converts HTML → Markdown (strip nav/footer, preserve headings, links, images, tables).
4. The **markdown response** is returned and can be cached like any other response.

No Puppeteer, no custom server, no edits to your page components.

**Note:** Next.js is moving away from middleware (renaming it to "proxy"). This package now prefers using `next.config` rewrites, which are more performant and future-proof. Middleware is still supported for backward compatibility.

## Output Format

The markdown output includes your page content plus structured metadata:

### YAML Frontmatter

HTML meta tags are automatically extracted and included as YAML frontmatter at the top of the markdown:

```yaml
---
title: "Page Title"
description: "Page description"
keywords:
  - "tag1"
  - "tag2"
author: "Author Name"
canonical: "https://example.com/page"
language: "en"
og_title: "OpenGraph Title"
og_description: "OpenGraph Description"
og_type: "website"
og_url: "https://example.com/page"
og_image: "https://example.com/image.jpg"
og_site_name: "Site Name"
og_locale: "en_US"
article_author: "Article Author"
article_published_time: "2024-01-01T00:00:00Z"
twitter_card: "summary_large_image"
twitter_title: "Twitter Title"
robots_index: true
robots_follow: true
---

# Your Content Here
```

**Supported meta tags:**
- Basic: `title`, `description`, `keywords`, `author`, `canonical`, `robots`
- OpenGraph: `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:site_name`, `og:locale`
- Article: `article:author`, `article:published_time`, `article:modified_time`, `article:section`, `article:tag`
- Twitter: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:creator`, `twitter:site`

You can disable frontmatter by setting `includeFrontmatter: false` in the markdown options (advanced usage).

### JSON-LD Structured Data

JSON-LD scripts (`<script type="application/ld+json">`) are extracted and included as formatted JSON code blocks at the end of the markdown:

````markdown
# Your Content Here

## Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  }
}
```
````

This preserves structured data for LLMs and search engines, making your markdown output more semantically rich and useful for AI ingestion.

**Benefits:**
- **LLM-friendly**: Structured metadata in YAML frontmatter is easy for AI models to parse
- **SEO-preserved**: JSON-LD structured data is maintained for search engine understanding
- **Complete**: All metadata from your HTML is preserved in the markdown output

## Installation

### 1. Run init (recommended)

From your Next.js or SvelteKit project root:

```bash
npx accept-md init
```

**Recommended:** To ensure you get the latest version (bypassing npx cache), use:

```bash
npx --yes accept-md@latest init
```

The `@latest` flag ensures you get the most recent version even if npx has a cached older version. The `--yes` flag skips the confirmation prompt.

This will:

- Detect **framework and router**:
  - Next.js App Router vs Pages Router (supports both root and **src/** layout: `app` or `src/app`, `pages` or `src/pages`)
  - SvelteKit (looks for `@sveltejs/kit`, `svelte.config.*`, and `routes` / `src/routes`)
- For **Next.js**:
  - Add rewrites to `next.config.js/ts` (preferred) or create/update middleware (at `middleware.ts` or `src/middleware.ts`) to rewrite `Accept: text/markdown` to the markdown handler
  - Add the handler at `app/api/accept-md/route.ts` or `route.js` (or under `src/`; App Router), or `pages/api/accept-md/index.ts` or `index.js` (Pages Router)
- For **SvelteKit**:
  - Add a route handler at `src/routes/api/accept-md/[...path]/+server.ts` or `+server.js` (or under `routes/` if you don't use `src/`)
  - Generate or wrap `src/hooks.server.ts` / `src/hooks.server.js` so requests with `Accept: text/markdown` are rewritten to the handler
- For **all frameworks**:
  - Create `accept-md.config.js` if it doesn’t exist
  - Add `accept-md-runtime` to your dependencies

When run interactively, init prompts for the app/pages directory and middleware file path; press **Enter** to use the detected defaults. You can also pass paths via flags (see [CLI](#cli) below). In a **monorepo**, run `npx accept-md init` from the directory that contains the Next.js app (the folder whose `package.json` has `next`); if you run from the repo root, the CLI will suggest the correct subdirectory (e.g. `cd apps/web && npx accept-md init`).

Then install dependencies:

```bash
pnpm install
# or npm install / yarn
```

### 2. Manual setup

Install the runtime:

```bash
pnpm add accept-md-runtime
```

For **Next.js**, add rewrites to `next.config.js/ts` (preferred) or middleware that rewrites `Accept: text/markdown` to `/api/accept-md/:path*` (path parameter), and add the API route / Route Handler that calls `getMarkdownForPath` from the package.

For **SvelteKit**, add a route like:

- `src/routes/api/accept-md/[...path]/+server.js` (or `.ts`), which:
  - Reads the original path from the `path` query parameter or from the URL suffix after `/api/accept-md/`
  - Calls `getMarkdownForPath({ pathname, baseUrl, config, cache, headers })`
  - Returns a `Response` with `Content-Type: text/markdown; charset=utf-8`

See the [examples](./examples) for full code for both Next.js and SvelteKit.

## Usage

Request any route with the Markdown accept header:

```bash
curl -H "Accept: text/markdown" https://your-site.com/
curl -H "Accept: text/markdown" https://your-site.com/about
curl -H "Accept: text/markdown" https://your-site.com/posts/123
```

Normal requests (no header or `Accept: text/html`) still receive HTML; no performance impact for regular users.

## Configuration

Create or edit `accept-md.config.js` in the project root:

```js
/** @type { import('accept-md-runtime').NextMarkdownConfig } */
module.exports = {
  include: ['/**'],
  exclude: ['/api/**', '/_next/**'],
  cleanSelectors: ['nav', 'footer', '.no-markdown', '[data-no-markdown]'],
  outputMode: 'markdown',
  cache: true,
  transformers: [
    (md) => md.replace(/\]\(\/\/)/g, '](https://)'),
  ],
  baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  debug: false,
};
```

| Option | Description |
|--------|-------------|
| `include` | Glob patterns for routes to include (default: all) |
| `exclude` | Glob patterns to exclude (default: `/api/**`, `/_next/**`) |
| `cleanSelectors` | CSS selectors removed before HTML→Markdown (nav, footer, etc.) |
| `cache` | Enable in-memory cache for markdown responses |
| `transformers` | Array of `(md: string) => string` to post-process markdown |
| `baseUrl` | Base URL for internal fetch (default: from request) |
| `debug` | Enable debug logging |

## CLI

### init

```bash
npx accept-md init [path]
```

**Recommended:** Use `npx --yes accept-md@latest init [path]` to ensure you get the latest version, bypassing any cached older versions.

Scans the project, adds rewrites to `next.config` (preferred) or generates middleware and handler, and creates config. Detects **app** / **pages** and **middleware** paths (including `src/app`, `src/pages`, `src/middleware.ts`). If middleware already exists at the target path, it wraps your middleware so markdown runs first. Prefers `next.config` rewrites over middleware for better compatibility with future Next.js versions.

**Options:**

| Option | Description |
|--------|-------------|
| `path` | Project root (default: current directory) |
| `--app-dir=<path>` | App directory (e.g. `app` or `src/app`) |
| `--pages-dir=<path>` | Pages directory (e.g. `pages` or `src/pages`) |
| `--middleware=<path>` | Middleware file (e.g. `middleware.ts` or `src/middleware.ts`) |

When run in a TTY, init prompts for app/pages directory and middleware path; press **Enter** to use the detected defaults.

### doctor

```bash
npx accept-md doctor [path]
```

Reports detected router, routes (including `src/` layout), and potential issues (missing handler, config, etc.).

### fix-routes (Next.js 15+)

```bash
npx accept-md fix-routes [path]
```

Ensures `.next/routes-manifest.json` has a `dataRoutes` array. Next.js 15+ server expects `routesManifest.dataRoutes` to be iterable; if it is missing (e.g. from some builds or deploy pipelines), `next start` can throw:

```text
[TypeError: routesManifest.dataRoutes is not iterable]
```

Running `fix-routes` after `next build` (or using the `postbuild` script added by `accept-md init`) patches the manifest so `next start` works. You can run it manually or rely on the automatic postbuild hook.

### `accept-md version-check [path]`

Checks version compatibility between the CLI and installed `accept-md-runtime` package. Reports any mismatches and suggests fixes. Useful for troubleshooting version-related issues.

## Version Management

accept-md uses exact version matching between the CLI and `accept-md-runtime` to ensure compatibility. The CLI automatically:

- Installs/updates `accept-md-runtime` to match the **running CLI version** exactly
- Warns if versions don't match

**Best practices:**

- Use `npx --yes accept-md@latest init` to get the latest version (recommended)
- Run `npx accept-md version-check` to verify version compatibility
- The `doctor` command also reports version compatibility

**Troubleshooting version issues:**

If you see version mismatch warnings:

```bash
# Check current versions
npx accept-md version-check

# Update to latest
npm install accept-md-runtime@latest
# or
pnpm add accept-md-runtime@latest
```

## Project structure (monorepo)

```
accept-md/
├── packages/
│   ├── cli/              # accept-md (bin: init, doctor)
│   ├── core/             # @accept-md/core (scanner, config, types)
│   └── middleware/       # accept-md-runtime (HTML→MD, handler logic)
├── examples/
│   ├── app-router/       # Next.js 14 App Router example
│   └── pages-router/     # Next.js Pages Router example
├── docs/
└── package.json
```

## Caching & build behavior

accept-md uses intelligent caching that respects Next.js build and ISR revalidation cycles:

### In-Memory Cache

The in-memory cache (enabled by default) persists until:

1. **New build detected**: Cache automatically invalidates when `BUILD_ID` environment variable changes (Next.js sets this on each build)
2. **ISR revalidation**: Cache respects the `x-next-revalidate` header from Next.js responses and expires entries when revalidation time is reached
3. **Serverless function restart**: Cache is cleared when the function instance is recycled (typically after ~10 minutes of inactivity on Vercel)

### Cache Behavior by Rendering Strategy

- **SSG (Static)**: First request generates markdown and caches it. Cache persists until next build (detected via `BUILD_ID` change)
- **ISR (Incremental Static Regeneration)**: Cache respects the `x-next-revalidate` header. Entries expire based on the revalidation time specified in your page
- **SSR (Server-Side Rendering)**: Markdown is generated on demand and cached. Cache persists until function restart or manual invalidation

### HTTP Cache Headers

When `cache: true` in config, responses include:
- `Cache-Control: public, s-maxage=60, stale-while-revalidate` (default)
- The `s-maxage` can be extended to match ISR revalidation times (future enhancement)

### Debug Mode

Enable debug mode in your config to see size information:

```javascript
// accept-md.config.js
module.exports = {
  debug: true,
  // ...
};
```

This adds a comment to the markdown output:
```markdown
<!-- accept-md: html_size=52480 bytes, markdown_size=20480 bytes, reduction=61% -->
```

### Cache Configuration

```javascript
// accept-md.config.js
module.exports = {
  cache: true,  // Enable caching (default: true)
  // cache: false, // Disable caching
};
```

The runtime does not pre-generate markdown at build time; it generates on first request and then caches. This keeps the implementation simple and avoids custom build steps.

## Version Management

accept-md uses exact version matching between the CLI and `accept-md-runtime` to ensure compatibility. The CLI automatically:

- Installs/updates `accept-md-runtime` to match the **running CLI version** exactly
- Warns if versions don't match

**Best practices:**

- Use `npx --yes accept-md@latest init` to get the latest version (recommended)
- Run `npx accept-md version-check` to verify version compatibility
- The `doctor` command also reports version compatibility

**Troubleshooting version issues:**

If you see version mismatch warnings:

```bash
# Check current versions
npx accept-md version-check

# Update to latest
npm install accept-md-runtime@latest
# or
pnpm add accept-md-runtime@latest
```

## Limitations

- **API routes** are excluded (no markdown representation).
- **Rewrites/Middleware**: Rewrites in `next.config` are preferred; middleware runs at the edge. The actual HTML→Markdown conversion runs in the Node.js handler.
- **Custom servers**: If you use a custom server, ensure the internal fetch to your own origin works (correct `baseUrl` or host headers).
- **i18n**: Paths are passed as-is; locale prefixes are included in the path. You can adjust with `transformers` or custom middleware if needed.

## Development

```bash
pnpm install
pnpm run build
pnpm run test
pnpm run lint
```

## Publishing

The repo publishes three packages to npm:

| Package | Description |
|---------|-------------|
| **accept-md** | CLI (`npx accept-md init`, `doctor`, `fix-routes`) |
| **@accept-md/core** | Route scanner, config types, project detection |
| **accept-md-runtime** | HTML→Markdown conversion, handler templates |

**Prerelease checklist:** run `pnpm run build`, `pnpm run test`, and `pnpm run lint` from the repo root.

**Via GitHub Release (recommended):** Create a new release (e.g. `v1.0.2`). The [Publish to npm](.github/workflows/publish.yml) workflow runs on release and publishes all non-private workspace packages using npm Trusted Publisher (OIDC). No `NPM_TOKEN` is required once the workflow is registered as a Trusted Publisher for each package on npm.

**Manual publish (from repo root):** Bump versions in `packages/cli`, `packages/core`, and `packages/middleware`, then:

```bash
pnpm run publish:dry-run   # See what would be published (no upload)
pnpm run release           # Build and publish all three packages in order
```

Only `accept-md`, `@accept-md/core`, and `accept-md-runtime` are published. The root, `website`, and `examples/*` are private.

Run examples:

```bash
cd examples/app-router && pnpm install && pnpm dev
# In another terminal:
curl -H "Accept: text/markdown" http://localhost:3000/
```

## Contributing

Contributions are welcome. Please open an issue or PR. Ensure tests and the examples still pass.

## License

MIT
