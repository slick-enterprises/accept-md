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
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          One command to get started
        </h2>
        <p className="mt-4 text-lg text-ink-400">
          From your Next.js project root. Init detects App vs Pages Router and
          sets up middleware and handler.
        </p>
        <div className="mt-8 overflow-hidden rounded-card-lg border border-ink-800 bg-ink-950">
          <div className="flex items-center gap-2 border-b border-ink-800 bg-ink-900/80 px-4 py-3 text-sm text-ink-500">
            <Terminal className="h-4 w-4" />
            <span>Your project root</span>
          </div>
          <pre className="overflow-x-auto p-6 font-mono text-sm leading-relaxed text-ink-200">
            <span className="text-ink-500">$</span> npx accept-md init
            {"\n\n"}
            <span className="text-ink-500"># Then install deps</span>
            {"\n"}
            <span className="text-ink-500">$</span> pnpm install
          </pre>
        </div>
        <p className="mt-6 text-ink-400">
          <Link
            href="/docs"
            className="font-medium text-brand-400 underline hover:text-brand-300"
          >
            Full documentation
          </Link>{" "}
          — config, CLI (doctor, fix-routes), and manual setup.
        </p>
      </div>
    </section>
  );
}
