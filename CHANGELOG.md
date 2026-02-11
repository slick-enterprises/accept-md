# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2025-01-XX

### Added

- **JSON-LD Structured Data Extraction**: JSON-LD scripts (`<script type="application/ld+json">`) are now automatically extracted and included as formatted JSON code blocks at the end of markdown output. This preserves structured data for LLMs and search engines.
- **Meta Tags to YAML Frontmatter**: HTML meta tags are now automatically extracted and included as YAML frontmatter at the top of markdown output. Supports:
  - Basic meta tags: `title`, `description`, `keywords`, `author`, `canonical`, `robots`
  - OpenGraph: `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:site_name`, `og:locale`
  - Article: `article:author`, `article:published_time`, `article:modified_time`, `article:section`, `article:tag`
  - Twitter: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:creator`, `twitter:site`
- **Extended Cache with Build/ISR Detection**: Cache now intelligently invalidates based on:
  - **Build detection**: Automatically invalidates when `BUILD_ID` environment variable changes (new build detected)
  - **ISR revalidation**: Respects `x-next-revalidate` header from Next.js responses and expires entries when revalidation time is reached
  - Cache entries now include expiration timestamps and build IDs
- **Debug Mode**: New `debug` option in config to enable size information in markdown output:
  ```markdown
  <!-- accept-md: html_size=52480 bytes, markdown_size=20480 bytes, reduction=61% -->
  ```
- **Frontmatter Configuration**: New `includeFrontmatter` option (default: `true`) to control whether YAML frontmatter is included in output

### Changed

- **Cache Structure**: Cache entries now use `CacheEntry` interface with `markdown`, `expiresAt`, and `buildId` fields. Backward compatible with old `Map<string, string>` format.
- **Performance**: Optimized HTML parsing to single-pass extraction for metadata and JSON-LD scripts

### Documentation

- Added comprehensive "Output Format" section explaining YAML frontmatter and JSON-LD inclusion
- Added detailed cache behavior documentation explaining build/ISR detection
- Updated README with examples of structured data output

## [1.0.27] - 2025-02-05

### Fixed

- **Vercel default deployments**: `accept-md-runtime` now prefers the public origin (or `baseUrl`) when fetching HTML and only falls back to `VERCEL_URL` when the primary origin fails, fixing cases where the deployment host returns 401 while the public domain is 200.

## [1.0.24] - 2025-01-XX

### Fixed

- **TypeScript types**: Added `headers` property to `GetMarkdownOptions` interface to support forwarding headers (e.g., for Vercel deployment protection). This fixes TypeScript errors when using the generated route handlers in TypeScript projects.

## [1.0.14] - 2025-01-XX

### Fixed

- **Vercel deployment**: Fixed "fetch failed" error when deployed on Vercel. The handler now uses Vercel's internal deployment URL (`VERCEL_URL`) for internal fetches instead of the public domain, avoiding external network issues.

## [1.0.6] - 2025-02-04

### Fixed

- **init** wrapper middleware now imports the user backup with the correct extension (e.g. `./middleware.user.ts` when the original was `middleware.ts`), instead of always importing `./middleware.user.js`.

## [1.0.3] - 2025-02-04

### Fixed

- **init** generated middleware and route handler now use valid JavaScript only (no `import type` or type annotations), so they work in projects that use `middleware.js` or other plain-JS files. Fixes parsing errors when the build treats the file as JavaScript.

### Changed

- **init** backup message now shows the actual backup filename (e.g. `middleware.user.js` when the existing file is `middleware.js`).

## [1.0.2] - 2025-02-04

### Fixed

- **init** no longer fails with "Not a Next.js project" when `next` is in `optionalDependencies` or `peerDependencies`. Detection now checks all dependency fields.
- **init** in a monorepo: when run from the repo root (where the root `package.json` has no `next`), the CLI looks for a Next.js app under `apps/` or `packages/` and suggests running from that directory (e.g. `cd apps/web && npx accept-md init`).

### Added

- **ProjectDetection** now includes optional `nextAppPath` when a Next.js app is found in a workspace subdirectory.

## [1.0.1] - 2025-01-XX

Initial public release.

- CLI: `init`, `doctor`, `fix-routes`
- App Router and Pages Router support
- HTML→Markdown conversion via `accept-md-runtime`
- Configurable include/exclude, clean selectors, transformers, cache
