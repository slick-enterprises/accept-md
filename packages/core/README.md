# @accept-md/core

Core utilities for the [accept-md](https://github.com/slick-enterprises/accept-md) ecosystem: Next.js route scanning, config types, and project detection. Used by the **accept-md** CLI and tooling.

## Installation

```bash
pnpm add @accept-md/core
# or npm install @accept-md/core
```

## API

### `scanProject(projectRoot, options?)`

Scans a Next.js project and returns all routes (App Router and/or Pages Router).

```ts
import { scanProject } from '@accept-md/core';

const { routes, routerType } = scanProject('/path/to/next-app', {
  appDir: 'app',      // default
  pagesDir: 'pages',  // default
});
// routes: ParsedRoute[]
// routerType: 'app' | 'pages' | null
```

### `scanAppRouter(appDir)` / `scanPagesRouter(pagesDir)`

Scan only App Router or only Pages Router directories.

### Types

- **`ParsedRoute`** – path, segments, router type, source path
- **`RouteSegment`** – segment name, type (page, layout, etc.), dynamic type
- **`NextMarkdownConfig`** – config shape for include/exclude, cleanSelectors, cache, transformers, etc.
- **`RouterType`** – `'app' | 'pages'`

### Config

- **`loadConfig(projectRoot)`** – loads `accept-md.config.js` (re-exported from `accept-md-runtime` for convenience; core defines the types).

## License

MIT · [Repository](https://github.com/slick-enterprises/accept-md)
