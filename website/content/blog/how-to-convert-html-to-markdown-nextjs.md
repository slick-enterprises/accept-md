---
title: "How to Convert HTML to Markdown in Next.js (Complete Guide)"
description: "Learn how to convert HTML pages to Markdown in Next.js for AI crawlers, documentation exports, and content portability. Step-by-step guide with code examples."
date: 2026-01-18
author: accept-md team
keywords:
  - html to markdown next.js
  - convert html markdown nextjs
  - next.js markdown conversion
  - html markdown converter
  - nextjs html to markdown
---

# How to Convert HTML to Markdown in Next.js (Complete Guide)

Converting HTML to Markdown in Next.js is becoming essential for modern web applications. Whether you're building AI crawler endpoints, exporting documentation, or enabling content syndication, serving Markdown alongside HTML opens up powerful possibilities.

In this guide, you'll learn multiple approaches to convert HTML to Markdown in Next.js, from simple libraries to production-ready solutions that work with all Next.js rendering strategies.

## Why Convert HTML to Markdown?

Before diving into implementation, let's understand the use cases:

### AI Crawlers and LLM Ingestion

AI models and LLMs work better with clean Markdown than HTML. By serving Markdown versions of your pages, you enable:

- Better content indexing for AI search engines
- Cleaner data for LLM training pipelines
- Structured content extraction without HTML noise

### Documentation Exports

Many teams need to export their documentation sites as Markdown for:

- Offline documentation
- Migration to other platforms
- Version control and archival
- Developer tooling integration

### Content Syndication

Markdown is the universal format for content portability. Converting HTML to Markdown enables:

- Reusing content across platforms
- Newsletter generation
- Content management system integration
- Multi-channel publishing

## Method 1: Using Turndown (Basic Approach)

