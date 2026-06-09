import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { JsonLd } from "@/components/JsonLd";
import {
  buildBreadcrumbSchema,
  buildTechArticleSchema,
  SITE_URL,
} from "@/lib/jsonld";
import { buildArticleMetadata } from "@/lib/metadata";
import { getAllContentSlugs, getContentItem } from "@/lib/content";

interface LearnArticlePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return getAllContentSlugs("learn").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: LearnArticlePageProps): Metadata {
  const item = getContentItem("learn", params.slug);

  if (!item) {
    return {
      title: "Article Not Found",
    };
  }

  const pageUrl = `${SITE_URL}/learn/${item.slug}`;

  return buildArticleMetadata({
    title: item.title,
    description: item.description,
    url: pageUrl,
    keywords: item.keywords,
    publishedTime: item.date || undefined,
    modifiedTime: item.updated || undefined,
  });
}

export default function LearnArticlePage({ params }: LearnArticlePageProps) {
  const item = getContentItem("learn", params.slug);

  if (!item) {
    notFound();
  }

  const pageUrl = `${SITE_URL}/learn/${item.slug}`;

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
            { name: "Learn", url: `${SITE_URL}/learn` },
            { name: item.title, url: pageUrl },
          ]),
        ]}
      />
      <nav className="mb-8 text-sm text-ink-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/learn" className="transition-colors hover:text-ink-400">
              Learn
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
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
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

      <MarkdownContent content={item.content} variant="learn" />

      <footer className="mt-16 border-t border-white/5 pt-8">
        <Link
          href="/learn"
          className="link-accent text-sm font-medium"
        >
          ← Back to Learn
        </Link>
      </footer>
    </article>
  );
}
