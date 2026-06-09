import Link from "next/link";
import { SiteSearchForm } from "@/components/SiteSearchForm";
import { getSectionLabel, type SearchResult } from "@/lib/search";

interface SiteSearchResultsProps {
  query: string;
  results: SearchResult[];
}

export function SiteSearchResults({ query, results }: SiteSearchResultsProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="section-label">Search</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {results.length > 0
            ? `Results for “${query}”`
            : `No results for “${query}”`}
        </h1>
        <p className="mt-4 text-base text-ink-400">
          {results.length > 0
            ? `Found ${results.length} page${results.length === 1 ? "" : "s"} across docs, learn, integrations, blog, and site pages.`
            : "Try different keywords like install, Next.js, SvelteKit, or markdown audit."}
        </p>
        <div className="mt-6">
          <SiteSearchForm defaultQuery={query} id="site-search-results" />
        </div>
      </header>

      {results.length > 0 ? (
        <ul className="divide-y divide-white/5">
          {results.map((result) => (
            <li key={result.url} className="py-6 first:pt-0">
              <article>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
                  {getSectionLabel(result.section)}
                </p>
                <Link
                  href={result.url}
                  className="mt-2 block text-xl font-semibold tracking-tight text-white transition-colors hover:text-ink-200"
                >
                  {result.title}
                </Link>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">
                  {result.excerpt}
                </p>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-ink-400">
          <p>Browse the main sections instead:</p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {[
              { href: "/docs", label: "Docs" },
              { href: "/learn", label: "Learn" },
              { href: "/integrations", label: "Integrations" },
              { href: "/blog", label: "Blog" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full border border-white/10 px-4 py-2 text-ink-300 transition-colors hover:border-white/20 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
