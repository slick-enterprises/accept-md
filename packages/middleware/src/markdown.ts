/**
 * HTML to Markdown conversion using Turndown with cleanup and optional linkedom for Node.
 */

import TurndownService from 'turndown';
import { parseHTML } from 'linkedom';

export interface MarkdownOptions {
  cleanSelectors?: string[];
  headingStyle?: 'setext' | 'atx';
  codeBlockStyle?: 'indented' | 'fenced';
  /** Custom transformers applied after conversion (md -> md) */
  transformers?: Array<(md: string) => string>;
  /** Include YAML frontmatter with extracted meta tags (default: true) */
  includeFrontmatter?: boolean;
  /** Enable debug mode to include size information in output (default: false) */
  debug?: boolean;
  /** HTML size in bytes (for debug mode). If not provided, will be calculated. */
  htmlSize?: number;
}

/**
 * Metadata extracted from HTML meta tags.
 */
interface ExtractedMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  canonical?: string;
  language?: string;
  og_title?: string;
  og_description?: string;
  og_type?: string;
  og_url?: string;
  og_image?: string;
  og_site_name?: string;
  og_locale?: string;
  article_author?: string;
  article_published_time?: string;
  article_modified_time?: string;
  article_section?: string;
  article_tag?: string[];
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  twitter_creator?: string;
  twitter_site?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
}

/**
 * Extract meta tags and JSON-LD scripts from HTML in a single pass for performance.
 * Returns both metadata and JSON-LD scripts.
 */
function extractMetadataAndJsonLd(html: string): {
  metadata: ExtractedMetadata;
  jsonLdScripts: string[];
} {
  const { document } = parseHTML(html);
  const metadata: ExtractedMetadata = {};
  const jsonLdScripts: string[] = [];

  // Extract title
  const titleEl = document.querySelector('title');
  if (titleEl?.textContent) {
    metadata.title = titleEl.textContent.trim();
  }

  // Extract language from html lang attribute
  const htmlEl = document.documentElement;
  const lang = htmlEl.getAttribute('lang');
  if (lang) {
    metadata.language = lang;
  } else {
    metadata.language = 'en'; // fallback
  }

  // Extract canonical link
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    const href = canonicalLink.getAttribute('href');
    if (href) {
      metadata.canonical = href;
    }
  }

  // Extract JSON-LD scripts
  document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    const content = script.textContent?.trim();
    if (content) {
      try {
        const parsed = JSON.parse(content);
        jsonLdScripts.push(JSON.stringify(parsed, null, 2));
      } catch {
        // Invalid JSON, skip it
      }
    }
  });

  // Extract all meta tags
  document.querySelectorAll('meta').forEach((meta) => {
    const name = meta.getAttribute('name');
    const property = meta.getAttribute('property');
    const content = meta.getAttribute('content');

    if (!content) return;

    // Basic meta tags (name attribute)
    if (name) {
      const nameLower = name.toLowerCase();
      switch (nameLower) {
        case 'description':
          metadata.description = content;
          break;
        case 'keywords':
          // Split comma-separated keywords into array
          metadata.keywords = content.split(',').map((k) => k.trim()).filter(Boolean);
          break;
        case 'author':
          metadata.author = content;
          break;
        case 'robots': {
          // Parse robots directive (e.g., "index, follow" or "noindex, nofollow")
          const robots = content.toLowerCase();
          metadata.robots_index = !robots.includes('noindex');
          metadata.robots_follow = !robots.includes('nofollow');
          break;
        }
        default:
          // Twitter card meta tags
          if (name.startsWith('twitter:')) {
            const field = name.replace('twitter:', '');
            switch (field) {
              case 'card':
                metadata.twitter_card = content;
                break;
              case 'title':
                metadata.twitter_title = content;
                break;
              case 'description':
                metadata.twitter_description = content;
                break;
              case 'image':
                metadata.twitter_image = content;
                break;
              case 'creator':
                metadata.twitter_creator = content;
                break;
              case 'site':
                metadata.twitter_site = content;
                break;
            }
          }
          break;
      }
    }

    // OpenGraph meta tags (property attribute)
    if (property && property.startsWith('og:')) {
      const field = property.replace('og:', '');
      switch (field) {
        case 'title':
          metadata.og_title = content;
          break;
        case 'description':
          metadata.og_description = content;
          break;
        case 'type':
          metadata.og_type = content;
          break;
        case 'url':
          metadata.og_url = content;
          break;
        case 'image':
          metadata.og_image = content;
          break;
        case 'site_name':
          metadata.og_site_name = content;
          break;
        case 'locale':
          metadata.og_locale = content;
          break;
      }
    }

    // Article meta tags (property attribute)
    if (property && property.startsWith('article:')) {
      const field = property.replace('article:', 'article_');
      switch (field) {
        case 'article_author':
          metadata.article_author = content;
          break;
        case 'article_published_time':
          metadata.article_published_time = content;
          break;
        case 'article_modified_time':
          metadata.article_modified_time = content;
          break;
        case 'article_section':
          metadata.article_section = content;
          break;
        case 'article_tag':
          // Article tags can be multiple, collect them
          if (!metadata.article_tag) {
            metadata.article_tag = [];
          }
          metadata.article_tag.push(content);
          break;
      }
    }
  });

  return { metadata, jsonLdScripts };
}

