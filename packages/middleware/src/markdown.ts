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
 */
export function htmlToMarkdown(html: string, options: MarkdownOptions = {}): string {
  const {
    cleanSelectors = ['nav', 'footer', '.no-markdown', '[data-no-markdown]', 'script', 'style'],
    headingStyle = 'atx',
    codeBlockStyle = 'fenced',
    transformers = [],
  } = options;

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
  return md.trim();
}
