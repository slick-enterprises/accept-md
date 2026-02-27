import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { GitHubStarWidget } from "./GitHubStarWidget";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-28 sm:px-6 sm:pt-24 sm:pb-36">
      {/* Decorative gradient orbs */}
      <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute h-80 w-80 rounded-full bg-brand-500/12 blur-3xl animate-pulse"></div>
        <div className="absolute left-1/3 top-1/3 h-56 w-56 rounded-full bg-brand-400/12 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -right-1/4 top-1/2 h-40 w-40 rounded-full bg-brand-600/8 blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="section-label animate-fade-in opacity-0">
          Next.js → Markdown
        </p>
        <h1 className="mt-5 animate-slide-up font-display text-4xl tracking-tight text-white opacity-0 sm:text-5xl md:text-6xl lg:text-7xl [animation-delay:0.08s] [animation-fill-mode:forwards]">
          Serve Markdown from{" "}
          <br className="hidden sm:block" />
          <span className="gradient-text">any Next.js page</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl animate-slide-up text-lg leading-relaxed text-ink-300 opacity-0 sm:text-xl [animation-delay:0.16s] [animation-fill-mode:forwards]">
          When clients send{" "}
          <code className="rounded-md border border-ink-700/50 bg-ink-900/60 px-2.5 py-1 font-mono text-sm text-brand-300 shadow-sm backdrop-blur-sm transition-colors hover:border-brand-500/30 hover:bg-ink-900/80">
            Accept: text/markdown
          </code>
          , return clean Markdown. No changes to your pages. Works with App
          Router, Pages Router, SSG, SSR, and ISR.
        </p>
        <div className="mt-10 flex animate-slide-up flex-col items-center justify-center gap-4 opacity-0 sm:flex-row [animation-delay:0.24s] [animation-fill-mode:forwards]">
          <Link
            href="/#install"
            className="btn-primary group relative inline-flex items-center gap-2.5 rounded-xl px-8 py-4 font-semibold text-white"
          >
            <span className="relative z-10">Get started</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <GitHubStarWidget />
        </div>
        <div className="mt-16 animate-slide-up opacity-0 [animation-delay:0.32s] [animation-fill-mode:forwards]">
          <div className="code-block group mx-auto max-w-2xl transition-all duration-500 hover:border-brand-500/30 hover:shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink-800/80 bg-gradient-to-r from-ink-900/95 to-ink-900/75 px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs text-ink-400">
                <Code2 className="h-3.5 w-3.5 text-brand-400 transition-transform duration-300 group-hover:scale-110" />
                <span>Terminal</span>
              </div>
              <div className="flex gap-1 rounded-md border border-ink-700/60 bg-ink-950/90 p-0.5 text-[10px] font-medium text-ink-500 backdrop-blur-sm shadow-sm">
                <span className="rounded px-2 py-1 text-brand-400">bash</span>
              </div>
            </div>
            <pre className="overflow-x-auto p-6 font-mono text-sm leading-relaxed text-ink-200">
              <span className="text-ink-500">$</span>{" "}
              <span className="text-brand-300">npx accept-md init</span>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
