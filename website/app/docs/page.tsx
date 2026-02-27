import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";

export default function DocsPage() {
  return (
    <article className="prose prose-invert max-w-none prose-p:text-ink-300 prose-p:leading-relaxed prose-headings:text-white prose-headings:font-display prose-headings:tracking-tight prose-a:text-brand-400 prose-a:no-underline hover:prose-a:text-brand-300 prose-code:rounded prose-code:border prose-code:border-white/10 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:text-ink-300 prose-code:before:content-none prose-code:after:content-none prose-pre_[code]:border-0 prose-pre_[code]:bg-transparent prose-pre_[code]:p-0 prose-strong:text-white prose-ul:text-ink-300 prose-ol:text-ink-300 prose-li:text-ink-300 prose-li:leading-relaxed prose-blockquote:border-brand-500/30 prose-blockquote:bg-ink-900/30 prose-blockquote:text-ink-300 prose-blockquote:rounded-lg prose-blockquote:pl-4 prose-blockquote:py-2">
      <p className="section-label">Documentation</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
        Quick Start
      </h1>
      <p className="mt-4 text-lg text-ink-400">
        Add accept-md to a Next.js or SvelteKit project in under two minutes.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-white">
          Install
        </h2>
        <p className="mt-2 text-ink-300">
          Run from your project root:
        </p>
        <CodeBlock language="bash" title="Terminal" className="mt-4">
          npx accept-md init
        </CodeBlock>
        <p className="mt-4 text-ink-400">
          The CLI detects your router, creates middleware, adds the handler route,
          and writes <code>accept-md.config.js</code>. Install dependencies and
          you&apos;re done.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-white">
          SvelteKit support
        </h2>
        <p className="mt-2 text-ink-300">
          The same CLI works for SvelteKit. From your project root:
        </p>
        <CodeBlock language="bash" title="Terminal" className="mt-4">
          npx accept-md init
        </CodeBlock>
        <p className="mt-4 text-ink-400">
          The CLI detects <code>routes/</code> or <code>src/routes/</code>,
          generates the handler at{" "}
          <code>src/routes/api/accept-md/[...path]/+server.js</code> (or{" "}
          <code>.ts</code>), writes <code>accept-md.config.js</code>, and wires
          up <code>src/hooks.server</code>. Works on Vercel out of the box.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-white">
          Usage
        </h2>
        <p className="mt-2 text-ink-300">
          Request any route with the <code>Accept: text/markdown</code> header:
        </p>
        <CodeBlock language="curl" title="Example requests" className="mt-4">
          {`curl -H "Accept: text/markdown" https://your-site.com/
curl -H "Accept: text/markdown" https://your-site.com/about
curl -H "Accept: text/markdown" https://your-site.com/posts/123`}
        </CodeBlock>
        <p className="mt-4 text-ink-400">
          Standard requests still receive HTML. No performance impact for regular visitors.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-white">
          Configuration
        </h2>
        <p className="mt-2 text-ink-300">
          Edit <code>accept-md.config.js</code> in your project root:
        </p>
        <CodeBlock
          language="javascript"
          title="accept-md.config.js"
          className="mt-4"
        >
          {`/** @type { import('accept-md-runtime').NextMarkdownConfig } */
module.exports = {
  include: ['/**'],
  exclude: ['/api/**', '/_next/**'],
  cleanSelectors: ['nav', 'footer', '.no-markdown'],
  outputMode: 'markdown',
  cache: true,
  baseUrl: process.env.VERCEL_URL ? \`https://\${process.env.VERCEL_URL}\` : undefined,
};`}
        </CodeBlock>
        <ul className="mt-4 list-inside list-disc space-y-1.5 text-ink-400">
          <li>
            <strong className="text-ink-200">include</strong> – Route glob patterns to serve as Markdown
          </li>
          <li>
            <strong className="text-ink-200">exclude</strong> – Route glob patterns to skip
          </li>
          <li>
            <strong className="text-ink-200">cleanSelectors</strong> – CSS selectors stripped before conversion
          </li>
          <li>
            <strong className="text-ink-200">cache</strong> – In-memory cache for Markdown responses
          </li>
          <li>
            <strong className="text-ink-200">transformers</strong> – Post-process
            Markdown via <code>(md) =&gt; string</code>
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-white">CLI</h2>
        <ul className="mt-4 space-y-2 text-ink-300">
          <li>
            <code>npx accept-md init [path]</code> – Set up middleware and
            handler
          </li>
          <li>
            <code>npx accept-md doctor [path]</code> – Report detected router,
            routes, and issues
          </li>
          <li>
            <code>npx accept-md fix-routes [path]</code> – Fix Next.js 15+
            dataRoutes manifest if needed
          </li>
        </ul>
      </section>

      <div className="mt-16 rounded-card-lg border border-ink-800/60 bg-gradient-to-br from-ink-900/50 to-ink-950/80 p-6 backdrop-blur-sm">
        <p className="text-ink-300 leading-relaxed">
          Full API reference, examples, and contribution guide on{" "}
          <a
            href="https://github.com/slick-enterprises/accept-md#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-400 underline decoration-brand-500/50 underline-offset-4 transition-colors hover:text-brand-300 hover:decoration-brand-400"
          >
            GitHub README
          </a>
          .
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center text-sm font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          Back to home
        </Link>
      </div>
    </article>
  );
}