The most straightforward way to convert HTML to Markdown is using [Turndown](https://github.com/mixmark-io/turndown), a popular JavaScript library.

### Installation

```bash
npm install turndown
# or
pnpm add turndown
```

### Basic Implementation

Create an API route in your Next.js app:

```javascript
// app/api/markdown/route.js
import TurndownService from 'turndown';

export async function GET(request) {
  const url = new URL(request.url);
  const targetPath = url.searchParams.get('path') || '/';
  
  // Fetch your page as HTML
  const baseUrl = request.nextUrl.origin;
  const htmlResponse = await fetch(`${baseUrl}${targetPath}`);
  const html = await htmlResponse.text();
  
  // Convert to Markdown
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  });
  
  // Remove navigation and footer
  const cleanedHtml = html
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
  
  const markdown = turndownService.turndown(cleanedHtml);
  
  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
```

### Limitations of Basic Approach

While this works, you'll quickly encounter challenges:

- **No metadata extraction**: HTML meta tags aren't converted to YAML frontmatter
- **Manual cleanup required**: You need to manually strip navigation, footers, and other UI elements
- **No caching**: Every request regenerates Markdown
- **SSR/ISR complexity**: Handling different Next.js rendering strategies requires additional logic

## Method 2: Using Accept Header (Production-Ready)

A more elegant solution uses HTTP's `Accept` header to serve Markdown when requested, while regular users still get HTML. This follows web standards and requires zero changes to your page components.

### How Accept Header Works

The `Accept` header tells the server what content type the client prefers:

```bash
# Request HTML (default)
curl https://your-site.com/page

# Request Markdown
curl -H "Accept: text/markdown" https://your-site.com/page
```

### Implementation with Next.js Rewrites

Next.js rewrites can intercept requests with `Accept: text/markdown` and route them to a markdown handler:

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

### Handler Implementation

```javascript
// app/api/accept-md/route.js
import { getMarkdownForPath, loadConfig } from 'accept-md-runtime';

const cache = new Map();

export async function GET(request) {
  const path = request.nextUrl.searchParams.get('path') || '/';
  const config = loadConfig(process.cwd());
  
  const markdown = await getMarkdownForPath({
    pathname: path,
    baseUrl: request.nextUrl.origin,
    config,
    cache,
    headers: request.headers,
  });
  
  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate',
    },
  });
}
```

### Benefits of Accept Header Approach

1. **Zero page changes**: Your React components stay HTML-only
2. **Works with all rendering strategies**: SSG, SSR, ISR all supported
3. **Automatic metadata extraction**: HTML meta tags become YAML frontmatter
4. **Intelligent caching**: Respects Next.js build cycles and ISR revalidation
5. **No Puppeteer**: Lightweight, no headless browser overhead

## Method 3: Using accept-md (Recommended)

For production applications, using a dedicated solution like [accept-md](https://accept.md) handles all the complexity:

### Quick Setup

```bash
npx accept-md init
```

This automatically:
- Detects your Next.js router (App Router or Pages Router)
- Adds rewrites to `next.config.js`
- Creates the markdown handler
- Sets up configuration

### Configuration

Create `accept-md.config.js`:

```javascript
module.exports = {
  include: ['/**'],
  exclude: ['/api/**', '/_next/**'],
  cleanSelectors: ['nav', 'footer', '.no-markdown'],
  cache: true,
  transformers: [
    (md) => md.replace(/\]\(\/\/)/g, '](https://)'),
  ],
};
```

### Usage

Once configured, any page can be requested as Markdown:

```bash
curl -H "Accept: text/markdown" https://your-site.com/
curl -H "Accept: text/markdown" https://your-site.com/docs/getting-started
```

## Advanced Features

### Metadata Preservation

Modern HTML-to-Markdown converters extract and preserve metadata:

**HTML:**
```html
<head>
  <title>Getting Started</title>
  <meta name="description" content="Learn how to get started">
  <meta property="og:title" content="Getting Started Guide">
</head>
```

**Markdown Output:**
```markdown
---
title: Getting Started
description: Learn how to get started
og_title: Getting Started Guide
---

# Your content here
```

### JSON-LD Structured Data

JSON-LD scripts are preserved as code blocks:

```markdown
# Content

## Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title"
}
```
```

### Custom Transformers

Post-process Markdown with custom transformers:

```javascript
transformers: [
  // Fix relative URLs
  (md) => md.replace(/\]\(\/\/)/g, '](https://)'),
  // Add custom formatting
  (md) => md.replace(/Note:/g, '**Note:**'),
],
```

## Performance Considerations

### Caching Strategy

Markdown generation can be expensive. Implement caching:

- **In-memory cache**: Fast, but lost on server restart
- **Build-time cache**: Persists across deployments
- **ISR-aware cache**: Respects Next.js revalidation times

### Build Impact

Avoid generating Markdown at build time for large sites. Instead:

- Generate on first request
- Cache the result
- Invalidate on rebuild or revalidation

## Best Practices

1. **Exclude unnecessary routes**: Don't convert API routes or internal Next.js paths
2. **Clean selectors**: Remove navigation, footers, and UI chrome
3. **Preserve structure**: Maintain heading hierarchy and semantic HTML
4. **Handle images**: Ensure image URLs are absolute or properly resolved
5. **Test with real content**: Verify conversion quality with your actual pages

## Common Pitfalls

### Relative URLs

Markdown often contains relative URLs that break when exported. Use transformers to fix:

```javascript
transformers: [
  (md) => md.replace(/\]\((\/[^)]+)\)/g, (match, path) => {
    return `](https://your-site.com${path})`;
  }),
],
```

### Code Blocks

Ensure code blocks are properly fenced:

```javascript
const turndownService = new TurndownService({
  codeBlockStyle: 'fenced',
});
```

### Tables

Turndown handles tables, but complex nested structures may need custom rules.

## Conclusion

Converting HTML to Markdown in Next.js opens up powerful possibilities for AI integration, documentation exports, and content portability. While basic Turndown implementations work for simple cases, production applications benefit from solutions that:

- Handle all Next.js rendering strategies
- Preserve metadata and structured data
- Implement intelligent caching
- Require zero changes to existing pages

The Accept header approach provides a standards-compliant way to serve Markdown alongside HTML, making your content accessible to both human users and automated systems.

**Ready to get started?** Try [accept-md](https://accept.md) for a production-ready solution that handles all the complexity, or implement your own using the patterns in this guide.

## FAQ

### Can I convert existing Next.js pages to Markdown?

Yes! Using the Accept header approach, you can serve Markdown versions of any existing page without modifying your components.

### Does this work with App Router and Pages Router?

Yes, both Next.js routing strategies are supported. The implementation differs slightly, but the concept is the same.

### Will this affect my regular users?

No. Regular users requesting HTML see no difference. Only requests with `Accept: text/markdown` receive Markdown.

### How do I handle authentication?

The markdown handler can forward authentication headers to your page fetch, so protected routes work correctly.

### Can I customize the Markdown output?

Yes, most solutions support custom transformers and configuration options for cleaning HTML, formatting, and post-processing.
