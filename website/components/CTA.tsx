import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export function CTA() {
  return (
    <section className="border-t border-ink-800/60 bg-gradient-to-b from-ink-900/30 via-ink-950 to-ink-950 px-4 py-section sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-label">Ready?</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight text-white sm:text-5xl md:text-6xl">
          Serve Markdown from your app
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink-300">
          Add accept-md to your Next.js app and keep your pages unchanged.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://github.com/slick-enterprises/accept-md"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary group relative inline-flex items-center gap-2.5 rounded-xl px-8 py-4 font-semibold text-white"
          >
            <span className="relative z-10">GitHub</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <Link
            href="/docs"
            className="btn-secondary group relative inline-flex items-center gap-2.5 rounded-xl px-8 py-4 font-semibold text-white"
          >
            <BookOpen className="relative z-10 h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="relative z-10">Read the docs</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
