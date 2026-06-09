import Link from "next/link";
import { SectionHeader } from "./SectionHeader";

const flowSteps = [
  {
    title: "Negotiate",
    detail:
      "A rewrite, handler, or SvelteKit hook detects Accept: text/markdown.",
  },
  {
    title: "Render",
    detail: "Your app renders the page once as HTML.",
  },
  {
    title: "Return",
    detail:
      "The handler converts HTML to Markdown and strips layout chrome.",
  },
];

const useCases = [
  {
    label: "Agent crawling",
    detail: "Crawlers request Markdown instead of parsing HTML.",
    href: "/learn/why-markdown-for-agents",
  },
  {
    label: "Docs export",
    detail: "Download any page as Markdown for offline reading.",
    href: "/docs/output",
  },
  {
    label: "Content syndication",
    detail: "Republish to newsletters or CMSs from the same URL.",
    href: "/learn/accept-markdown",
  },
  {
    label: "Auditing",
    detail: "Inspect the text-only view of a route.",
    href: "/markdown-audit",
  },
];

export function ProtocolSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-white/5 px-4 py-section sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Protocol"
          title="How negotiation works"
          description="Your components stay untouched. Next.js rewrites or SvelteKit hooks route Markdown requests internally."
        />

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {flowSteps.map((step, index) => (
            <div key={step.title} className="flex flex-1 items-start gap-4">
              {index > 0 && (
                <span
                  className="hidden shrink-0 pt-1 text-ink-600 sm:block"
                  aria-hidden
                >
                  →
                </span>
              )}
              <div>
                <h3 className="font-mono text-sm font-medium text-teal-400">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-white/5 pt-12">
          <h3 className="font-display text-xl font-semibold text-white">
            What you can do with one header
          </h3>
          <ul className="mt-6 divide-y divide-white/5">
            {useCases.map((item) => (
              <li key={item.label} className="py-4 first:pt-0 last:pb-0">
                <Link
                  href={item.href}
                  className="group flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <span className="font-medium text-white transition-colors group-hover:text-teal-400">
                    {item.label}
                  </span>
                  <span className="text-sm text-ink-500">{item.detail}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
