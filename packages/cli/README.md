# accept-md

CLI for [accept-md](https://github.com/slick-enterprises/accept-md): scaffold middleware and a markdown handler in your Next.js app so that requests with `Accept: text/markdown` get a markdown version of the page.

## Installation

Use via `npx` (no global install):

```bash
npx accept-md init
```

Or install as a dev dependency:

```bash
pnpm add -D accept-md
# or npm install -D accept-md
```

## Commands

### `accept-md init [path]`

Scans your Next.js project, detects App Router vs Pages Router and middleware location, and:

- Creates or updates middleware to rewrite `Accept: text/markdown` to the handler
- Adds the handler at `app/api/accept-md/route.ts` or `route.js` (App) or `pages/api/accept-md/index.ts` or `index.js` (Pages), depending on whether the project has TypeScript
- Creates `accept-md.config.js`
- Adds `accept-md-runtime` to dependencies

**Options:**

| Option | Description |
|--------|-------------|
| `path` | Project root (default: current directory) |
| `--app-dir=<path>` | App directory (e.g. `app` or `src/app`) |
| `--pages-dir=<path>` | Pages directory (e.g. `pages` or `src/pages`) |
| `--middleware=<path>` | Middleware file (e.g. `middleware.ts` or `src/middleware.ts`) |

### `accept-md doctor [path]`

Reports detected router, routes, and potential issues (missing handler, config, etc.).

### `accept-md fix-routes [path]`

Patches `.next/routes-manifest.json` so it has a `dataRoutes` array. Use after `next build` if you hit “routesManifest.dataRoutes is not iterable” on Next.js 15+ with `next start`.

## Programmatic API

```ts
import { runInit, runDoctor, runFixRoutes, detectProject } from 'accept-md';
```

- **`runInit(projectRoot, overrides?)`** – run init logic
- **`runDoctor(projectRoot)`** – run doctor, returns report
- **`runFixRoutes(projectRoot)`** – run fix-routes
- **`detectProject(projectRoot)`** – detect app/pages/middleware paths

## License

MIT · [Repository](https://github.com/slick-enterprises/accept-md)
