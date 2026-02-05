import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export function CTA() {
  return (
    <section className="border-t border-ink-800/80 px-4 py-section sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-label">Ready?</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Serve Markdown from your app
        </h2>
        <p className="mt-4 text-lg text-ink-400">
          Add accept-md to your Next.js app and keep your pages unchanged.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://github.com/slick-enterprises/accept-md"
            target="_blank"
            rel="noopener noreferrer"
            className="glow-border inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white transition hover:bg-brand-400"
          >
            GitHub
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-xl border border-ink-700 bg-transparent px-6 py-3.5 font-semibold text-white transition hover:border-ink-600 hover:bg-ink-800/50"
          >
            <BookOpen className="h-4 w-4" />
            Read the docs
          </Link>
        </div>
      </div>
    </section>
  );
}
