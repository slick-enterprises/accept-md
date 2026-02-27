---
title: "Serve Markdown from Next.js Without Puppeteer (Lightweight Solution)"
description: "Learn how to serve Markdown from Next.js pages without Puppeteer's overhead. Use Accept headers for a lightweight, production-ready approach."
date: 2026-02-08
author: accept-md team
keywords:
  - next.js markdown without puppeteer
  - serve markdown nextjs
  - lightweight markdown next.js
  - nextjs markdown no puppeteer
  - accept header markdown
---


Puppeteer is often the go-to solution for converting web pages to Markdown, but it's heavy, slow, and unnecessary for Next.js applications. Since Next.js pages are server-rendered, you don't need a headless browser—you can serve Markdown directly using HTTP's Accept header.

This guide shows you how to serve Markdown from Next.js without Puppeteer, using a lightweight approach that's faster, more efficient, and easier to deploy.

## Why Avoid Puppeteer for Next.js?

Puppeteer and similar headless browser tools have significant drawbacks:

### Performance Issues

- **Slow startup**: Each request spawns a browser process (1-2 seconds overhead)
- **Memory intensive**: 50-100MB per request
- **Limited concurrency**: Can only handle 5-10 concurrent requests
- **CPU heavy**: Full browser rendering is expensive

### Deployment Complexity

- **Large dependencies**: Requires Chromium binary (~170MB)
- **System libraries**: Needs additional OS packages
- **Serverless limitations**: Difficult on platforms like Vercel
- **Cold start delays**: Especially problematic in serverless functions

### Unnecessary for Next.js

Since Next.js pages are **already server-rendered**, you don't need browser rendering:

- HTML is generated on the server
- No client-side JavaScript execution required
- Content is available immediately
- No need to wait for React hydration

## The Accept Header Approach

HTTP's `Accept` header is the standard way to request different content types. Instead of using Puppeteer, you can:

1. Intercept requests with `Accept: text/markdown`
2. Fetch your page as HTML (it's already rendered)
3. Convert HTML to Markdown
4. Return clean Markdown

### How It Works

```bash
# Regular user (gets HTML)
curl https://your-site.com/page

# Markdown request (gets Markdown)
curl -H "Accept: text/markdown" https://your-site.com/page
```

Your Next.js app serves the same URL, but returns different content based on the Accept header.

## Implementation: Next.js Rewrites

Next.js rewrites can intercept requests based on headers and route them to a handler.

### Step 1: Configure Rewrites

Add to your `next.config.js`:

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'accept',
            value: '(?<accept>.*text/markdown.*)',
          },
        ],
        destination: '/api/accept-md?path=:path*',
      },
    ];
  },
};
```

This configuration:
- Matches any path (`/:path*`)
- Checks for `Accept: text/markdown` header
- Routes to `/api/accept-md` handler with the original path

### Step 2: Create Markdown Handler

Create the handler that converts HTML to Markdown:

```javascript
// app/api/accept-md/route.js
import { NextResponse } from 'next/server';
import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

export async function GET(request) {
  const path = request.nextUrl.searchParams.get('path') || '/';
  const baseUrl = request.nextUrl.origin;
  
  // Fetch your own page as HTML
  const htmlResponse = await fetch(`${baseUrl}${path}`, {
    headers: {
      // Remove Accept header to get HTML
      accept: 'text/html',
    },
  });
  
  if (!htmlResponse.ok) {
    return NextResponse.json(
      { error: 'Page not found' },
      { status: 404 }
    );
  }
  
  const html = await htmlResponse.text();
  
  // Clean HTML (remove nav, footer, etc.)
  const cleaned = html
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Convert to Markdown
  const markdown = turndownService.turndown(cleaned);
  
  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate',
    },
  });
}
```

### Step 3: Install Dependencies

```bash
npm install turndown
# or
pnpm add turndown
```

That's it! No Puppeteer, no Chromium, no heavy dependencies.

## Advanced: Metadata Extraction

For production use, you'll want to extract and preserve HTML metadata as YAML frontmatter.

### Enhanced Handler with Metadata

```javascript
// app/api/accept-md/route.js
import { NextResponse } from 'next/server';
import TurndownService from 'turndown';
import { parseHTML } from 'linkedom';

