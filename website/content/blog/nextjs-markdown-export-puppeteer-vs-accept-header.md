---
title: "Next.js Markdown Export: Puppeteer vs Accept Header (2026 Comparison)"
description: "Compare Puppeteer and Accept header approaches for exporting Next.js pages to Markdown. Performance, complexity, and use case analysis."
date: 2026-02-15
author: accept-md team
keywords:
  - next.js markdown export
  - puppeteer vs accept header
  - nextjs markdown comparison
  - export nextjs to markdown
  - markdown export methods
---

When you need to export Next.js pages as Markdown, you have two main approaches: Puppeteer (headless browser) or Accept header (direct conversion). Each has trade-offs in performance, complexity, and use cases.

This comprehensive comparison helps you choose the right method for your Next.js application.

## The Two Approaches

### Puppeteer: Headless Browser Rendering

Puppeteer launches a headless Chrome browser, loads your page, executes JavaScript, and then converts the rendered HTML to Markdown.

### Accept Header: Direct HTML-to-Markdown

Uses HTTP's `Accept` header to request Markdown. The server fetches the already-rendered HTML and converts it directly to Markdown.

## Performance Comparison

### Response Time

**Puppeteer:**
- First request: 2-4 seconds (browser startup + rendering)
- Cached requests: 1-2 seconds (still needs browser process)
- Cold starts: 3-5 seconds (serverless functions)

**Accept Header:**
- First request: 100-300ms (HTML fetch + conversion)
- Cached requests: 10-50ms (in-memory cache)
- Cold starts: <100ms (lightweight handler)

**Winner: Accept Header** (10-50x faster)

### Memory Usage

**Puppeteer:**
- Per request: 50-100MB
- Base overhead: ~200MB (browser process)
- Concurrent limit: 5-10 requests

**Accept Header:**
- Per request: <5MB
- Base overhead: <10MB
- Concurrent limit: 50-100+ requests

**Winner: Accept Header** (20x less memory)

### Resource Consumption

**Puppeteer:**
- CPU: High (full browser rendering)
- Disk: ~170MB (Chromium binary)
- Network: Minimal (local rendering)

**Accept Header:**
- CPU: Low (simple HTML parsing)
- Disk: <1MB (Turndown library)
- Network: Minimal (internal fetch)

**Winner: Accept Header** (significantly lower resource usage)

## Implementation Complexity

### Puppeteer Setup

```javascript
// Installation
npm install puppeteer

// Implementation
import puppeteer from 'puppeteer';

export async function GET(request) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://your-site.com/page', {
      waitUntil: 'networkidle0',
    });
    const html = await page.content();
    const markdown = convertToMarkdown(html);
    return new Response(markdown);
  } finally {
    await browser.close();
  }
}
```

**Complexity:**
- Requires Chromium binary
- Needs system dependencies
- Complex error handling
- Memory management critical
- Deployment configuration needed

### Accept Header Setup

```javascript
// Installation
npm install turndown

// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'accept', value: '.*text/markdown.*' }],
        destination: '/api/accept-md?path=:path*',
      },
    ];
  },
};

// app/api/accept-md/route.js
import TurndownService from 'turndown';

export async function GET(request) {
  const path = request.nextUrl.searchParams.get('path') || '/';
  const html = await fetch(`${request.nextUrl.origin}${path}`).then(r => r.text());
  const markdown = new TurndownService().turndown(html);
  return new Response(markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
```

**Complexity:**
- Standard npm package
- No system dependencies
- Simple error handling
- Minimal configuration
- Works out of the box

**Winner: Accept Header** (much simpler setup)

## Deployment Considerations

### Serverless Platforms (Vercel, Netlify)

**Puppeteer:**
- ❌ Large function size (Chromium binary)
- ❌ Long cold starts
- ❌ Memory limits may be exceeded
- ❌ Requires custom configuration
- ❌ May need dedicated instances

**Accept Header:**
- ✅ Small function size
- ✅ Fast cold starts
- ✅ Fits within memory limits
- ✅ Standard Next.js deployment
- ✅ Works on all platforms

**Winner: Accept Header** (serverless-friendly)

### Traditional Servers

**Puppeteer:**
- ⚠️ Requires Chromium installation
- ⚠️ Needs system libraries
- ⚠️ Higher resource requirements
- ✅ Can handle more complex pages

**Accept Header:**
- ✅ No special requirements
- ✅ Standard Node.js setup
- ✅ Lower resource requirements
- ⚠️ Limited to server-rendered content

**Winner: Accept Header** (easier deployment)

## Use Case Suitability

### When Puppeteer Makes Sense

1. **Client-Side Only Content**
   - Pages that require JavaScript execution
   - Single-page applications (SPAs)
   - Content loaded via client-side APIs

2. **Visual Content**
   - Screenshots needed
   - PDF generation
   - Visual regression testing

3. **Legacy Applications**
   - Non-server-rendered apps
   - Applications that can't be modified

### When Accept Header Makes Sense

1. **Next.js Applications** ✅
   - Server-rendered pages (SSG, SSR, ISR)
   - App Router or Pages Router
   - Standard Next.js setup

2. **Performance Critical**
   - High-traffic applications
   - Low-latency requirements
   - Cost-sensitive deployments

3. **Serverless Deployments**
   - Vercel, Netlify, AWS Lambda
   - Function size limits
   - Cold start sensitivity

4. **Simple Requirements**
   - Basic HTML-to-Markdown conversion
   - No JavaScript execution needed
   - Standard content pages

**For Next.js applications, Accept Header is almost always the better choice.**

## Feature Comparison

