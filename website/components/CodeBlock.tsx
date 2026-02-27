import { Code2, Terminal } from "lucide-react";

const LANGUAGE_LABELS: Record<string, string> = {
  bash: "bash",
  sh: "sh",
  shell: "shell",
  curl: "curl",
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
  json: "json",
  html: "html",
  css: "css",
  markdown: "markdown",
  md: "markdown",
  text: "plain text",
  plaintext: "plain text",
};

function getLanguageLabel(lang: string): string {
  const normalized = lang.toLowerCase().replace(/^language-/, "");
  return LANGUAGE_LABELS[normalized] ?? normalized;
}

export interface CodeBlockProps {
  /** Language for syntax and label (e.g. "bash", "javascript", "curl") */
  language: string;
  /** Optional title shown in header (e.g. "Terminal", "accept-md.config.js") */
  title?: string;
  /** Optional filename for display */
  filename?: string;
  /** Show terminal icon when language is shell-like */
  showIcon?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({
  language,
  title,
  filename,
  showIcon = true,
  children,
  className = "",
}: CodeBlockProps) {
  const label = getLanguageLabel(language);
  const isShell = /^(bash|sh|shell|curl)$/.test(label);
  const Icon = showIcon && isShell ? Terminal : Code2;

  return (
    <div
      className={`code-block overflow-hidden rounded-xl border border-white/[0.06] bg-black/20 ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3 text-xs text-ink-500">
        <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
        {title && <span>{title}</span>}
        {filename && !title && <span>{filename}</span>}
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed text-ink-300">
        <code data-language={language}>{children}</code>
      </pre>
    </div>
  );
}