function extractMetadata(html) {
  const { document } = parseHTML(html);
  const metadata = {};
  
  // Extract title
  const title = document.querySelector('title');
  if (title) metadata.title = title.textContent;
  
  // Extract meta tags
  document.querySelectorAll('meta').forEach((meta) => {
    const name = meta.getAttribute('name') || meta.getAttribute('property');
    const content = meta.getAttribute('content');
    if (name && content) {
      metadata[name.replace('og:', 'og_')] = content;
    }
  });
  
  return metadata;
}

function formatFrontmatter(metadata) {
  const yaml = Object.entries(metadata)
    .map(([key, value]) => `${key}: "${value}"`)
    .join('\n');
  return `---\n${yaml}\n---\n\n`;
}

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

export async function GET(request) {
  const path = request.nextUrl.searchParams.get('path') || '/';
  const baseUrl = request.nextUrl.origin;
  
  const htmlResponse = await fetch(`${baseUrl}${path}`, {
    headers: { accept: 'text/html' },
  });
  
  if (!htmlResponse.ok) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  const html = await htmlResponse.text();
  const metadata = extractMetadata(html);
  
  // Clean and convert
  const cleaned = html
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  const markdown = turndownService.turndown(cleaned);
  
  // Prepend frontmatter
  const frontmatter = Object.keys(metadata).length > 0
    ? formatFrontmatter(metadata)
    : '';
  
  return new NextResponse(frontmatter + markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate',
    },
  });
}
```

## Caching Strategy

To improve performance, implement intelligent caching:

```javascript
// app/api/accept-md/route.js
const cache = new Map();

