/**
 * HTML to Markdown conversion tests and internal fetch behavior.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { htmlToMarkdown } from './markdown.js';
import { getMarkdownForPath, type CacheEntry } from './handler.js';
import type { GetMarkdownOptions } from './handler.js';

describe('htmlToMarkdown', () => {
  it('converts headings', () => {
    const html = '<html><body><h1>Title</h1><h2>Sub</h2></body></html>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('Title');
    expect(md).toContain('Sub');
  });

  it('converts links', () => {
    const html = '<p><a href="/about">About</a></p>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('[About](/about)');
  });

  it('converts images', () => {
    const html = '<p><img src="/img.png" alt="Image" /></p>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('![Image](/img.png)');
  });

  it('removes elements by selector', () => {
    const html = '<nav>Skip</nav><main><p>Keep</p></main>';
    const md = htmlToMarkdown(html, { cleanSelectors: ['nav'] });
    expect(md).not.toContain('Skip');
    expect(md).toContain('Keep');
  });

  it('applies transformers', () => {
    const html = '<p>Hello</p>';
    const md = htmlToMarkdown(html, {
      transformers: [(s) => s.replace('Hello', 'Hi')],
    });
    expect(md).toContain('Hi');
  });

  it('extracts and includes JSON-LD structured data', () => {
    const html = `
      <html>
        <head>
          <script type="application/ld+json">
            {"@context":"https://schema.org","@type":"Article","name":"Test Article"}
          </script>
        </head>
        <body>
          <h1>Article Title</h1>
          <p>Content here</p>
        </body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('Article Title');
    expect(md).toContain('Content here');
    expect(md).toContain('## Structured Data (JSON-LD)');
    expect(md).toContain('```json');
    expect(md).toContain('"@context"');
    expect(md).toContain('"@type": "Article"');
    expect(md).toContain('"name": "Test Article"');
  });

  it('handles multiple JSON-LD scripts', () => {
    const html = `
      <html>
        <head>
          <script type="application/ld+json">{"@type":"Organization","name":"Company"}</script>
          <script type="application/ld+json">{"@type":"Article","headline":"News"}</script>
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('## Structured Data (JSON-LD)');
    expect(md).toContain('"@type": "Organization"');
    expect(md).toContain('"@type": "Article"');
    // Should have two JSON code blocks
    const jsonBlocks = md.match(/```json/g);
    expect(jsonBlocks).toHaveLength(2);
  });

  it('skips invalid JSON-LD scripts', () => {
    const html = `
      <html>
        <head>
          <script type="application/ld+json">{"@type":"Valid"}</script>
          <script type="application/ld+json">invalid json {</script>
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('"@type": "Valid"');
    expect(md).not.toContain('invalid json');
  });

  it('ignores non-JSON-LD scripts', () => {
    const html = `
      <html>
        <head>
          <script>console.log("regular script");</script>
          <script type="application/ld+json">{"@type":"Article"}</script>
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('"@type": "Article"');
    expect(md).not.toContain('console.log');
  });

  it('extracts basic meta tags to YAML frontmatter', () => {
    const html = `
      <html lang="en">
        <head>
          <title>Test Page Title</title>
          <meta name="description" content="Test description" />
          <meta name="keywords" content="test, keywords, example" />
          <meta name="author" content="Test Author" />
          <link rel="canonical" href="https://example.com/page" />
        </head>
        <body>
          <h1>Content</h1>
        </body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('---');
    expect(md).toContain('title: "Test Page Title"');
    expect(md).toContain('description: "Test description"');
    expect(md).toContain('author: "Test Author"');
    expect(md).toContain('canonical: "https://example.com/page"');
    expect(md).toContain('language: "en"');
    expect(md).toContain('keywords:');
    expect(md).toContain('- "test"');
    expect(md).toContain('- "keywords"');
    expect(md).toContain('- "example"');
    expect(md).toContain('# Content');
  });

  it('extracts OpenGraph metadata', () => {
    const html = `
      <html>
        <head>
          <title>Page Title</title>
          <meta property="og:title" content="OG Title" />
          <meta property="og:description" content="OG Description" />
          <meta property="og:type" content="article" />
          <meta property="og:url" content="https://example.com/page" />
          <meta property="og:image" content="https://example.com/image.jpg" />
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('og_title: "OG Title"');
    expect(md).toContain('og_description: "OG Description"');
    expect(md).toContain('og_type: "article"');
    expect(md).toContain('og_url: "https://example.com/page"');
    expect(md).toContain('og_image: "https://example.com/image.jpg"');
  });

  it('extracts Twitter card metadata', () => {
    const html = `
      <html>
        <head>
          <title>Page Title</title>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Twitter Title" />
          <meta name="twitter:description" content="Twitter Description" />
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('twitter_card: "summary_large_image"');
    expect(md).toContain('twitter_title: "Twitter Title"');
    expect(md).toContain('twitter_description: "Twitter Description"');
  });

  it('extracts canonical link', () => {
    const html = `
      <html>
        <head>
          <title>Page</title>
          <link rel="canonical" href="https://example.com/canonical" />
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('canonical: "https://example.com/canonical"');
  });

  it('extracts language from html lang attribute', () => {
    const html = `
      <html lang="fr">
        <head><title>Page</title></head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('language: "fr"');
  });

  it('defaults to en if language not specified', () => {
    const html = `
      <html>
        <head><title>Page</title></head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('language: "en"');
  });

  it('parses robots meta tag', () => {
    const html = `
      <html>
        <head>
          <title>Page</title>
          <meta name="robots" content="index, follow" />
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('robots_index: true');
    expect(md).toContain('robots_follow: true');
  });

  it('parses robots noindex/nofollow', () => {
    const html = `
      <html>
        <head>
          <title>Page</title>
          <meta name="robots" content="noindex, nofollow" />
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('robots_index: false');
    expect(md).toContain('robots_follow: false');
  });

  it('handles keywords as comma-separated string', () => {
    const html = `
      <html>
        <head>
          <title>Page</title>
          <meta name="keywords" content="tag1, tag2, tag3" />
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('keywords:');
    expect(md).toContain('- "tag1"');
    expect(md).toContain('- "tag2"');
    expect(md).toContain('- "tag3"');
  });

  it('omits empty or missing meta tags from frontmatter', () => {
    const html = `
      <html>
        <head>
          <title>Page</title>
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('title: "Page"');
    expect(md).not.toContain('description:');
    expect(md).not.toContain('og_title:');
  });

  it('escapes special characters in YAML strings', () => {
    const html = `
      <html>
        <head>
          <title>Title: With Colon & Special Chars</title>
          <meta name="description" content="Description with: colon, # hash, and other chars" />
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('title: "Title: With Colon & Special Chars"');
    expect(md).toContain('description: "Description with: colon, # hash, and other chars"');
  });

  it('combines frontmatter, content, and JSON-LD', () => {
    const html = `
      <html lang="en">
        <head>
          <title>Test Page</title>
          <meta name="description" content="Test description" />
          <script type="application/ld+json">
            {"@type":"Article","name":"Test"}
          </script>
        </head>
        <body>
          <h1>Main Content</h1>
          <p>Body text</p>
        </body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    // Should have frontmatter at the top
    expect(md.startsWith('---')).toBe(true);
    expect(md).toContain('title: "Test Page"');
    expect(md).toContain('description: "Test description"');
    // Should have content
    expect(md).toContain('# Main Content');
    expect(md).toContain('Body text');
    // Should have JSON-LD at the end
    expect(md).toContain('## Structured Data (JSON-LD)');
    expect(md).toContain('"@type": "Article"');
  });

  it('handles HTML without meta tags gracefully', () => {
    const html = '<html><body><h1>Content</h1></body></html>';
    const md = htmlToMarkdown(html);
    // Should still work, just without frontmatter
    expect(md).toContain('# Content');
    // Should have language default
    expect(md).toContain('language: "en"');
  });

  it('extracts additional OpenGraph meta tags', () => {
    const html = `
      <html>
        <head>
          <title>Page</title>
          <meta property="og:site_name" content="My Site" />
          <meta property="og:locale" content="en_US" />
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('og_site_name: "My Site"');
    expect(md).toContain('og_locale: "en_US"');
  });

  it('extracts article meta tags', () => {
    const html = `
      <html>
        <head>
          <title>Article</title>
          <meta property="article:author" content="John Doe" />
          <meta property="article:published_time" content="2024-01-01T00:00:00Z" />
          <meta property="article:modified_time" content="2024-01-02T00:00:00Z" />
          <meta property="article:section" content="Technology" />
          <meta property="article:tag" content="web" />
          <meta property="article:tag" content="development" />
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('article_author: "John Doe"');
    expect(md).toContain('article_published_time: "2024-01-01T00:00:00Z"');
    expect(md).toContain('article_modified_time: "2024-01-02T00:00:00Z"');
    expect(md).toContain('article_section: "Technology"');
    expect(md).toContain('article_tag:');
    expect(md).toContain('- "web"');
    expect(md).toContain('- "development"');
  });

  it('extracts additional Twitter meta tags', () => {
    const html = `
      <html>
        <head>
          <title>Page</title>
          <meta name="twitter:image" content="https://example.com/image.jpg" />
          <meta name="twitter:creator" content="@johndoe" />
          <meta name="twitter:site" content="@mysite" />
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html);
    expect(md).toContain('twitter_image: "https://example.com/image.jpg"');
    expect(md).toContain('twitter_creator: "@johndoe"');
    expect(md).toContain('twitter_site: "@mysite"');
  });

  it('allows opting out of frontmatter', () => {
    const html = `
      <html>
        <head>
          <title>Page</title>
          <meta name="description" content="Description" />
        </head>
        <body><h1>Content</h1></body>
      </html>
    `;
    const md = htmlToMarkdown(html, { includeFrontmatter: false });
    expect(md).not.toContain('---');
    expect(md).not.toContain('title:');
    expect(md).toContain('# Content');
  });

  it('still extracts JSON-LD when frontmatter is disabled', () => {
    const html = `
      <html>
        <head>
          <title>Page</title>
          <script type="application/ld+json">
            {"@type":"Article","name":"Test"}
          </script>
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    const md = htmlToMarkdown(html, { includeFrontmatter: false });
    expect(md).not.toContain('---');
    expect(md).toContain('## Structured Data (JSON-LD)');
    expect(md).toContain('"@type": "Article"');
  });

  it('includes size diff comment when debug is enabled', () => {
    const html = '<html><head><title>Test</title></head><body><h1>Content</h1><p>Some text here</p></body></html>';
    const md = htmlToMarkdown(html, { debug: true });
    expect(md).toContain('<!-- accept-md:');
    expect(md).toContain('html_size=');
    expect(md).toContain('markdown_size=');
    expect(md).toContain('reduction=');
    expect(md).toContain('bytes');
    expect(md).toContain('%');
  });

  it('does not include size diff comment when debug is disabled', () => {
    const html = '<html><head><title>Test</title></head><body><h1>Content</h1></body></html>';
    const md = htmlToMarkdown(html, { debug: false });
    expect(md).not.toContain('<!-- accept-md:');
  });

  it('does not include size diff comment when debug is undefined', () => {
    const html = '<html><head><title>Test</title></head><body><h1>Content</h1></body></html>';
    const md = htmlToMarkdown(html);
    expect(md).not.toContain('<!-- accept-md:');
  });

  it('calculates size reduction correctly', () => {
    const html = '<html><head><title>Test</title></head><body><h1>Content</h1><p>Some text</p></body></html>';
    const md = htmlToMarkdown(html, { debug: true });
    const match = md.match(/html_size=(\d+) bytes, markdown_size=(\d+) bytes, reduction=(\d+)%/);
    expect(match).toBeTruthy();
    if (match) {
      const htmlSize = parseInt(match[1], 10);
      const markdownSize = parseInt(match[2], 10);
      const reduction = parseInt(match[3], 10);
      expect(htmlSize).toBeGreaterThan(0);
      expect(markdownSize).toBeGreaterThan(0);
      expect(reduction).toBeGreaterThanOrEqual(0);
      expect(reduction).toBeLessThanOrEqual(100);
      // Markdown should generally be smaller than HTML
      expect(markdownSize).toBeLessThanOrEqual(htmlSize);
    }
  });
});

describe('getMarkdownForPath internal fetch', () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = process.env.VERCEL_URL;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.VERCEL_URL = originalEnv;
  });

  it('uses primary origin when request succeeds', async () => {
    const fetchMock = vi.fn(async (url: RequestInfo | URL) => {
      const u = typeof url === 'string' ? url : url.toString();
      expect(u).toBe('https://example.com/blog');
      return new Response('<html><body><h1>Blog</h1></body></html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    process.env.VERCEL_URL = 'example-deployment.vercel.app';

    const options: GetMarkdownOptions = {
      pathname: '/blog',
      baseUrl: 'https://example.com',
      config: { include: ['**'], cache: false },
      cache: undefined,
      headers: { 'X-Test': '1' },
    };

    const md = await getMarkdownForPath(options);

    expect(md).toContain('Blog');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('falls back to VERCEL_URL when primary origin fails', async () => {
    const calls: string[] = [];
    const fetchMock = vi.fn(async (url: RequestInfo | URL) => {
      const u = typeof url === 'string' ? url : url.toString();
      calls.push(u);
      if (u.startsWith('https://example.com')) {
        return new Response('Unauthorized', { status: 401 });
      }
      if (u.startsWith('https://example-deployment.vercel.app')) {
        return new Response('<html><body><h1>OK</h1></body></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        });
      }
      return new Response('Not found', { status: 404 });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    process.env.VERCEL_URL = 'https://example-deployment.vercel.app';

    const options: GetMarkdownOptions = {
      pathname: '/',
      baseUrl: 'https://example.com',
      config: { include: ['**'], cache: false },
      cache: undefined,
      headers: { 'X-Test-Fallback': '1' },
    };

    const md = await getMarkdownForPath(options);

    expect(md).toContain('OK');
    expect(calls).toEqual([
      'https://example.com/',
      'https://example-deployment.vercel.app/',
    ]);
  });

  it('caches markdown with expiration from revalidation header', async () => {
    const cache = new Map<string, CacheEntry>();
    const fetchMock = vi.fn(async () => {
      return new Response('<html><body><h1>Test</h1></body></html>', {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'x-next-revalidate': '3600', // 1 hour
        },
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const options: GetMarkdownOptions = {
      pathname: '/test',
      baseUrl: 'https://example.com',
      config: { include: ['**'], cache: true },
      cache,
    };

    const md1 = await getMarkdownForPath(options);
    expect(md1).toContain('# Test');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Second call should use cache
    const md2 = await getMarkdownForPath(options);
    expect(md2).toContain('# Test');
    expect(fetchMock).toHaveBeenCalledTimes(1); // Still 1, cache hit

    // Verify cache entry has expiration
    const entry = cache.get('/test');
    expect(entry).toBeTruthy();
    expect(entry?.expiresAt).toBeTruthy();
    expect(entry?.expiresAt).toBeGreaterThan(Date.now());
  });

  it('invalidates cache when BUILD_ID changes', async () => {
    const cache = new Map<string, CacheEntry>();
    const originalBuildId = process.env.BUILD_ID;
    
    process.env.BUILD_ID = 'build-1';
    const fetchMock1 = vi.fn(async () => {
      return new Response('<html><body><h1>Test</h1></body></html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    });
    globalThis.fetch = fetchMock1 as unknown as typeof fetch;

    const options: GetMarkdownOptions = {
      pathname: '/test',
      baseUrl: 'https://example.com',
      config: { include: ['**'], cache: true },
      cache,
    };

    await getMarkdownForPath(options);
    expect(fetchMock1).toHaveBeenCalledTimes(1);
    expect(cache.has('/test')).toBe(true);

    // Change BUILD_ID
    process.env.BUILD_ID = 'build-2';
    const fetchMock2 = vi.fn(async () => {
      return new Response('<html><body><h1>Test Updated</h1></body></html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    });
    globalThis.fetch = fetchMock2 as unknown as typeof fetch;

    // Should invalidate and fetch again
    const md = await getMarkdownForPath(options);
    expect(md).toContain('Test Updated');
    expect(fetchMock2).toHaveBeenCalledTimes(1);

    // Restore original BUILD_ID
    if (originalBuildId) {
      process.env.BUILD_ID = originalBuildId;
    } else {
      delete process.env.BUILD_ID;
    }
  });

  it('invalidates cache when expiration time passes', async () => {
    const cache = new Map<string, CacheEntry>();
    const fetchMock = vi.fn(async () => {
      return new Response('<html><body><h1>Test</h1></body></html>', {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'x-next-revalidate': '1', // 1 second
        },
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const options: GetMarkdownOptions = {
      pathname: '/test',
      baseUrl: 'https://example.com',
      config: { include: ['**'], cache: true },
      cache,
    };

    await getMarkdownForPath(options);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Manually set expiration to past
    const entry = cache.get('/test');
    if (entry) {
      entry.expiresAt = Date.now() - 1000; // 1 second ago
      cache.set('/test', entry);
    }

    // Should fetch again after expiration
    await getMarkdownForPath(options);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('extracts revalidation time from Cache-Control header', async () => {
    const cache = new Map<string, CacheEntry>();
    const fetchMock = vi.fn(async () => {
      return new Response('<html><body><h1>Test</h1></body></html>', {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate',
        },
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const options: GetMarkdownOptions = {
      pathname: '/test',
      baseUrl: 'https://example.com',
      config: { include: ['**'], cache: true },
      cache,
    };

    await getMarkdownForPath(options);
    const entry = cache.get('/test');
    expect(entry?.expiresAt).toBeTruthy();
    // Should expire in approximately 7200 seconds (2 hours)
    const expectedExpiry = Date.now() + 7200 * 1000;
    const diff = Math.abs((entry?.expiresAt ?? 0) - expectedExpiry);
    expect(diff).toBeLessThan(1000); // Within 1 second
  });
});

