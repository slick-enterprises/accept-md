# accept-md

**Serve clean Markdown representations of any Next.js page** when clients request `Accept: text/markdown`. No changes to your existing pages; works with App Router, Pages Router, SSG, SSR, and ISR.

## Use cases

- **AI crawlers & LLM ingestion** – expose content as markdown for indexing
- **Documentation exports** – one command to get markdown from docs sites
- **Content syndication** – reuse content in other systems
- **SEO tooling** – alternate representations for analysis
- **Content portability** – canonical markdown alongside HTML

## How it works

1. **Middleware** intercepts requests with `Accept: text/markdown`.
2. The request is **rewritten** to an internal handler with the original path.
3. The handler **fetches the same URL** as HTML (your app renders it once), then converts HTML → Markdown (strip nav/footer, preserve headings, links, images, tables).
4. The **markdown response** is returned and can be cached like any other response.

No Puppeteer, no custom server, no edits to your page components.

## Installation

### 1. Run init (recommended)

From your Next.js project root:

```bash
npx accept-md init
```

This will:

- Detect App Router vs Pages Router (supports both root and **src/** layout: `app` or `src/app`, `pages` or `src/pages`)
- Create or update middleware (at `middleware.ts` or `src/middleware.ts` by default) to rewrite `Accept: text/markdown` to the markdown handler
- Add the handler at `app/api/accept-md/route.ts` or `route.js` (or under `src/`; App Router), or `pages/api/accept-md/index.ts` or `index.js` (Pages Router)
- Create `accept-md.config.js`
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

Add middleware that rewrites `Accept: text/markdown` to `/api/accept-md?path=<path>`, and add the API route / Route Handler that calls `getMarkdownForPath` from the package. See the [examples](./examples) for full code.

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

Scans the project, generates middleware and handler, and creates config. Detects **app** / **pages** and **middleware** paths (including `src/app`, `src/pages`, `src/middleware.ts`). If middleware already exists at the target path, it wraps your middleware so markdown runs first.

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

- **SSG**: First request with `Accept: text/markdown` triggers a render of the page (as HTML), conversion to markdown, and optional in-memory cache. Subsequent requests can be served from cache.
- **SSR / ISR**: Same as above; markdown is generated on demand and cached per your config. Cache headers follow the handler (`Cache-Control` when `cache: true`).

The runtime does not pre-generate markdown at build time; it generates on first request and then caches. This keeps the implementation simple and avoids custom build steps.

## Limitations

- **API routes** are excluded (no markdown representation).
- **Middleware** runs at the edge; the actual HTML→Markdown conversion runs in the Node.js handler.
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
