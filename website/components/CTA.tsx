import Link from "next/link";

export function CTA() {
  return (
    <>
      <style>{`
        .btn-primary {
          background: #fff;
          color: #0a0a0a;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .btn-primary:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }
      `}</style>
      <section className="border-t border-white/5 px-4 py-section sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-label">Ship it</p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Start serving Markdown today
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-400">
          Add accept-md to your Next.js or SvelteKit project. Your pages stay exactly as they are, and agents get clean Markdown when they ask for it.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/markdown-audit"
            className="btn-primary inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium"
          >
            Run Markdown Audit
          </Link>
          <Link
            href="/docs"
            className="btn-secondary inline-flex items-center rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-white"
          >
            Read the docs
          </Link>
          <a
            href="https://github.com/slick-enterprises/accept-md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium text-ink-300 transition-colors hover:text-white"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
    </>
  );
}