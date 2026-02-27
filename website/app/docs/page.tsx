import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DocsPage() {
  return (
    <article className="prose prose-invert max-w-none prose-p:text-ink-300 prose-p:leading-relaxed prose-headings:text-white prose-headings:font-display prose-headings:tracking-tight prose-a:text-brand-400 prose-a:no-underline hover:prose-a:text-brand-300 prose-code:rounded-md prose-code:border prose-code:border-ink-700/50 prose-code:bg-ink-900/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-code:text-brand-300 prose-code:font-mono prose-code:text-sm prose-pre:bg-gradient-to-br prose-pre:from-ink-900/90 prose-pre:to-ink-950/80 prose-pre:border prose-pre:border-ink-800/60 prose-pre:rounded-card-lg prose-pre:shadow-lg prose-strong:text-white prose-ul:text-ink-300 prose-ol:text-ink-300 prose-li:text-ink-300 prose-li:leading-relaxed prose-blockquote:border-brand-500/30 prose-blockquote:bg-ink-900/30 prose-blockquote:text-ink-300 prose-blockquote:rounded-lg prose-blockquote:pl-4 prose-blockquote:py-2">
      <p className="section-label">Documentation</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
        Get started
      </h1>
      <p className="mt-4 text-lg text-ink-400">
        Get accept-md running in your Next.js project in minutes.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-white">
          Quick start
        </h2>
        <p className="mt-2 text-ink-300">
          From your Next.js project root, run:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-card-lg border border-ink-800/60 bg-gradient-to-br from-ink-900/90 to-ink-950/80 p-5 font-mono text-sm leading-relaxed text-ink-200 shadow-lg">
          npx accept-md init
        </pre>
        <p className="mt-4 text-ink-400">
          This detects App Router vs Pages Router, creates or updates middleware,
          adds the handler route, and creates{" "}
          <code>accept-md.config.js</code>. Then install dependencies and you’re
          done.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-white">
          SvelteKit support
        </h2>
        <p className="mt-2 text-ink-300">
          accept-md also works with SvelteKit. From your SvelteKit project
          root, run:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-card-lg border border-ink-800/60 bg-gradient-to-br from-ink-900/90 to-ink-950/80 p-5 font-mono text-sm leading-relaxed text-ink-200 shadow-lg">
          npx --yes accept-md@canary init
        </pre>
        <p className="mt-4 text-ink-400">
          This detects your <code>routes/</code> or <code>src/routes/</code>{" "}
          directory and generates{" "}
          <code>src/routes/api/accept-md/[...path]/+server.js</code> (or{" "}
          <code>.ts</code>) plus a shared <code>accept-md.config.js</code>. The{" "}
          <code>@canary</code> tag gives you the latest SvelteKit-aware
          runtime.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-white">
          Usage
        </h2>
        <p className="mt-2 text-ink-300">
          Request any route with the Markdown accept header:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-card-lg border border-ink-800/60 bg-gradient-to-br from-ink-900/90 to-ink-950/80 p-5 font-mono text-sm leading-relaxed text-ink-200 shadow-lg">
          {`curl -H "Accept: text/markdown" https://your-site.com/
curl -H "Accept: text/markdown" https://your-site.com/about
curl -H "Accept: text/markdown" https://your-site.com/posts/123`}
        </pre>
        <p className="mt-4 text-ink-400">
          Normal requests still receive HTML; no performance impact for regular
          users.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-white">
          Configuration
        </h2>
        <p className="mt-2 text-ink-300">
          Edit <code>accept-md.config.js</code> in your project root:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-card-lg border border-ink-800/60 bg-gradient-to-br from-ink-900/90 to-ink-950/80 p-5 font-mono text-sm leading-relaxed text-ink-200 shadow-lg">
          {`/** @type { import('accept-md-runtime').NextMarkdownConfig } */
module.exports = {
  include: ['/**'],
  exclude: ['/api/**', '/_next/**'],
  cleanSelectors: ['nav', 'footer', '.no-markdown'],
  outputMode: 'markdown',
  cache: true,
  baseUrl: process.env.VERCEL_URL ? \`https://\${process.env.VERCEL_URL}\` : undefined,
};`}
        </pre>
        <ul className="mt-4 list-inside list-disc space-y-1.5 text-ink-400">
          <li>
            <strong className="text-ink-200">include</strong> – Glob patterns for
            routes to include
          </li>
          <li>
            <strong className="text-ink-200">exclude</strong> – Glob patterns to
            exclude
          </li>
          <li>
            <strong className="text-ink-200">cleanSelectors</strong> – CSS
            selectors removed before HTML→Markdown
          </li>
          <li>
            <strong className="text-ink-200">cache</strong> – Enable in-memory
            cache for markdown responses
          </li>
          <li>
            <strong className="text-ink-200">transformers</strong> –
            Post-process markdown with <code>(md) =&gt; string</code>
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
          For full details, examples, and contributing, see the{" "}
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
          className="group mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>
      </div>
    </article>
  );
}
