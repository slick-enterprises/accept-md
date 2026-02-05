import Link from "next/link";
import { Github, FileText, ExternalLink } from "lucide-react";

const FOOTER_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/docs", label: "Docs" },
  { href: "https://github.com/slick-enterprises/accept-md", label: "GitHub", external: true },
  { href: "https://github.com/slick-enterprises/accept-md/issues", label: "Issues", external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-800 bg-ink-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="font-display text-lg font-semibold text-white">
            accept<span className="text-brand-400">.md</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
            {FOOTER_LINKS.map(({ href, label, external }) =>
              external ? (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-ink-400 transition hover:text-white"
                >
                  {label === "GitHub" && <Github className="h-4 w-4" />}
                  {label}
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-1.5 text-ink-400 transition hover:text-white"
                >
                  {label === "Docs" && <FileText className="h-4 w-4" />}
                  {label}
                </Link>
              )
            )}
          </nav>
        </div>
        <div className="mt-8 border-t border-ink-800 pt-8 text-center text-sm text-ink-500">
          MIT License · Serve Markdown from any Next.js page
        </div>
      </div>
    </footer>
  );
}