/**
 * Escape a string for YAML by quoting it.
 */
function escapeYamlString(value: string): string {
  // Always quote strings for consistency and to handle special characters
  // Escape backslashes and quotes for YAML
  const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${escaped}"`;
}

/**
 * Format metadata as YAML frontmatter.
 */
function formatYamlFrontmatter(metadata: ExtractedMetadata): string {
  const lines: string[] = ['---'];

  // Helper to add a line if value exists
  const addLine = (key: string, value: string | string[] | boolean | undefined) => {
    if (value === undefined || value === null) return;
    
    if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        lines.push(`${key}:`);
        for (const item of value) {
          lines.push(`  - ${escapeYamlString(String(item))}`);
        }
      }
    } else if (typeof value === 'string' && value.trim() !== '') {
      lines.push(`${key}: ${escapeYamlString(value)}`);
    }
  };

  // Add fields in a logical order
  addLine('title', metadata.title);
  addLine('description', metadata.description);
  addLine('keywords', metadata.keywords);
  addLine('author', metadata.author);
  addLine('canonical', metadata.canonical);
  addLine('language', metadata.language);
  
  // OpenGraph
  addLine('og_title', metadata.og_title);
  addLine('og_description', metadata.og_description);
  addLine('og_type', metadata.og_type);
  addLine('og_url', metadata.og_url);
  addLine('og_image', metadata.og_image);
  addLine('og_site_name', metadata.og_site_name);
  addLine('og_locale', metadata.og_locale);
  
  // Article
  addLine('article_author', metadata.article_author);
  addLine('article_published_time', metadata.article_published_time);
  addLine('article_modified_time', metadata.article_modified_time);
  addLine('article_section', metadata.article_section);
  addLine('article_tag', metadata.article_tag);
  
  // Twitter
  addLine('twitter_card', metadata.twitter_card);
  addLine('twitter_title', metadata.twitter_title);
  addLine('twitter_description', metadata.twitter_description);
  addLine('twitter_image', metadata.twitter_image);
  addLine('twitter_creator', metadata.twitter_creator);
  addLine('twitter_site', metadata.twitter_site);
  
  // Robots
  addLine('robots_index', metadata.robots_index);
  addLine('robots_follow', metadata.robots_follow);

  lines.push('---');
  return lines.join('\n') + '\n\n';
}


/**
 * Parse HTML in Node (linkedom) and optionally remove nodes by selector before conversion.
 */
