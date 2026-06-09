import Link from "next/link";
import { ContentCardGrid } from "@/components/ContentCardGrid";
import { ContentCard } from "@/components/ContentCard";
import { JsonLd } from "@/components/JsonLd";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  SITE_URL,
} from "@/lib/jsonld";
import { getAllContent } from "@/lib/content";

export default function DocsPage() {
  const docs = getAllContent("docs");
  const pageUrl = `${SITE_URL}/docs`;

  return (
    <div>
      <JsonLd
        data={[
          buildCollectionPageSchema({
            name: "accept-md Documentation",
            description:
              "Install, configure, and operate Accept Markdown support for any Next.js or SvelteKit route.",
            url: pageUrl,
            items: docs.map((item) => ({
              name: item.title,
              url: `${SITE_URL}/docs/${item.slug}`,
            })),
          }),
          buildBreadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Docs", url: pageUrl },
          ]),
        ]}
      />
      <header className="mb-12">
        <p className="section-label">Documentation</p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Build with accept-md
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-400">
          Install, configure, and operate{" "}
          <code className="font-mono text-sm text-teal-400">
            Accept: text/markdown
          </code>{" "}
          support for Next.js and SvelteKit.
        </p>
      </header>

      <ContentCardGrid items={docs} basePath="/docs" />

      <ContentCard variant="callout" className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Looking for implementation examples?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-400">
          Use the integration pages for framework-specific setup paths, then
          return here for configuration, output, caching, and troubleshooting.
        </p>
        <Link href="/integrations" className="link-accent mt-4 inline-flex text-sm font-medium">
          View integrations
        </Link>
      </ContentCard>
    </div>
  );
}
