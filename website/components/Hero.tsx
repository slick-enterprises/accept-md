import Link from "next/link";
import { HttpExchangeDemo } from "./HttpExchangeDemo";

export function Hero() {
  return (
    <section className="px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Serve Markdown from pages you already have
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-400 sm:text-lg">
            Send{" "}
            <code className="rounded border border-teal-400/20 bg-teal-400/5 px-2 py-0.5 font-mono text-sm text-teal-400">
              Accept: text/markdown
            </code>{" "}
            to any route and get clean Markdown back — for crawlers, exports,
            and syndication.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="#install"
              className="btn-primary inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium"
            >
              Get started
            </Link>
            <Link
              href="/markdown-audit"
              className="link-accent text-sm font-medium"
            >
              Run the Markdown audit →
            </Link>
          </div>
        </div>
        <HttpExchangeDemo />
      </div>
    </section>
  );
}
