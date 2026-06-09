import { ContentCardGrid } from "@/components/ContentCardGrid";
import { getAllContent } from "@/lib/content";

export default function LearnPage() {
  const articles = getAllContent("learn");

  return (
    <div>
      <header className="mb-12">
        <p className="section-label">Learn</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Accept Markdown, from protocol to production
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-400">
          Practical lessons on `Accept: text/markdown`, cache correctness, AI
          retrieval, and the HTTP details that keep Markdown negotiation reliable.
        </p>
      </header>

      <ContentCardGrid items={articles} basePath="/learn" />
    </div>
  );
}
