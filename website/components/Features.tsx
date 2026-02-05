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
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Built for how you ship
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-400">
          Use cases that just work with your existing Next.js setup.
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-card-lg border border-ink-800 bg-ink-950/80 p-6 transition hover:border-ink-700 hover:bg-ink-900/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-700 bg-ink-900/80 text-brand-400 transition group-hover:border-brand-500/50 group-hover:bg-brand-500/10">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">
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
