# Agent and AI contributor guidelines

This file gives AI agents and automated tools a short set of rules so changes stay consistent with the project.

## Must-do

1. **Keep user-facing code JS-compatible**
   - Handler **templates** in `packages/middleware/src/templates.ts` must be plain JavaScript (no type annotations).
   - **Examples** use `route.js` and `index.js` for the accept-md API route, not TypeScript-only.
   - The CLI writes `.ts` only when the target project has `tsconfig.json`; otherwise it writes `.js`. Do not change this.

2. **Respect package boundaries**
   - **packages/core**: Scanner, types, config types. No Next.js or runtime dependency.
   - **packages/middleware** (accept-md-runtime): HTML→Markdown, handler logic, templates. Used by end-user apps.
   - **packages/cli**: Init, doctor, fix-routes. Depends on core and runtime.

3. **Update all touchpoints on contract changes**
   - If you change the handler or middleware API, update both `examples/app-router` and `examples/pages-router`, and the README (and package READMEs) as needed.

4. **Verify before committing**
   - Run `pnpm run build` and `pnpm run test` from the repo root.

## Do not

- Convert handler templates or example route handlers to TypeScript-only.
- Remove support for `.js` handler files in init or doctor.
- Add TypeScript-only syntax to anything in `templates.ts` or to the generated handler content.
- Add new runtime dependencies without discussion (keep turndown + linkedom only).

## More detail

- **Cursor**: See `.cursor/rules/` for file-specific rules (project overview, handler/templates, package conventions).
- **Contributing**: Full setup, layout, and release process: `docs/CONTRIBUTING.md`.
