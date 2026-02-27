import Link from "next/link";
import { CodeBlock } from "./CodeBlock";

export function Install() {
  return (
    <section
      id="install"
      className="scroll-mt-20 border-t border-white/5 px-4 py-section sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-2xl">
        <p className="section-label">Install</p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          One command. Done.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-400">
          Run from your project root. The CLI detects your framework, configures
          middleware or hooks, and wires up the handler — deploy-ready on Vercel.
        </p>
        <CodeBlock
          language="bash"
          title="Your project root"
          className="mt-10 transition-colors duration-200 hover:border-white/[0.1] hover:bg-white/[0.03]"
        >
          <span className="text-ink-600">$</span>{" "}
          <span className="text-ink-200">npx accept-md init</span>
          {"\n\n"}
          <span className="text-ink-600"># Then install deps</span>
          {"\n"}
          <span className="text-ink-600">$</span>{" "}
          <span className="text-ink-300">pnpm install</span>
        </CodeBlock>
        <p className="mt-6 text-sm text-ink-400">
          <Link
            href="/docs"
            className="font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white/50"
          >
            Full documentation
          </Link>{" "}
          — configuration, CLI commands, and manual setup.
        </p>
      </div>
    </section>
  );
}
