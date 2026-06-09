import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Plug,
  ScanSearch,
  Newspaper,
  Rocket,
  Settings,
  Layers,
  Brain,
  Server,
  Wrench,
} from "lucide-react";

export type NavFeaturedItem = {
  href: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  primary?: boolean;
};

export type NavLinkItem = {
  href: string;
  label: string;
};

export type NavSection = {
  id: string;
  label: string;
  href: string;
  tagline?: string;
  featured: NavFeaturedItem[];
  links: NavLinkItem[];
};

export type FooterLinkGroup = {
  id: string;
  label: string;
  href: string;
  links: NavLinkItem[];
};

/** Curated link groups for the site footer — derived from mega-menu sections. */
export function getFooterLinkGroups(): FooterLinkGroup[] {
  return NAV_SECTIONS.map((section) => {
    const links: NavLinkItem[] = [];

    if (section.id === "blog") {
      links.push(...section.links.slice(0, 4));
    } else {
      for (const item of section.featured.slice(0, 2)) {
        links.push({ href: item.href, label: item.title });
      }

      for (const link of section.links) {
        if (links.length >= 4) break;
        if (!links.some((existing) => existing.href === link.href)) {
          links.push(link);
        }
      }
    }

    return {
      id: section.id,
      label: section.label,
      href: section.href,
      links,
    };
  });
}

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "docs",
    label: "Docs",
    href: "/docs",
    tagline: "Install, configure, and operate accept-md.",
    featured: [
      {
        href: "/docs/installation",
        title: "Installation",
        description:
          "Install accept-md in Next.js or SvelteKit and verify that Markdown negotiation works.",
        icon: Rocket,
        primary: true,
      },
      {
        href: "/docs/configuration",
        title: "Configuration",
        description:
          "Configure which routes serve Markdown, what gets cleaned, and how responses are cached.",
        icon: Settings,
      },
    ],
    links: [
      { href: "/docs/cli", label: "CLI Reference" },
      { href: "/docs/output", label: "Markdown Output" },
      { href: "/docs/caching", label: "Caching and CDN Behavior" },
      { href: "/docs/troubleshooting", label: "Troubleshooting" },
    ],
  },
  {
    id: "learn",
    label: "Learn",
    href: "/learn",
    tagline: "Protocol fundamentals and production best practices.",
    featured: [
      {
        href: "/learn/accept-markdown",
        title: "What Accept Markdown Means",
        description:
          "A practical explanation of serving Markdown from the same URL when clients send Accept: text/markdown.",
        icon: BookOpen,
        primary: true,
      },
      {
        href: "/learn/why-markdown-for-agents",
        title: "Why AI Agents Prefer Markdown",
        description:
          "Markdown gives agents a smaller, cleaner, higher-signal version of the content already present in your HTML.",
        icon: Brain,
      },
    ],
    links: [
      { href: "/learn/vary-accept", label: "Why Vary: Accept Is Required" },
      {
        href: "/learn/accept-header-quality-values",
        label: "Accept Headers and Quality Values",
      },
      {
        href: "/learn/when-to-return-406",
        label: "When to Return 406 Not Acceptable",
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    href: "/integrations",
    tagline: "Framework-specific setup guides.",
    featured: [
      {
        href: "/integrations/nextjs-app-router",
        title: "Next.js App Router",
        description:
          "Serve Markdown from Next.js App Router pages with accept-md rewrites and a route handler.",
        icon: Layers,
        primary: true,
      },
      {
        href: "/integrations/sveltekit",
        title: "SvelteKit",
        description:
          "Serve Markdown from SvelteKit routes with accept-md hooks and a generated +server handler.",
        icon: Plug,
      },
    ],
    links: [
      {
        href: "/integrations/nextjs-pages-router",
        label: "Next.js Pages Router",
      },
      { href: "/integrations/vercel", label: "Vercel" },
    ],
  },
  {
    id: "audit",
    label: "Audit",
    href: "/markdown-audit",
    tagline: "Test any URL for Markdown negotiation readiness.",
    featured: [
      {
        href: "/markdown-audit",
        title: "Website Markdown Audit",
        description:
          "Paste any URL to test Accept: text/markdown responses, compare HTML vs Markdown size, and verify Vary: Accept.",
        icon: ScanSearch,
        primary: true,
      },
    ],
    links: [
      { href: "/docs/troubleshooting", label: "Troubleshooting guide" },
      { href: "/learn/vary-accept", label: "Why Vary: Accept Is Required" },
    ],
  },
  {
    id: "blog",
    label: "Blog",
    href: "/blog",
    tagline: "Guides, comparisons, and deep dives.",
    featured: [
      {
        href: "/blog/ai-agent-markdown-support-matrix-2026",
        title: "Which AI Agents Request Markdown?",
        description:
          "A breakdown of which AI agents send Accept: text/markdown and what site owners should do today.",
        icon: Newspaper,
        primary: true,
      },
      {
        href: "/blog/cloudflare-markdown-for-agents-vs-accept-md",
        title: "Cloudflare vs accept-md",
        description:
          "Compare Cloudflare's edge Markdown for Agents with accept-md's app-level handlers for Next.js and SvelteKit.",
        icon: Server,
      },
      {
        href: "/blog/best-tools-ai-crawlers-index-nextjs-content",
        title: "Best Tools for AI Crawlers in 2026",
        description:
          "Compare Puppeteer, Accept headers, and modern solutions for LLM ingestion of Next.js content.",
        icon: Wrench,
      },
    ],
    links: [
      {
        href: "/blog/how-to-convert-html-to-markdown-nextjs",
        label: "How to Convert HTML to Markdown in Next.js",
      },
      {
        href: "/blog/nextjs-markdown-export-puppeteer-vs-accept-header",
        label: "Puppeteer vs Accept Header Comparison",
      },
      {
        href: "/blog/vercel-markdown-nextjs-sveltekit-accept-header",
        label: "Vercel + Accept: text/markdown",
      },
      {
        href: "/blog/serve-markdown-sveltekit-vercel-accept-header",
        label: "Serve Markdown from SvelteKit on Vercel",
      },
      {
        href: "/blog/serve-markdown-nextjs-without-puppeteer",
        label: "Serve Markdown Without Puppeteer",
      },
    ],
  },
];
