import Link from "next/link";

export function CTA() {
  return (
    <section className="border-t border-white/5 px-4 py-section sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-label">Ship it</p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Start serving Markdown today
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-400">
          Add accept-md to your Next.js or SvelteKit project. Your pages stay exactly as they are.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://github.com/slick-enterprises/accept-md"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium"
          >
            View on GitHub
          </a>
          <Link
            href="/docs"
            className="btn-secondary inline-flex items-center rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-white"
          >
            Read the docs
          </Link>
        </div>
      </div>
    </section>
  );
}
