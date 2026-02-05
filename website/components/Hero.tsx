import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-28 sm:px-6 sm:pt-32 sm:pb-36">
      <div className="mx-auto max-w-4xl text-center">
        <p className="section-label animate-fade-in opacity-0">
          Next.js → Markdown
        </p>
        <h1 className="mt-5 animate-slide-up font-display text-4xl font-bold tracking-tight text-white opacity-0 sm:text-5xl md:text-6xl lg:text-[3.25rem] [animation-delay:0.08s] [animation-fill-mode:forwards]">
          Serve Markdown from{" "}
          <br className="hidden sm:block" />
          <span className="gradient-text">any Next.js page</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl animate-slide-up text-lg text-ink-400 opacity-0 sm:text-xl [animation-delay:0.16s] [animation-fill-mode:forwards]">
          When clients send{" "}
          <code className="rounded-md border border-ink-700 bg-ink-900/80 px-2 py-0.5 font-mono text-sm text-brand-300">
            Accept: text/markdown
          </code>
          , return clean Markdown. No changes to your pages. Works with App
          Router, Pages Router, SSG, SSR, and ISR.
        </p>
        <div className="mt-10 flex animate-slide-up flex-col items-center justify-center gap-4 opacity-0 sm:flex-row [animation-delay:0.24s] [animation-fill-mode:forwards]">
          <Link
            href="/#install"
            className="glow-border inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-brand-400"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="https://github.com/hemanthvalsaraj/accept-md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-900/50 px-6 py-3.5 font-semibold text-white transition hover:border-ink-600 hover:bg-ink-800/50"
          >
            View on GitHub
          </a>
        </div>
        <div className="mt-16 animate-slide-up opacity-0 [animation-delay:0.32s] [animation-fill-mode:forwards]">
          <div className="code-block mx-auto max-w-2xl">
            <div className="flex items-center justify-between border-b border-ink-800 bg-ink-900/80 px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-ink-500">
                <Code2 className="h-3.5 w-3.5" />
                <span>Terminal</span>
              </div>
              <div className="flex gap-1 rounded-md border border-ink-700 bg-ink-950 p-0.5 text-[10px] font-medium text-ink-500">
                <span className="rounded px-2 py-1 text-brand-400">.MD</span>
                <span className="rounded px-2 py-1">.JSON</span>
              </div>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed text-ink-200">
              <span className="text-ink-500">$</span> curl -H &quot;Accept:
              text/markdown&quot; https://your-site.com/
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
