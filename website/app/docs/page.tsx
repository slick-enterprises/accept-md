import Link from "next/link";
import { ContentCardGrid } from "@/components/ContentCardGrid";
import { getAllContent } from "@/lib/content";

export default function DocsPage() {
  const docs = getAllContent("docs");

  return (
    <div>
      <header className="mb-12">
        <p className="section-label">Documentation</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Build with accept-md
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-400">
          Install, configure, and operate `Accept: text/markdown` support for
          Next.js and SvelteKit without changing your page components.
        </p>
      </header>

      <ContentCardGrid items={docs} basePath="/docs" />

      <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Looking for implementation examples?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-400">
          Use the integration pages for framework-specific setup paths, then
          return here for configuration, output, caching, and troubleshooting.
        </p>
        <Link
          href="/integrations"
          className="mt-4 inline-flex text-sm font-medium text-ink-200 transition-colors hover:text-white"
        >
          View integrations
        </Link>
      </div>
    </div>
  );
}
