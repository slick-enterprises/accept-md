import Link from "next/link";
import { GitHubStarWidget } from "./GitHubStarWidget";
import { CodeBlock } from "./CodeBlock";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-32 sm:px-6 sm:pt-32 sm:pb-40">
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="section-label animate-fade-in opacity-0 [animation-fill-mode:forwards]">
          Next.js & SvelteKit → Markdown
        </p>
        <h1 className="mt-6 animate-slide-up font-display text-4xl font-semibold tracking-tight text-white opacity-0 sm:text-5xl md:text-6xl lg:text-7xl [animation-delay:0.06s] [animation-fill-mode:forwards]">
          Your pages, now in{" "}
          <span className="gradient-text">Markdown</span>
        </h1>
        <p className="hero-subtext mx-auto mt-6 max-w-xl animate-slide-up text-base leading-relaxed text-ink-400 opacity-0 sm:mt-8 sm:text-lg [animation-delay:0.12s] [animation-fill-mode:forwards]">
          Send{" "}
          <code className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-sm text-ink-300">
            Accept: text/markdown
          </code>{" "}
          to any route → clean Markdown back. Zero page changes. Next.js & SvelteKit.
        </p>
        <div className="mt-12 flex animate-slide-up flex-col items-center justify-center gap-4 opacity-0 sm:flex-row [animation-delay:0.18s] [animation-fill-mode:forwards]">
          <Link
            href="/#install"
            className="btn-primary relative inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium"
          >
            Get Started
          </Link>
          <GitHubStarWidget />
        </div>
        <div className="mt-20 animate-slide-up opacity-0 [animation-delay:0.24s] [animation-fill-mode:forwards]">
          <CodeBlock language="bash" title="Terminal" className="group mx-auto max-w-xl">
            <span className="text-ink-600">$</span>{" "}
            <span className="text-ink-200">npx accept-md init</span>
          </CodeBlock>
        </div>
      </div>
    </section>
  );
}
