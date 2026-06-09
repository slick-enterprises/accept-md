---
title: "CLI Reference"
description: "Use accept-md init, doctor, fix-routes, and version-check in local and CI workflows."
date: "2026-06-09"
order: 4
category: "Reference"
keywords:
  - accept-md CLI
  - npx accept-md
  - accept-md doctor
  - fix-routes
---

The `accept-md` CLI sets up projects and helps diagnose deployment issues.

## init

```bash
npx --yes accept-md@latest init [path]
```

`init` detects the framework, adds the runtime dependency, writes `accept-md.config.js`, and creates the handler route.

For Next.js, it prefers rewrites in `next.config`. Middleware remains supported for existing projects and fallback cases.

## doctor

```bash
npx accept-md doctor [path]
```

`doctor` reports the detected framework, router, handler location, config file, and common setup issues.

Run it when Markdown requests return HTML, 404, or an unexpected error.

## fix-routes

```bash
npx accept-md fix-routes [path]
```

Some Next.js 15+ builds can produce a routes manifest without `dataRoutes`. `fix-routes` patches the manifest so `next start` and deployment runtimes can read it safely.

The website uses this as a `postbuild` step:

```json
{
  "scripts": {
    "postbuild": "npx accept-md fix-routes"
  }
}
```

## version-check

```bash
npx accept-md version-check [path]
```

`version-check` compares the CLI and installed `accept-md-runtime` versions. Keep them aligned so generated handlers and runtime behavior match.

## CI recommendation

Use the latest CLI for setup and keep `doctor` available for diagnostics:

```bash
npx --yes accept-md@latest init
npx accept-md doctor
```
