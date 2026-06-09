import { ContentList } from "@/components/ContentCardGrid";
import { JsonLd } from "@/components/JsonLd";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  SITE_URL,
} from "@/lib/jsonld";
import { getAllContent } from "@/lib/content";

export default function LearnPage() {
  const articles = getAllContent("learn");
  const pageUrl = `${SITE_URL}/learn`;

  return (
    <div>
      <JsonLd
        data={[
          buildCollectionPageSchema({
            name: "Learn Accept Markdown",
            description:
              "Practical lessons on Accept: text/markdown, cache correctness, AI retrieval, and HTTP content negotiation.",
            url: pageUrl,
            items: articles.map((item) => ({
              name: item.title,
              url: `${SITE_URL}/learn/${item.slug}`,
            })),
          }),
          buildBreadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Learn", url: pageUrl },
          ]),
        ]}
      />
      <header className="mb-12">
        <p className="section-label">Learn</p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Accept Markdown, from protocol to production
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-400">
          Practical lessons on content negotiation, cache correctness, and the
          HTTP details that keep Markdown negotiation reliable.
        </p>
      </header>

      <ContentList items={articles} basePath="/learn" />
    </div>
  );
}
