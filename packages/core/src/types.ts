/**
 * Route types and metadata for Next.js route detection.
 */

export type RouterType = 'app' | 'pages';

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
  /** Whether the project uses TypeScript (tsconfig.json present); used to generate .ts or .js handler */
  hasTypeScript?: boolean;
}

export interface DoctorReport {
  detected: ProjectDetection;
  routes: ParsedRoute[];
  conflicts: string[];
  issues: string[];
  suggestions: string[];
}
