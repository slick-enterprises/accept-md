# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
