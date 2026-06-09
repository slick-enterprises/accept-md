import { IntegrationList } from "@/components/ContentCardGrid";
import { JsonLd } from "@/components/JsonLd";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  SITE_URL,
} from "@/lib/jsonld";
import { getAllContent } from "@/lib/content";

export default function IntegrationsPage() {
  const integrations = getAllContent("integrations");
  const pageUrl = `${SITE_URL}/integrations`;

  return (
    <div>
      <JsonLd
        data={[
          buildCollectionPageSchema({
            name: "accept-md Integrations",
            description:
              "Framework-specific guides for adding Accept Markdown support to Next.js and SvelteKit projects.",
            url: pageUrl,
            items: integrations.map((item) => ({
              name: item.title,
              url: `${SITE_URL}/integrations/${item.slug}`,
            })),
          }),
          buildBreadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Integrations", url: pageUrl },
          ]),
        ]}
      />
      <header className="mb-12">
        <p className="section-label">Integrations</p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Add Markdown negotiation to your framework
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-400">
          accept-md supports Next.js App Router, Pages Router, and SvelteKit
          with generated handlers that stay compatible with JavaScript projects.
        </p>
      </header>

      <IntegrationList items={integrations} basePath="/integrations" />
    </div>
  );
}
