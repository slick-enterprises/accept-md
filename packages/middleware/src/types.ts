/**
 * Config type used at runtime by the handler (avoids pulling in full core).
 */

export interface NextMarkdownConfig {
  include?: string[];
  exclude?: string[];
  cleanSelectors?: string[];
  outputMode?: 'markdown';
  cache?: boolean;
  /**
   * Maximum number of entries the in-memory cache may hold.
   * Prevents unbounded growth on long-running servers that see many distinct
   * paths. When exceeded, the oldest entry (insertion order) is evicted.
   * Default: 1000.
   */
  maxCacheEntries?: number;
  /**
   * Timeout (ms) for the internal fetch of the upstream HTML page.
   * Prevents a slow upstream from hanging the markdown response indefinitely.
   * Set to 0 to disable. Default: 10000.
   */
  fetchTimeoutMs?: number;
  transformers?: Array<(md: string) => string>;
  baseUrl?: string;
  debug?: boolean;
}
