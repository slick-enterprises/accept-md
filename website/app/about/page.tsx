import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const siteUrl = "https://accept.md";

export const metadata: Metadata = {
  title: "About",
  description:
    "accept-md is an open-source implementation for serving Markdown from existing Next.js and SvelteKit pages with Accept: text/markdown.",
  keywords: [
    "accept-md",
    "accept markdown",
    "Accept: text/markdown",
    "Next.js markdown",
    "SvelteKit markdown",
  ],
  openGraph: {
    title: "About accept-md",
    description:
      "Open-source tooling for adding Accept Markdown support to Next.js and SvelteKit sites.",
    url: `${siteUrl}/about`,
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

const principles = [
  "Use the pages you already have as the source of truth.",
  "Serve Markdown through HTTP content negotiation, not a separate content silo.",
  "Keep browser traffic unchanged while making routes easier for AI agents to read.",
  "Generate JavaScript-compatible handlers so non-TypeScript apps work too.",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main className="mx-auto max-w-4xl px-4 pt-16 pb-24 sm:px-6 sm:pt-20 lg:px-8">
        <header className="mb-12">
          <p className="section-label">About</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            accept-md turns existing pages into AI-readable Markdown
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-400">
            The web already has the content. accept-md gives Next.js and
            SvelteKit sites a practical way to return a clean Markdown
            representation when clients ask for `Accept: text/markdown`.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          {principles.map((principle) => (
            <div
              key={principle}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-relaxed text-ink-300"
            >
              {principle}
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Implementation, not just explanation
          </h2>
          <p className="mt-4 text-ink-400">
            accept-md is the implementation layer for teams that want Accept
            Markdown support without maintaining a second Markdown publishing
            pipeline. The CLI detects your framework, adds the route handler,
            writes configuration, and keeps regular HTML requests untouched.
          </p>
          <p className="mt-4 text-ink-400">
            The runtime converts the rendered HTML into Markdown, preserves
            metadata through YAML frontmatter and JSON-LD blocks, and lets you
            remove navigation, footers, and other layout chrome before agents
            ingest the page.
          </p>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          <Link
            href="/docs"
            className="card-hover rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Read the docs
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-400">
              Install, configure, and operate accept-md in production.
            </p>
          </Link>
          <Link
            href="/learn"
            className="card-hover rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Learn the protocol
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-400">
              Understand content negotiation, caching, and AI retrieval.
            </p>
          </Link>
          <Link
            href="/integrations"
            className="card-hover rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Pick your framework
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-400">
              Start with Next.js App Router, Pages Router, or SvelteKit.
            </p>
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
