import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { JsonLd } from "@/components/JsonLd";
import {
  buildAboutPageSchema,
  buildBreadcrumbSchema,
  SITE_URL,
} from "@/lib/jsonld";
import { buildArticleMetadata } from "@/lib/metadata";

const pageUrl = `${SITE_URL}/about`;
const GITHUB_URL = "https://github.com/slick-enterprises/accept-md";

export const metadata: Metadata = buildArticleMetadata({
  title: "About",
  description:
    "accept-md is an open-source implementation for serving Markdown from existing Next.js and SvelteKit pages with Accept: text/markdown.",
  url: pageUrl,
  keywords: [
    "accept-md",
    "accept markdown",
    "Accept: text/markdown",
    "Next.js markdown",
    "SvelteKit markdown",
  ],
  ogType: "website",
});

const principles = [
  "Use the pages you already have as the source of truth.",
  "Serve Markdown through HTTP content negotiation, not a separate content silo.",
  "Keep browser traffic unchanged while making routes easier for agents to read.",
  "Generate JavaScript-compatible handlers so non-TypeScript apps work too.",
];

export default function AboutPage() {
  return (
    <AppShell section="learn">
      <JsonLd
        data={[
          buildAboutPageSchema({
            name: "About accept-md",
            description:
              "Open-source tooling for adding Accept Markdown support to Next.js and SvelteKit sites.",
            url: pageUrl,
          }),
          buildBreadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "About", url: pageUrl },
          ]),
        ]}
      />
      <header className="mb-12">
        <p className="section-label">About</p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          About accept-md
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-400">
          accept-md is open-source tooling that adds{" "}
          <code className="font-mono text-sm text-teal-400">
            Accept: text/markdown
          </code>{" "}
          support to Next.js and SvelteKit sites. When a client requests
          Markdown, the same URL returns a clean text representation of the
          page — without a separate publishing pipeline.
        </p>
      </header>

      <section>
        <h2 className="font-display text-xl font-semibold text-white">
          Principles
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-300">
          {principles.map((principle) => (
            <li key={principle} className="leading-relaxed">
              {principle}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-white">
          How it works
        </h2>
        <p className="mt-4 leading-relaxed text-ink-400">
          The CLI detects your framework, adds a route handler, and writes
          configuration. Regular HTML requests are unchanged. Markdown requests
          are routed internally, rendered once as HTML, converted to Markdown,
          and returned with frontmatter and JSON-LD preserved.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-white">
          Project links
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              GitHub repository
            </a>
          </li>
          <li>
            <a
              href={`${GITHUB_URL}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              Issue tracker
            </a>
          </li>
          <li>
            <Link href="/docs/installation" className="link-accent">
              Installation guide
            </Link>
          </li>
          <li>
            <Link href="/docs/output" className="link-accent">
              Markdown output reference
            </Link>
          </li>
        </ul>
        <p className="mt-8 text-sm text-ink-500">
          Maintained by{" "}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-400 transition-colors hover:text-teal-400"
          >
            slick-enterprises
          </a>
          . MIT licensed.
        </p>
      </section>
    </AppShell>
  );
}
