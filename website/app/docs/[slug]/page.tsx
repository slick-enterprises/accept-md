import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleToc, extractHeadings } from "@/components/ArticleToc";
import { DocArticleNav } from "@/components/DocArticleNav";
import { MarkdownContent } from "@/components/MarkdownContent";
import { JsonLd } from "@/components/JsonLd";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildTechArticleSchema,
  SITE_URL,
} from "@/lib/jsonld";
import { buildArticleMetadata } from "@/lib/metadata";
import {
  getAdjacentContent,
  getAllContentSlugs,
  getContentItem,
} from "@/lib/content";

interface DocsArticlePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return getAllContentSlugs("docs").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: DocsArticlePageProps): Metadata {
  const item = getContentItem("docs", params.slug);

  if (!item) {
    return {
      title: "Documentation Not Found",
    };
  }

  const pageUrl = `${SITE_URL}/docs/${item.slug}`;

  return buildArticleMetadata({
    title: item.title,
    description: item.description,
    url: pageUrl,
    keywords: item.keywords,
    section: "Docs",
    publishedTime: item.date || undefined,
    modifiedTime: item.updated || undefined,
  });
}

export default function DocsArticlePage({ params }: DocsArticlePageProps) {
  const item = getContentItem("docs", params.slug);

  if (!item) {
    notFound();
  }

  const pageUrl = `${SITE_URL}/docs/${item.slug}`;
  const headings = extractHeadings(item.content);
  const { prev, next } = getAdjacentContent("docs", params.slug);

  return (
    <article>
      <JsonLd
        data={[
          buildTechArticleSchema({
            title: item.title,
            description: item.description,
            url: pageUrl,
            datePublished: item.date || undefined,
            dateModified: item.updated || undefined,
            keywords: item.keywords,
          }),
          buildBreadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Docs", url: `${SITE_URL}/docs` },
            { name: item.title, url: pageUrl },
          ]),
          ...(item.faq.length > 0 ? [buildFaqPageSchema(item.faq)] : []),
        ]}
      />
      <nav className="mb-8 text-sm text-ink-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/docs" className="transition-colors hover:text-teal-400">
              Docs
            </Link>
          </li>
          <li aria-hidden="true">·</li>
          <li className="text-ink-400" aria-current="page">
            {item.title}
          </li>
        </ol>
      </nav>

      <header className="mb-12">
        {item.category && (
          <p className="section-label mb-4">{item.category}</p>
        )}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {item.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-400">
          {item.description}
        </p>
        {item.updated && item.updated !== item.date && (
          <p className="mt-4 text-sm text-ink-500">
            Last updated{" "}
            <time dateTime={item.updated}>
              {new Date(item.updated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </p>
        )}
      </header>

      <ArticleToc headings={headings} />
      <MarkdownContent content={item.content} variant="docs" />
      <DocArticleNav prev={prev} next={next} basePath="/docs" />
    </article>
  );
}
