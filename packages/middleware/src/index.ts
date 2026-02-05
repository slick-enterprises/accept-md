/** accept-md-runtime - HTML→Markdown and route handler for Next.js */
export { htmlToMarkdown } from './markdown.js';
export type { MarkdownOptions } from './markdown.js';
export { getMarkdownForPath } from './handler.js';
export type { GetMarkdownOptions } from './handler.js';
export type { NextMarkdownConfig } from './types.js';
export { loadConfig } from './config.js';
export { MIDDLEWARE_TEMPLATE, APP_ROUTE_HANDLER_TEMPLATE, PAGES_API_HANDLER_TEMPLATE } from './templates.js';
