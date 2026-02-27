import Link from "next/link";
import { Terminal } from "lucide-react";

export function Install() {
  return (
    <section
      id="install"
      className="scroll-mt-20 border-t border-ink-800/80 bg-ink-900/20 px-4 py-section sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl">
        <p className="section-label">Install</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight text-white sm:text-5xl md:text-6xl">
          One command to get started
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink-300">
          From your Next.js or SvelteKit project root. Init detects your
          framework and router, then sets up rewrites or hooks plus the handler
          — ready to deploy on Vercel.
        </p>
        <div className="mt-8 overflow-hidden rounded-card-lg border border-ink-800/60 bg-gradient-to-br from-ink-950/95 to-ink-900/60 shadow-xl transition-all duration-500 hover:border-brand-500/30 hover:shadow-2xl">
          <div className="flex items-center gap-2 border-b border-ink-800/60 bg-gradient-to-r from-ink-900/90 to-ink-900/70 px-4 py-3.5 text-sm text-ink-400 backdrop-blur-sm">
            <Terminal className="h-4 w-4 text-brand-400" />
            <span>Your project root</span>
          </div>
          <pre className="overflow-x-auto p-6 font-mono text-sm leading-relaxed text-ink-200">
            <span className="text-ink-500">$</span>{" "}
            <span className="text-brand-300">npx accept-md init</span>
            {"\n\n"}
            <span className="text-ink-500"># Then install deps</span>
            {"\n"}
            <span className="text-ink-500">$</span>{" "}
            <span className="text-ink-200">pnpm install</span>
          </pre>
        </div>
        <p className="mt-6 text-ink-300">
          <Link
            href="/docs"
            className="font-medium text-brand-400 underline decoration-brand-500/50 underline-offset-4 transition-colors hover:text-brand-300 hover:decoration-brand-400"
          >
            Full documentation
          </Link>{" "}
          — config, CLI (doctor, fix-routes), and manual setup.
        </p>
      </div>
    </section>
  );
}
