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

interface IntegrationPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return getAllContentSlugs("integrations").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: IntegrationPageProps): Metadata {
  const item = getContentItem("integrations", params.slug);

  if (!item) {
    return {
      title: "Integration Not Found",
    };
  }

  const pageUrl = `${SITE_URL}/integrations/${item.slug}`;

  return buildArticleMetadata({
    title: item.title,
    description: item.description,
    url: pageUrl,
    keywords: item.keywords,
    section: "Integrations",
    publishedTime: item.date || undefined,
    modifiedTime: item.updated || undefined,
  });
}

export default function IntegrationPage({ params }: IntegrationPageProps) {
  const item = getContentItem("integrations", params.slug);

  if (!item) {
    notFound();
  }

  const pageUrl = `${SITE_URL}/integrations/${item.slug}`;

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
            { name: "Integrations", url: `${SITE_URL}/integrations` },
            { name: item.title, url: pageUrl },
          ]),
        ]}
      />
      <nav className="mb-8 text-sm text-ink-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link
              href="/integrations"
              className="transition-colors hover:text-ink-400"
            >
              Integrations
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

      <MarkdownContent content={item.content} variant="docs" />
    </article>
  );
}
