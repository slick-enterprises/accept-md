import Link from "next/link";
import { CodeBlock } from "./CodeBlock";
import { SectionHeader } from "./SectionHeader";

export function Install() {
  return (
    <section
      id="install"
      className="scroll-mt-20 border-t border-white/5 px-4 py-section sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-2xl">
        <SectionHeader
          title="Install"
          description="Run from your project root. The CLI detects your framework, configures rewrites and handlers, and wires up Markdown negotiation."
        />
        <CodeBlock
          language="bash"
          title="Your project root"
          className="mt-10"
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
          <Link href="/docs/installation" className="link-accent font-medium">
            Installation guide
          </Link>{" "}
          — or browse{" "}
          <Link href="/integrations" className="link-accent font-medium">
            framework integrations
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
