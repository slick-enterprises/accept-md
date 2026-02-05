/**
 * Config type used at runtime by the handler (avoids pulling in full core).
 */

export interface NextMarkdownConfig {
  include?: string[];
  exclude?: string[];
  cleanSelectors?: string[];
  outputMode?: 'markdown';
  cache?: boolean;
  transformers?: Array<(md: string) => string>;
  baseUrl?: string;
  debug?: boolean;
}
