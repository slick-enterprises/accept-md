import Link from "next/link";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { SectionHeader } from "@/components/SectionHeader";

const verifyItems = [
  {
    title: "Markdown response",
    description:
      "HTTP 200 with Content-Type: text/markdown and a body that is Markdown, not HTML.",
  },
  {
    title: "HTML fallback",
    description:
      "Browser requests still get text/html — your pages stay unchanged.",
  },
  {
    title: "Vary: Accept",
    description:
      "Caches store separate representations so Markdown and HTML do not collide.",
  },
  {
    title: "Distinct representations",
    description:
      "Live Markdown differs from HTML, or the estimate shows meaningful size savings.",
  },
];

export const faqSchemaItems = [
  {
    question: "How do I audit my website for Accept Markdown?",
    answer:
      "Paste any public URL into the Markdown Audit tool and click Start audit. The tool sends real HTTP requests with Accept: text/markdown and Accept: text/html, then scores the responses against four production-readiness checks.",
  },
  {
    question: "What is Accept Markdown?",
    answer:
      "Accept Markdown is HTTP content negotiation: the same URL returns HTML for browsers and Markdown when a client sends Accept: text/markdown.",
  },
  {
    question: "Does this only work on accept-md sites?",
    answer:
      "No. The audit sends real requests to any public http or https URL. It is useful for auditing your own site, a competitor, or a preview deployment before you ship.",
  },
  {
    question: 'What does "estimated" mean in the results?',
    answer:
      "If the server did not return Markdown, the audit converts the HTML response locally to show how much smaller a Markdown version could be. That estimate helps you see potential savings before you add Accept Markdown support.",
  },
  {
    question: "Are my URLs or credentials stored?",
    answer:
      "No. URLs and optional Authorization or Cookie values are used only for the outbound audit and are not saved. Credentials never appear in results.",
  },
  {
    question: "Can I audit multiple pages at once?",
    answer:
      "Yes. Open Advanced options and add paths (one per line). You can audit up to 10 URLs per request using the main URL as the base origin.",
  },
  {
    question: "Why might audits fail even when Markdown works?",
    answer:
      "Common causes include a missing Vary: Accept header, wrong Content-Type, or a CDN serving cached HTML for Markdown requests. See troubleshooting for fixes.",
  },
  {
    question: "Why use this instead of curl?",
    answer:
      "You get side-by-side size bars, a pass/fail checklist, multi-URL audits, and an expandable response preview — without assembling several curl commands yourself.",
  },
  {
    question: "What should I do if my site is not supported?",
    answer:
      "Run npx accept-md init in your Next.js or SvelteKit project, then re-run the audit. Start with the docs or install guide.",
  },
];

