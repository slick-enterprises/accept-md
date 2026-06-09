---
title: "Vercel"
description: "Deploy accept-md on Vercel with the right base URL, postbuild hook, and cache checks."
date: "2026-06-07"
order: 4
category: "Deployment"
keywords:
  - Vercel markdown
  - accept-md Vercel
  - Accept: text/markdown Vercel
  - Next.js Vercel markdown
---

accept-md works on Vercel for Next.js and SvelteKit projects.

## Base URL

The runtime may need a stable origin when it fetches the HTML version of a page:

```javascript
module.exports = {
  baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
};
```

Use your canonical production domain if preview URLs are not appropriate for your deployment.

## Postbuild fix

For Next.js 15+ route manifest issues, add:

```json
{
  "scripts": {
    "postbuild": "npx accept-md fix-routes"
  }
}
```

This keeps `routesManifest.dataRoutes` available for runtimes that expect it.

## Cache validation

After deploy, test both representations:

```bash
curl -sI -H "Accept: text/markdown" https://your-site.com/
curl -sI -H "Accept: text/html" https://your-site.com/
```

Confirm Markdown responses include `Vary: Accept` and that HTML responses still serve the browser page.

## Preview deployments

Preview deployments are useful for testing Markdown conversion before production. [Run a Markdown audit](/markdown-audit) against the preview URL and inspect logs before promoting.
