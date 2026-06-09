import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { getAllContentSlugs, getContentItem } from "@/lib/content";

interface DocsArticlePageProps {
  params: {
    slug: string;
  };
}

const siteUrl = "https://accept.md";

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

  return {
    title: item.title,
    description: item.description,
    keywords: item.keywords,
    openGraph: {
      title: `${item.title} | accept-md Docs`,
      description: item.description,
      url: `${siteUrl}/docs/${item.slug}`,
    },
    alternates: {
      canonical: `${siteUrl}/docs/${item.slug}`,
    },
  };
}

export default function DocsArticlePage({ params }: DocsArticlePageProps) {
  const item = getContentItem("docs", params.slug);

  if (!item) {
    notFound();
  }

  return (
    <article>
      <nav className="mb-8 text-sm text-ink-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/docs" className="transition-colors hover:text-ink-400">
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
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {item.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-400">
          {item.description}
        </p>
      </header>

      <MarkdownContent content={item.content} />
    </article>
  );
}