export async function GET(request) {
  const path = request.nextUrl.searchParams.get('path') || '/';
  
  // Check cache
  const cacheKey = path;
  if (cache.has(cacheKey)) {
    return new NextResponse(cache.get(cacheKey), {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600',
      },
    });
  }
  
  // Generate markdown...
  const markdown = await generateMarkdown(path);
  
  // Cache result
  cache.set(cacheKey, markdown);
  
  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600',
    },
  });
}
```

### Cache Invalidation

Invalidate cache on build:

```javascript
// Invalidate on BUILD_ID change
const buildId = process.env.BUILD_ID || process.env.NEXT_BUILD_ID;
if (buildId && lastBuildId !== buildId) {
  cache.clear();
  lastBuildId = buildId;
}
```

## Performance Comparison

Here's how the Accept header approach compares to Puppeteer:

| Metric | Puppeteer | Accept Header |
|--------|-----------|---------------|
| **Response Time** | 1.5-2.5s | 50-300ms |
| **Memory per Request** | 50-100MB | <5MB |
| **Concurrent Requests** | 5-10 | 50-100+ |
| **Dependencies Size** | ~170MB | <1MB |
| **Cold Start** | 3-5s | <100ms |
| **Serverless Friendly** | ❌ | ✅ |

## Using accept-md (Production Solution)

For a production-ready solution that handles all the complexity, use [accept-md](https://accept.md):

### Quick Setup

```bash
npx accept-md init
```

This automatically:
- Detects your Next.js router (App or Pages)
- Adds rewrites to `next.config.js`
- Creates the markdown handler with metadata extraction
- Sets up intelligent caching
- Configures clean selectors

### Features

- **Zero page changes**: Your components stay HTML-only
- **Metadata extraction**: HTML meta tags → YAML frontmatter
- **JSON-LD preservation**: Structured data maintained
- **Intelligent caching**: Respects Next.js build cycles
- **Works with all rendering**: SSG, SSR, ISR supported

### Configuration

```javascript
// accept-md.config.js
module.exports = {
  include: ['/**'],
  exclude: ['/api/**', '/_next/**'],
  cleanSelectors: ['nav', 'footer', '.no-markdown'],
  cache: true,
};
```

### Usage

```bash
curl -H "Accept: text/markdown" https://your-site.com/page
```

## Best Practices

### 1. Clean HTML Selectors

Remove navigation and UI chrome:

```javascript
cleanSelectors: [
  'nav',
  'footer',
  '.sidebar',
  '.ads',
  '[data-no-markdown]',
],
```

### 2. Handle Images

Ensure image URLs are absolute:

```javascript
transformers: [
  (md) => md.replace(/\]\((\/[^)]+)\)/g, (match, path) => {
    return `](https://your-site.com${path})`;
  }),
],
```

### 3. Preserve Structure

Maintain heading hierarchy:

```javascript
const turndownService = new TurndownService({
  headingStyle: 'atx', // Use # for headings
});
```

### 4. Exclude Routes

Don't convert API routes or internal paths:

```javascript
exclude: ['/api/**', '/_next/**', '/admin/**'],
```

### 5. Set Cache Headers

Use appropriate cache control:

```javascript
'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
```

## Common Issues and Solutions

### Issue: Relative URLs Break

**Solution**: Use transformers to make URLs absolute:

```javascript
transformers: [
  (md) => md.replace(/\]\((\/[^)]+)\)/g, `](https://your-site.com$1)`),
],
```

### Issue: Code Blocks Not Fenced

**Solution**: Configure Turndown:

```javascript
const turndownService = new TurndownService({
  codeBlockStyle: 'fenced',
});
```

### Issue: Tables Not Converting

**Solution**: Turndown handles tables by default, but complex nested structures may need custom rules.

### Issue: Metadata Not Preserved

**Solution**: Extract metadata before conversion and add as frontmatter:

```javascript
const metadata = extractMetadata(html);
const frontmatter = formatYaml(metadata);
const markdown = frontmatter + turndownService.turndown(cleaned);
```

## Testing

Test your implementation:

```bash
# Request Markdown
curl -H "Accept: text/markdown" http://localhost:3000/

# Should return Markdown, not HTML
```

Verify:
- ✅ Returns `text/markdown` content type
- ✅ Contains clean Markdown (no HTML tags)
- ✅ Includes metadata in frontmatter
- ✅ Navigation and footer removed
- ✅ Images have absolute URLs

## Conclusion

Serving Markdown from Next.js without Puppeteer is not only possible but recommended. The Accept header approach provides:

- **Better performance**: 10-50x faster than Puppeteer
- **Lower resource usage**: <5MB vs 50-100MB per request
- **Easier deployment**: No Chromium dependencies
- **Serverless friendly**: Works on Vercel, Netlify, etc.
- **Standards compliant**: Uses HTTP Accept header

Since Next.js pages are server-rendered, you don't need browser rendering. Fetch the HTML, convert to Markdown, and serve it—simple, fast, and efficient.

**Ready to implement?** Use [accept-md](https://accept.md) for a production-ready solution, or build your own using the patterns in this guide.

## FAQ

### Why not use Puppeteer?

Puppeteer is unnecessary for Next.js since pages are already server-rendered. It adds 1-2 seconds of overhead and 50-100MB of memory per request.

### Does this work with SSR and ISR?

Yes! The Accept header approach works with all Next.js rendering strategies: SSG, SSR, and ISR.

### Will this affect regular users?

No. Regular users requesting HTML see no difference. Only requests with `Accept: text/markdown` receive Markdown.

### How do I handle authentication?

The handler can forward authentication headers to your page fetch, so protected routes work correctly.

### Can I customize the Markdown output?

Yes, you can use Turndown options and custom transformers to customize the output format.