const faqItems = [
  {
    question: "How do I audit my website for Accept Markdown?",
    answer: (
      <>
        Paste any public URL and click{" "}
        <span className="text-ink-300">Start audit</span>. The tool sends{" "}
        <code className="rounded border border-teal-400/20 bg-teal-400/5 px-1.5 py-0.5 font-mono text-xs text-teal-400">
          Accept: text/markdown
        </code>{" "}
        and{" "}
        <code className="rounded border border-teal-400/20 bg-teal-400/5 px-1.5 py-0.5 font-mono text-xs text-teal-400">
          Accept: text/html
        </code>
        , then scores four production-readiness checks.
      </>
    ),
  },
  {
    question: "What is Accept Markdown?",
    answer: (
      <>
        HTTP content negotiation: the same URL returns HTML for browsers and
        Markdown when a client sends{" "}
        <code className="rounded border border-teal-400/20 bg-teal-400/5 px-1.5 py-0.5 font-mono text-xs text-teal-400">
          Accept: text/markdown
        </code>
        .{" "}
        <Link href="/learn/accept-markdown" className="link-accent">
          Learn the protocol
        </Link>
        .
      </>
    ),
  },
  {
    question: "Does this only work on accept-md sites?",
    answer:
      "No. The audit works on any public http or https URL — your site, a competitor, or a preview deployment.",
  },
  {
    question: 'What does "estimated" mean in the results?',
    answer:
      "If the server did not return Markdown, the audit converts HTML locally to show potential size savings before you add support.",
  },
  {
    question: "Are my URLs or credentials stored?",
    answer:
      "No. URLs and optional Authorization or Cookie values are used only for the outbound check and are not saved.",
  },
  {
    question: "Can I audit multiple pages at once?",
    answer:
      "Yes. Open Advanced options and add paths (one per line), up to 10 URLs per request.",
  },
  {
    question: "Why might audits fail even when Markdown works?",
    answer: (
      <>
        Common causes: missing{" "}
        <code className="rounded border border-teal-400/20 bg-teal-400/5 px-1.5 py-0.5 font-mono text-xs text-teal-400">
          Vary: Accept
        </code>
        , wrong Content-Type, or a CDN serving cached HTML for Markdown requests.{" "}
        <Link href="/docs/troubleshooting" className="link-accent">
          Troubleshooting
        </Link>
        .
      </>
    ),
  },
  {
    question: "Why use this instead of curl?",
    answer:
      "Size bars, pass/fail checklist, multi-URL audits, and response preview — without assembling curl commands yourself.",
  },
  {
    question: "What should I do if my site is not supported?",
    answer: (
      <>
        Run{" "}
        <code className="rounded border border-teal-400/20 bg-teal-400/5 px-1.5 py-0.5 font-mono text-xs text-teal-400">
          npx accept-md init
        </code>{" "}
        in your project, then re-run the audit. See the{" "}
        <Link href="/docs/installation" className="link-accent">
          installation guide
        </Link>
        .
      </>
    ),
  },
];

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: ReactNode;
}) {
  return (
    <details className="group border-b border-white/5 py-4 last:border-b-0">
      <summary className="cursor-pointer list-none text-sm font-medium text-ink-300 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-4">
          {question}
          <span className="shrink-0 font-mono text-xs text-ink-600 transition-transform group-open:rotate-45">
            +
          </span>
        </span>
      </summary>
      <div className="mt-3 text-sm leading-relaxed text-ink-500">{answer}</div>
    </details>
  );
}

export function CheckPageContent() {
  return (
    <div className="border-t border-white/5 pt-16">
      <section>
        <SectionHeader
          label="Checks"
          title="What the audit verifies"
          description="Each URL is fetched twice — as HTML and as Markdown — then scored against the same contract accept-md implements."
        />
        <dl className="mt-8 divide-y divide-white/5 border-y border-white/5">
          {verifyItems.map((item) => (
            <div
              key={item.title}
              className="grid gap-2 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6"
            >
              <dt className="font-mono text-sm font-medium text-teal-400">
                {item.title}
              </dt>
              <dd className="text-sm leading-relaxed text-ink-400">
                {item.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16">
        <SectionHeader
          label="Results"
          title="How to read your report"
        />
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-400">
          <p>
            <span className="font-medium text-emerald-400">Supported</span> —
            the site returned real Markdown for{" "}
            <code className="font-mono text-xs text-teal-400">
              Accept: text/markdown
            </code>
            . All four checks should pass for production.
          </p>
          <p>
            <span className="font-medium text-amber-400">Not detected</span> —
            no live Markdown response. The audit still shows an estimated
            conversion from HTML so you can see potential savings.
          </p>
          <p>
            Expand <span className="text-ink-300">Show response</span> to
            inspect bodies side by side. For context, read{" "}
            <Link href="/learn/accept-markdown" className="link-accent">
              what Accept Markdown means
            </Link>{" "}
            or{" "}
            <Link href="/docs/troubleshooting" className="link-accent">
              troubleshooting
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mt-16">
        <SectionHeader label="FAQ" title="Common questions" />
        <div className="mt-6">
          {faqItems.map((item) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </section>

      <section className="mt-16 pb-8">
        <SectionHeader
          label="CLI"
          title="Test from the command line"
          description="These three commands mirror what the audit does under the hood."
        />
        <div className="mt-8 space-y-4">
          <CodeBlock language="curl" title="Fetch the Markdown body">
            curl -s -H &quot;Accept: text/markdown&quot; https://example.com/page
          </CodeBlock>
          <CodeBlock language="curl" title="Inspect negotiation headers">
            curl -sI -H &quot;Accept: text/markdown&quot; https://example.com/page
          </CodeBlock>
          <CodeBlock language="curl" title="Confirm HTML still works">
            curl -sI -H &quot;Accept: text/html&quot; https://example.com/page
          </CodeBlock>
        </div>
      </section>
    </div>
  );
}
