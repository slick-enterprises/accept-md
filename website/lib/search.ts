import { getAllBlogPosts } from "@/lib/blog";
import { getAllContent, type ContentCollection } from "@/lib/content";

export type SearchSection = ContentCollection | "blog" | "site";

export interface SearchResult {
  title: string;
  description: string;
  url: string;
  section: SearchSection;
  excerpt: string;
  score: number;
}

interface SearchIndexEntry {
  title: string;
  description: string;
  keywords: string[];
  url: string;
  section: SearchSection;
  excerpt: string;
  body: string;
}

const SECTION_LABELS: Record<SearchSection, string> = {
  docs: "Docs",
  learn: "Learn",
  integrations: "Integrations",
  blog: "Blog",
  site: "Site",
};

const STATIC_PAGES: SearchIndexEntry[] = [
  {
    title: "Accept Markdown for Next.js and SvelteKit",
    description:
      "Serve clean Markdown from existing Next.js and SvelteKit pages when agents request Accept: text/markdown.",
    keywords: [
      "accept markdown",
      "next.js",
      "sveltekit",
      "AI agents",
      "content negotiation",
    ],
    url: "/",
    section: "site",
    excerpt:
      "Send Accept: text/markdown to any route and get clean Markdown back for AI agents with zero page changes.",
    body:
      "accept-md init npx accept-md install Next.js SvelteKit Accept header markdown audit AI agents documentation export",
  },
  {
    title: "About accept-md",
    description:
      "accept-md is an open-source implementation for serving Markdown from existing Next.js and SvelteKit pages with Accept: text/markdown.",
    keywords: ["accept-md", "open source", "accept markdown"],
    url: "/about",
    section: "site",
    excerpt:
      "Open-source tooling for adding Accept Markdown support to Next.js and SvelteKit sites.",
    body:
      "open source Accept Markdown Next.js SvelteKit content negotiation AI agents crawlers JavaScript handlers",
  },
  {
    title: "Website Markdown Audit",
    description:
      "Free Markdown audit tool to test Accept: text/markdown responses, compare HTML vs Markdown size, and verify Vary: Accept.",
    keywords: [
      "markdown audit",
      "Accept: text/markdown test",
      "Vary Accept",
      "content negotiation audit",
    ],
    url: "/markdown-audit",
    section: "site",
    excerpt:
      "Paste any URL to test Accept Markdown support and get a production-readiness report.",
    body:
      "markdown audit tool test Accept header Vary Accept HTML fallback multi URL audit curl alternative",
  },
];

function buildExcerpt(text: string, maxLength = 160): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>#|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSearchIndex(): SearchIndexEntry[] {
  const collections: ContentCollection[] = ["docs", "learn", "integrations"];
  const contentEntries = collections.flatMap((collection) =>
    getAllContent(collection).map((item) => ({
      title: item.title,
      description: item.description,
      keywords: normalizeKeywords(item.keywords),
      url: `/${collection}/${item.slug}`,
      section: collection,
      excerpt: buildExcerpt(item.description || stripMarkdown(item.content)),
      body: stripMarkdown(item.content),
    }))
  );

  const blogEntries = getAllBlogPosts().map((post) => ({
    title: post.title,
    description: post.description,
    keywords: normalizeKeywords(post.keywords),
    url: `/blog/${post.slug}`,
    section: "blog" as const,
    excerpt: buildExcerpt(post.description || stripMarkdown(post.content)),
    body: stripMarkdown(post.content),
  }));

  return [...STATIC_PAGES, ...contentEntries, ...blogEntries];
}

function normalizeKeywords(keywords: unknown): string[] {
  if (!keywords) {
    return [];
  }

  if (typeof keywords === "string") {
    return [keywords];
  }

  if (!Array.isArray(keywords)) {
    return [String(keywords)];
  }

  return keywords
    .map((keyword) => (typeof keyword === "string" ? keyword : String(keyword)))
    .filter(Boolean);
}

function scoreEntry(entry: SearchIndexEntry, query: string): number {
  const normalizedQuery = query.toLowerCase();
  const title = entry.title.toLowerCase();
  const description = entry.description.toLowerCase();
  const body = entry.body.toLowerCase();
  const keywords = normalizeKeywords(entry.keywords).map((keyword) =>
    keyword.toLowerCase()
  );

  let score = 0;

  if (title === normalizedQuery) {
    score += 100;
  } else if (title.includes(normalizedQuery)) {
    score += 60;
  } else if (title.split(/\s+/).some((word) => word.startsWith(normalizedQuery))) {
    score += 40;
  }

  if (keywords.some((keyword) => keyword === normalizedQuery)) {
    score += 50;
  } else if (keywords.some((keyword) => keyword.includes(normalizedQuery))) {
    score += 30;
  }

  if (description.includes(normalizedQuery)) {
    score += 20;
  }

  if (entry.excerpt.toLowerCase().includes(normalizedQuery)) {
    score += 10;
  }

  if (body.includes(normalizedQuery)) {
    score += 15;
  }

  const headingMatches = entry.body
    .split(/\s+/)
    .some((word) => word.startsWith(normalizedQuery));
  if (headingMatches && body.includes(normalizedQuery)) {
    score += 5;
  }

  return score;
}

export function searchSite(query: string): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  return buildSearchIndex()
    .map((entry) => ({
      title: entry.title,
      description: entry.description,
      url: entry.url,
      section: entry.section,
      excerpt: entry.excerpt,
      score: scoreEntry(entry, trimmed),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

export function getSectionLabel(section: SearchSection): string {
  return SECTION_LABELS[section];
}