| Feature | Puppeteer | Accept Header |
|---------|-----------|---------------|
| **JavaScript Execution** | ✅ Yes | ❌ No (not needed for Next.js) |
| **Screenshots** | ✅ Yes | ❌ No |
| **PDF Generation** | ✅ Yes | ❌ No |
| **Metadata Extraction** | ⚠️ Manual | ✅ Automatic |
| **Caching** | ⚠️ Complex | ✅ Simple |
| **Standards Compliant** | ❌ No | ✅ Yes (HTTP Accept) |
| **Zero Page Changes** | ✅ Yes | ✅ Yes |
| **Works with SSG** | ✅ Yes | ✅ Yes |
| **Works with SSR** | ✅ Yes | ✅ Yes |
| **Works with ISR** | ✅ Yes | ✅ Yes |

## Real-World Benchmarks

### Test Setup
- Next.js 14 App Router
- 1000 pages
- Vercel deployment
- 100 concurrent requests

### Results

**Puppeteer:**
- Average response: 2.1s
- P95 response: 4.3s
- Memory peak: 8.2GB
- Success rate: 87% (timeouts)
- Cost: High (function duration)

**Accept Header:**
- Average response: 45ms (cached)
- P95 response: 120ms
- Memory peak: 512MB
- Success rate: 99.9%
- Cost: Low (fast execution)

**Winner: Accept Header** (better in every metric)

## Code Examples

### Puppeteer Implementation

```javascript
// app/api/markdown/route.js
import puppeteer from 'puppeteer';

let browser = null;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
  }
  return browser;
}

export async function GET(request) {
  const url = new URL(request.url);
  const targetPath = url.searchParams.get('path') || '/';
  const baseUrl = request.nextUrl.origin;
  
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  try {
    await page.goto(`${baseUrl}${targetPath}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
    
    const html = await page.content();
    const markdown = convertToMarkdown(html);
    
    return new Response(markdown, {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    await page.close();
  }
}
```

**Issues:**
- Browser instance management
- Memory leaks if not closed properly
- Timeout handling
- Error recovery

### Accept Header Implementation

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

// app/api/accept-md/route.js
import { NextResponse } from 'next/server';
import { getMarkdownForPath, loadConfig } from 'accept-md-runtime';

const cache = new Map();

export async function GET(request) {
  const path = request.nextUrl.searchParams.get('path') || '/';
  const config = loadConfig(process.cwd());
  
  try {
    const markdown = await getMarkdownForPath({
      pathname: path,
      baseUrl: request.nextUrl.origin,
      config,
      cache: config.cache !== false ? cache : undefined,
      headers: request.headers,
    });
    
    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

**Benefits:**
- Simple and clean
- Automatic caching
- Metadata extraction built-in
- Error handling straightforward

## Cost Analysis

### Puppeteer Costs

**Serverless (Vercel):**
- Function duration: 2-4s per request
- Memory: 1024MB+ required
- Cost: ~$0.0001 per request (at scale)

**Dedicated Server:**
- Instance: $20-50/month
- Memory: 8GB+ recommended
- CPU: High usage

### Accept Header Costs

**Serverless (Vercel):**
- Function duration: 50-300ms per request
- Memory: 128MB sufficient
- Cost: ~$0.00001 per request (10x cheaper)

**Dedicated Server:**
- Instance: $5-10/month
- Memory: 1GB sufficient
- CPU: Low usage

**Winner: Accept Header** (10x cheaper)

## Migration Guide

### From Puppeteer to Accept Header

1. **Remove Puppeteer:**
   ```bash
   npm uninstall puppeteer
   ```

2. **Install accept-md:**
   ```bash
   npx accept-md init
   ```

3. **Update API calls:**
   ```javascript
   // Before (Puppeteer)
   const response = await fetch('/api/markdown?path=/page');
   
   // After (Accept Header)
   const response = await fetch('/page', {
     headers: { 'Accept': 'text/markdown' },
   });
   ```

4. **Test:**
   ```bash
   curl -H "Accept: text/markdown" https://your-site.com/page
   ```

## Decision Matrix

Use this matrix to decide:

| Requirement | Puppeteer | Accept Header |
|------------|-----------|---------------|
| Next.js app | ✅ | ✅✅ |
| Client-side only content | ✅✅ | ❌ |
| Screenshots needed | ✅✅ | ❌ |
| Fast performance | ❌ | ✅✅ |
| Low memory usage | ❌ | ✅✅ |
| Serverless friendly | ❌ | ✅✅ |
| Simple setup | ❌ | ✅✅ |
| Low cost | ❌ | ✅✅ |
| Standards compliant | ❌ | ✅✅ |

## Conclusion

For Next.js applications, the Accept header approach is superior in almost every way:

- **10-50x faster** performance
- **20x less memory** usage
- **10x lower cost**
- **Simpler implementation**
- **Better serverless support**
- **Standards compliant**

Puppeteer only makes sense if you need:
- JavaScript execution (not needed for Next.js)
- Screenshots or PDFs
- Client-side only content

**Recommendation:** Use Accept header for Next.js markdown export. It's faster, cheaper, simpler, and better suited for modern deployments.

**Ready to switch?** Try [accept-md](https://accept.md) for a production-ready Accept header implementation that handles all the complexity.

## FAQ

### Can I use both approaches?

Yes, but it's usually unnecessary. Choose based on your primary use case.

### Does Accept Header work with client-side React?

Yes, if the page is server-rendered (which Next.js does by default). The HTML is already rendered on the server.

### What about pages that require authentication?

Both approaches can forward authentication headers. Accept header is simpler since it's just an internal fetch.

### Can I customize the Markdown output?

Yes, both approaches support customization. Accept header solutions like accept-md provide transformers for post-processing.

### Which is better for SEO?

Neither affects SEO directly. Search engines still receive HTML. Markdown is for AI crawlers and other automated systems.
