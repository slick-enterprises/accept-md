/**
 * Route types and metadata for framework route detection.
 * Currently supports Next.js (App Router, Pages Router).
 */

export type RouterType = 'app' | 'pages';

/**
 * High-level framework classification for a detected project.
 *
 * - 'next-app'   → Next.js project using the App Router
 * - 'next-pages' → Next.js project using the Pages Router
 * - 'sveltekit'  → SvelteKit project (file-based routes in routes/ or src/routes/)
 */
export type FrameworkType = 'next-app' | 'next-pages' | 'sveltekit';

export type RouteSegmentType =
  | 'page'
  | 'layout'
  | 'loading'
  | 'error'
  | 'not-found'
  | 'template'
  | 'default'
  | 'route'; // API route handler

export type DynamicSegmentType = 'dynamic' | 'catch-all' | 'optional-catch-all';

export interface RouteSegment {
  /** File name without extension, e.g. page, layout, [id] */
  name: string;
  type: RouteSegmentType;
  /** For [id], [...slug], [[...slug]] */
  dynamicType?: DynamicSegmentType;
  /** Full path relative to app/ or pages/ */
  relativePath: string;
}

export interface ParsedRoute {
  /** URL path pattern, e.g. /posts/[id], /blog/[...slug] */
  path: string;
  /** Whether this is a dynamic route */
  isDynamic: boolean;
  segments: RouteSegment[];
  /** app or pages */
  router: RouterType;
  /** Relative file path from project root */
  sourcePath: string;
  /** Parallel route group, e.g. @modal */
  parallelRoute?: string;
  /** Intercepting route, e.g. (.)(..) */
  intercepting?: string;
}

export interface NextMarkdownConfig {
  /** Glob patterns for routes to include (default: ['/**']) */
  include?: string[];
  /** Glob patterns to exclude (default: ['/api/**', '/_next/**']) */
  exclude?: string[];
  /** CSS selectors to remove before converting to markdown */
  cleanSelectors?: string[];
  /** Output format (default: 'markdown') */
  outputMode?: 'markdown';
  /** Enable response caching (default: true) */
  cache?: boolean;
  /** Custom transform functions (markdown string -> markdown string) */
  transformers?: Array<(md: string) => string>;
  /** Base URL for internal fetch (default: from request) */
  baseUrl?: string;
  /** Debug logging */
  debug?: boolean;
}

export interface ProjectDetection {
  /**
   * High-level framework classification for this project.
   * For backward compatibility, this is optional; older callers can continue
   * to use the more specific flags (isNext, routerType, isSvelteKit, etc).
   */
  framework?: FrameworkType;

  /**
   * Next.js-specific detection.
   */
  isNext: boolean;
  routerType: RouterType | null;
  hasAppDir: boolean;
  hasPagesDir: boolean;
  /** Relative path to app directory, e.g. 'app' or 'src/app' */
  appDir: string | null;
  /** Relative path to pages directory, e.g. 'pages' or 'src/pages' */
  pagesDir: string | null;
  nextVersion?: string;
  middlewarePath: string | null;
  configPath: string | null;
  /** If in a monorepo: path to a subdirectory whose package.json has "next" (e.g. "apps/web") */
  nextAppPath?: string;

  /**
   * SvelteKit-specific detection.
   *
   * These fields are additive and do not affect existing Next.js behavior.
   */
  /** Whether the current project looks like a SvelteKit app (has @sveltejs/kit and routes directory). */
  isSvelteKit?: boolean;
  /** Relative path to the SvelteKit routes directory, e.g. 'src/routes' or 'routes'. */
  svelteKitRoutesDir?: string | null;
  /** Optional path to svelte.config.js/ts if present. */
  svelteConfigPath?: string | null;

  /** Whether the project uses TypeScript (tsconfig.json present); used to generate .ts or .js handler */
  hasTypeScript?: boolean;
  /** Whether next.config has accept-md rewrite configuration (preferred over middleware) */
  hasRewriteConfig?: boolean;
}

export interface DoctorReport {
  detected: ProjectDetection;
  routes: ParsedRoute[];
  conflicts: string[];
  issues: string[];
  suggestions: string[];
}
