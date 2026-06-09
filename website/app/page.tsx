import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProtocolSection } from "@/components/ProtocolSection";
import { Install } from "@/components/Install";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SiteSearchResults } from "@/components/SiteSearch";
import { buildWebPageSchema, SITE_URL } from "@/lib/jsonld";
import { buildArticleMetadata } from "@/lib/metadata";
import { searchSite } from "@/lib/search";

const homeTitle = "Accept Markdown for Next.js and SvelteKit";
const homeDescription =
  "Serve clean Markdown from existing Next.js and SvelteKit pages when agents request Accept: text/markdown. Install accept-md with one command.";

const homeMetadata: Metadata = buildArticleMetadata({
  title: homeTitle,
  description: homeDescription,
  url: SITE_URL,
  keywords: [
    "accept markdown",
    "Accept: text/markdown",
    "Next.js markdown",
    "SvelteKit markdown",
    "AI agents markdown",
    "markdown audit",
    "website markdown audit",
  ],
  ogType: "website",
});

interface HomeProps {
  searchParams?: {
    s?: string;
  };
}

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const query = searchParams?.s?.trim();

  if (query) {
    return {
      title: `Search results for "${query}"`,
      description: `Search results for "${query}" on accept-md.`,
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return homeMetadata;
}

export default function Home({ searchParams }: HomeProps) {
  const query = searchParams?.s?.trim();
  const results = query ? searchSite(query) : null;

  return (
    <>
      <JsonLd
        data={buildWebPageSchema({
          name: `accept-md | ${homeTitle}`,
          description: homeDescription,
          url: SITE_URL,
        })}
      />
      <Header />
      <main>
        {query ? (
          <SiteSearchResults query={query} results={results ?? []} />
        ) : (
          <>
            <Hero />
            <ProtocolSection />
            <Install />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
