# Contributing to accept-md

**AI agents and automated tools:** See [AGENTS.md](../AGENTS.md) and `.cursor/rules/` in the repo root for rules that keep changes consistent (e.g. JS-compatible handlers, package boundaries).

## Setup

1. Clone the repo and install dependencies:
   ```bash
   pnpm install
   ```

2. Build all packages:
   ```bash
   pnpm run build
   ```

3. Run tests:
   ```bash
   pnpm run test
   ```

## Project layout

- **packages/core** – Route scanner (app/pages), config loading, types. No runtime dependency on Next.
- **packages/middleware** – Published as `accept-md-runtime`. HTML→Markdown (turndown + linkedom), handler logic, config loader, templates.
- **packages/cli** – Published as `accept-md`. Commands: `init`, `doctor`. Init supports configurable app/pages and middleware paths (e.g. `src/app`, `src/middleware.ts`) via detection, prompts, or `--app-dir` / `--pages-dir` / `--middleware` flags. Depends on core and runtime.

## Making changes

- Use TypeScript and ESM.
- Prefer minimal config; keep the runtime dependency set small (turndown, linkedom only).
- When changing the handler or middleware contract, update both App Router and Pages Router examples and the README.

## Testing

- Unit tests live next to source or in `**/*.test.ts`.
- Example apps in `examples/` can be run manually:
  - `cd examples/app-router && pnpm dev` then `curl -H "Accept: text/markdown" http://localhost:3000/`
  - Same for `examples/pages-router` (port 3001).

## Releasing

- Bump version in all `packages/cli`, `packages/core`, and `packages/middleware` `package.json` (and root if desired). Keep versions in sync across the three published packages.
- **Dry-run** (see what would be published): `pnpm run publish:dry-run`
- **Publish** (from a clean build): `pnpm run release` runs build then publishes in order: `@accept-md/core`, `accept-md-runtime`, `accept-md` (CLI).
- **CI**: Publishing is done from CI via GitHub Actions (see `.github/workflows/publish.yml`) on release or version tags. Uses npm Trusted Publisher (OIDC); only the three packages above are published (root, website, and examples are private).

### One-time: npm Trusted Publisher (OIDC)

Publishing uses OpenID Connect so you don’t need long-lived npm tokens.

1. **Create the workflow first** (already in this repo): `.github/workflows/publish.yml` must exist and be pushed so npm can verify it.

2. **On npm, for each published package** (`@accept-md/core`, `accept-md`, `accept-md-runtime`):
   - Open the package → **Settings** → **Trusted Publisher**.
   - Choose **GitHub Actions**.
   - Fill in:
     - **Organization or user:** `hemanthvalsaraj`
     - **Repository:** `accept-md`
     - **Workflow filename:** `publish.yml` (filename only, with extension).
   - Optional: set **Environment name** (e.g. `npm`) and add `environment: npm` to the `publish` job in `publish.yml`.
   - Click **Set up connection**.

3. **Trigger a publish**: Create a GitHub Release (e.g. “Publish” a release from the Releases page). The workflow runs and publishes all non-private workspace packages to npm using OIDC.
