import { ContentCardGrid } from "@/components/ContentCardGrid";
import { getAllContent } from "@/lib/content";

export default function IntegrationsPage() {
  const integrations = getAllContent("integrations");

  return (
    <div>
      <header className="mb-12">
        <p className="section-label">Integrations</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Add Markdown negotiation to your framework
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-400">
          accept-md supports Next.js App Router, Pages Router, and SvelteKit
          with generated handlers that stay compatible with JavaScript projects.
        </p>
      </header>

      <ContentCardGrid items={integrations} basePath="/integrations" />
    </div>
  );
}
