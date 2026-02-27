import {
  Bot,
  FileText,
  Share2,
  Search,
  Zap,
  type LucideIcon,
} from "lucide-react";

const features: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "AI crawlers & LLM ingestion",
    description:
      "Expose your content as Markdown for indexing and LLM pipelines without changing your app.",
    icon: Bot,
  },
  {
    title: "Documentation exports",
    description:
      "One command to get Markdown from docs sites for offline use or migration.",
    icon: FileText,
  },
  {
    title: "Content syndication",
    description:
      "Reuse the same pages in other systems, newsletters, or tools that consume Markdown.",
    icon: Share2,
  },
  {
    title: "SEO & tooling",
    description:
      "Provide alternate representations for analysis, audits, and content portability.",
    icon: Search,
  },
  {
    title: "Zero page changes",
    description:
      "Middleware intercepts requests; your components stay HTML. No Puppeteer, no custom server.",
    icon: Zap,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-20 border-t border-ink-800/80 bg-ink-900/20 px-4 py-section sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="section-label">Features</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight text-white sm:text-5xl md:text-6xl">
          Built for how you ship
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-300">
          Use cases that just work with your existing Next.js or SvelteKit setup
          on Vercel.
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, index) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group card-hover rounded-card-lg border border-ink-800/60 bg-gradient-to-br from-ink-950/95 to-ink-900/60 p-6 backdrop-blur-sm transition-all duration-500 hover:border-brand-500/40 hover:from-ink-900/70 hover:to-ink-950/90 hover:shadow-xl"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink-700/50 bg-gradient-to-br from-ink-900/80 to-ink-950/80 text-brand-400 shadow-sm transition-all duration-300 group-hover:border-brand-500/50 group-hover:bg-gradient-to-br group-hover:from-brand-500/20 group-hover:to-brand-600/10 group-hover:shadow-md group-hover:shadow-brand-500/10">
                    <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="absolute -inset-1 rounded-xl bg-brand-500/0 blur transition-all duration-300 group-hover:bg-brand-500/10"></div>
                </div>
                <h3 className="mt-5 font-display text-xl text-white transition-colors group-hover:text-brand-300 sm:text-2xl">
                  {f.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-300 transition-colors group-hover:text-ink-200">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
