import Link from "next/link";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/CodeBlock";

const verifyItems = [
  {
    title: "Markdown response",
    description:
      "Returns HTTP 200 with Content-Type: text/markdown and a body that is actually Markdown, not HTML.",
  },
  {
    title: "HTML fallback",
    description:
      "Normal browser requests still get text/html with a successful response — your pages stay unchanged.",
  },
  {
    title: "Vary: Accept",
    description:
      "Caches and CDNs know to store separate representations so Markdown and HTML do not collide.",
  },
  {
    title: "Distinct representations",
    description:
      "Live Markdown differs from HTML, or the estimated conversion shows meaningful size savings.",
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
        Paste any public URL into the Markdown Audit tool and click{" "}
        <span className="text-ink-300">Start audit</span>. The tool sends real
        HTTP requests with{" "}
        <code className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-xs text-ink-300">
          Accept: text/markdown
        </code>{" "}
        and{" "}
        <code className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-xs text-ink-300">
          Accept: text/html
        </code>
        , then scores the responses against four production-readiness checks.
      </>
    ),
  },
  {
    question: "What is Accept Markdown?",
    answer: (
      <>
        Accept Markdown is HTTP content negotiation: the same URL returns HTML
        for browsers and Markdown when a client sends{" "}
        <code className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-xs text-ink-300">
          Accept: text/markdown
        </code>
        .{" "}
        <Link
          href="/learn/accept-markdown"
          className="text-ink-300 underline decoration-white/20 underline-offset-2 hover:text-white"
        >
          Learn the protocol
        </Link>
        .
      </>
    ),
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
    answer: (
      <>
        Common causes include a missing{" "}
        <code className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-xs text-ink-300">
          Vary: Accept
        </code>{" "}
        header, wrong Content-Type, or a CDN serving cached HTML for Markdown
        requests. See{" "}
        <Link
          href="/docs/troubleshooting"
          className="text-ink-300 underline decoration-white/20 underline-offset-2 hover:text-white"
        >
          troubleshooting
        </Link>{" "}
        for fixes.
      </>
    ),
  },
  {
    question: "Why use this instead of curl?",
    answer:
      "You get side-by-side size bars, a pass/fail checklist, multi-URL audits, and an expandable response preview — without assembling several curl commands yourself.",
  },
  {
    question: "What should I do if my site is not supported?",
    answer: (
      <>
        Run{" "}
        <code className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-xs text-ink-300">
          npx accept-md init
        </code>{" "}
        in your Next.js or SvelteKit project, then re-run the audit. Start with the{" "}
        <Link
          href="/docs"
          className="text-ink-300 underline decoration-white/20 underline-offset-2 hover:text-white"
        >
          docs
        </Link>{" "}
        or{" "}
        <Link
          href="/#install"
          className="text-ink-300 underline decoration-white/20 underline-offset-2 hover:text-white"
        >
          install guide
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
          <span className="shrink-0 text-ink-600 transition-transform group-open:rotate-45">
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
    <div className="mx-auto max-w-4xl px-4 pt-16 sm:px-6 lg:px-8">
      <section>
        <p className="section-label">What we verify</p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Four checks for production-ready negotiation
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-400 sm:text-base">
          Each URL is fetched twice — once as HTML, once as Markdown — then
          scored against the same contract accept-md implements.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {verifyItems.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <p className="section-label">Results</p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          How to read your report
        </h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-400 sm:text-base">
          <p>
            <span className="font-medium text-emerald-400/90">Supported</span>{" "}
            means the site returned real Markdown for{" "}
            <code className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-xs text-ink-300">
              Accept: text/markdown
            </code>
            . All four checks should pass for a production-ready setup.
          </p>
          <p>
            <span className="font-medium text-amber-400/90">Not detected</span>{" "}
            means no live Markdown response was found. The audit still shows an{" "}
            <span className="text-ink-300">estimated</span> conversion from HTML
            so you can see potential token and bandwidth savings before adding
            support.
          </p>
          <p>
            Expand{" "}
            <span className="text-ink-300">Show response</span> to inspect raw
            HTML and Markdown bodies side by side. For deeper context, read{" "}
            <Link
              href="/learn/accept-markdown"
              className="text-ink-300 underline decoration-white/20 underline-offset-2 hover:text-white"
            >
              what Accept Markdown means
            </Link>
            , check{" "}
            <Link
              href="/docs/troubleshooting"
              className="text-ink-300 underline decoration-white/20 underline-offset-2 hover:text-white"
            >
              troubleshooting
            </Link>
            , or{" "}
            <Link
              href="/#install"
              className="text-ink-300 underline decoration-white/20 underline-offset-2 hover:text-white"
            >
              install accept-md
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mt-16">
        <p className="section-label">FAQ</p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Common questions
        </h2>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-5 sm:px-6">
          {faqItems.map((item) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <p className="section-label">Command line</p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Test from the command line
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-400 sm:text-base">
          Prefer curl? These three commands mirror what the audit does under
          the hood.
        </p>
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

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        <Link
          href="/docs"
          className="card-hover rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        >
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Read the docs
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-400">
            Install, configure, and operate accept-md in production.
          </p>
        </Link>
        <Link
          href="/learn"
          className="card-hover rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        >
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Learn the protocol
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-400">
            Understand content negotiation, caching, and AI retrieval.
          </p>
        </Link>
        <Link
          href="/#install"
          className="card-hover rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        >
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Get started
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-400">
            Add Accept Markdown to your Next.js or SvelteKit project.
          </p>
        </Link>
      </section>
    </div>
  );
}