function cleanHtml(html: string, selectors: string[]): string {
  const { document } = parseHTML(html);
  for (const sel of selectors) {
    try {
      document.querySelectorAll(sel).forEach((el) => el.remove());
    } catch {
      // invalid selector, skip
    }
  }
  return document.documentElement.outerHTML;
}

/**
 * Convert HTML to Markdown. Preserves headings, images, links, tables; strips scripts/styles.
 * Extracts and includes meta tags as YAML frontmatter and JSON-LD structured data as formatted JSON code blocks.
 *
 * @param html - The HTML string to convert to Markdown
 * @param options - Conversion options
 * @returns The converted Markdown string with optional YAML frontmatter
 *
 * @example
 * ```typescript
 * const html = `
 *   <html lang="en">
 *     <head>
 *       <title>My Page</title>
 *       <meta name="description" content="Page description" />
 *       <meta property="og:title" content="OG Title" />
 *     </head>
 *     <body><h1>Content</h1></body>
 *   </html>
 * `;
 * const markdown = htmlToMarkdown(html);
 * // Returns:
 * // ---
 * // title: "My Page"
 * // description: "Page description"
 * // language: "en"
 * // og_title: "OG Title"
 * // ---
 * //
 * // # Content
 * ```
 *
 * @example
 * ```typescript
 * // Disable frontmatter
 * const markdown = htmlToMarkdown(html, { includeFrontmatter: false });
 * // Returns just the markdown content without frontmatter
 * ```
 */
/**
 * Calculate byte size of a string (UTF-8 encoding).
 */
function getByteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

export function htmlToMarkdown(html: string, options: MarkdownOptions = {}): string {
  const {
    cleanSelectors = ['nav', 'footer', '.no-markdown', '[data-no-markdown]', 'script', 'style'],
    headingStyle = 'atx',
    codeBlockStyle = 'fenced',
    transformers = [],
    includeFrontmatter = true,
    debug = false,
    htmlSize,
  } = options;

  // Single-pass extraction: get both metadata and JSON-LD scripts in one parse
  const { metadata, jsonLdScripts } = extractMetadataAndJsonLd(html);

  const cleaned = cleanHtml(html, cleanSelectors);
  const service = new TurndownService({
    headingStyle,
    codeBlockStyle,
    bulletListMarker: '-',
    linkStyle: 'inlined',
  });

  // Tables and default rules are fine; explicitly drop scripts/styles if still present
  service.remove(['script', 'style', 'noscript']);

  let md = service.turndown(cleaned);
  for (const fn of transformers) {
    md = fn(md);
  }

  // Prepend YAML frontmatter if enabled and we have any metadata
  let result = '';
  if (includeFrontmatter) {
    const hasMetadata = Object.keys(metadata).some((key) => {
      const value = metadata[key as keyof ExtractedMetadata];
      return value !== undefined && value !== null && value !== '';
    });

    if (hasMetadata) {
      result = formatYamlFrontmatter(metadata);
    }
  }
  result += md;

  // Add debug comment with size information if debug mode is enabled
  if (debug) {
    const htmlBytes = htmlSize ?? getByteSize(html);
    const markdownBytes = getByteSize(result);
    const reduction = htmlBytes > 0 ? Math.round(((htmlBytes - markdownBytes) / htmlBytes) * 100) : 0;
    const debugComment = `<!-- accept-md: html_size=${htmlBytes} bytes, markdown_size=${markdownBytes} bytes, reduction=${reduction}% -->\n\n`;
    result = debugComment + result;
  }

  // Append JSON-LD structured data as code blocks
  if (jsonLdScripts.length > 0) {
    result += '\n\n## Structured Data (JSON-LD)\n\n';
    for (const jsonLd of jsonLdScripts) {
      result += '```json\n' + jsonLd + '\n```\n\n';
    }
  }

  return result.trim();
}
