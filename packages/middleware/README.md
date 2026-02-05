# accept-md-runtime

Runtime for [accept-md](https://github.com/hemanthvalsaraj/accept-md): HTML-to-Markdown conversion and the handler that serves markdown for Next.js pages when clients send `Accept: text/markdown`. Use this in your Next.js API route or Route Handler.

## Installation

```bash
pnpm add accept-md-runtime
# or npm install accept-md-runtime
```

**Peer dependency:** Next.js 12 or later.

## Quick setup

1. Add middleware that rewrites `Accept: text/markdown` requests to your handler (e.g. `/api/accept-md?path=...`).
2. In that API route / Route Handler, call `getMarkdownForPath` with the request and path.

Or use the CLI: `npx accept-md init` to generate middleware and handler for you.

## API

### `getMarkdownForPath(req, path, options?)`

Fetches the given path as HTML from your app, converts it to markdown, and returns it. Use this in your App Router Route Handler or Pages API route.

```ts
import { getMarkdownForPath } from 'accept-md-runtime';

// App Router: app/api/accept-md/route.js (or route.ts)
export async function GET(req: Request) {
  const path = new URL(req.url).searchParams.get('path') ?? '/';
  const markdown = await getMarkdownForPath(req, path);
  return new Response(markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
```

### `htmlToMarkdown(html, options?)`

Converts an HTML string to markdown (uses Turndown; optional selectors to strip).

### `loadConfig(projectRoot)`

Loads `accept-md.config.js` and returns a `NextMarkdownConfig` object.

### Types

- **`NextMarkdownConfig`** – include, exclude, cleanSelectors, cache, transformers, baseUrl, debug
- **`MarkdownOptions`** – options for `htmlToMarkdown`
- **`GetMarkdownOptions`** – options for `getMarkdownForPath`

### Templates (for tooling)

- **`MIDDLEWARE_TEMPLATE`** – snippet for Next.js middleware
- **`APP_ROUTE_HANDLER_TEMPLATE`** – snippet for App Router handler
- **`PAGES_API_HANDLER_TEMPLATE`** – snippet for Pages API handler

## License

MIT · [Repository](https://github.com/hemanthvalsaraj/accept-md)
