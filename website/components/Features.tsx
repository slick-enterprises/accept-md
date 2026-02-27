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
    title: "AI & LLM ready",
    description:
      "Feed clean Markdown to crawlers, RAG pipelines, and LLM agents — no scraping required.",
    icon: Bot,
  },
  {
    title: "Docs export",
    description:
      "Let users download any page as Markdown for offline reading, migration, or archival.",
    icon: FileText,
  },
  {
    title: "Content syndication",
    description:
      "Republish the same pages to newsletters, CMSs, or any tool that speaks Markdown.",
    icon: Share2,
  },
  {
    title: "SEO & auditing",
    description:
      "Expose a structured, text-only representation for analysis, accessibility audits, and portability.",
    icon: Search,
  },
  {
    title: "Zero page changes",
    description:
      "Middleware handles everything. Your components stay untouched — no Puppeteer, no custom server.",
    icon: Zap,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-20 border-t border-white/5 px-4 py-section sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="section-label">Features</p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          Every use case, one header
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-400">
          Drop into any Next.js or SvelteKit project. Works on Vercel out of the box.
        </p>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="card-hover group rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 transition-colors duration-200 hover:bg-white/[0.04]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-ink-400 transition-colors duration-200 group-hover:border-white/20 group-hover:text-ink-300">
                  <Icon className="h-5 w-5 animate-icon-float" strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-400">
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
