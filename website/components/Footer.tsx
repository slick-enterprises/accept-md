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
    <footer className="border-t border-ink-800/50 bg-gradient-to-b from-ink-950 via-ink-950 to-ink-900/40 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <Link
            href="/"
            className="group relative inline-flex items-baseline gap-1 font-display text-lg font-semibold transition-all duration-300"
          >
            {/* Main text */}
            <span className="relative z-10 text-white transition-all duration-300 group-hover:text-brand-200">
              accept
            </span>
            {/* Dot separator */}
            <span className="relative z-10 text-brand-400 transition-all duration-300 group-hover:text-brand-300">.</span>
            {/* Extension with gradient accent */}
            <span className="relative z-10 inline-flex items-baseline">
              <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-400 bg-clip-text text-transparent bg-[length:200%_100%] transition-all duration-500 group-hover:bg-[position:100%_0%]">
                md
              </span>
              {/* Animated underline accent */}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500 transition-all duration-500 group-hover:w-full"></span>
            </span>
            {/* Subtle glow effect on hover */}
            <span className="absolute -inset-2 rounded-lg bg-brand-500/0 blur-md transition-all duration-300 group-hover:bg-brand-500/10"></span>
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
            {FOOTER_LINKS.map(({ href, label, external }) =>
              external ? (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-ink-400 transition-colors hover:text-white"
                >
                  {label === "GitHub" && <Github className="h-4 w-4 transition-transform group-hover:scale-110" />}
                  {label}
                  <ExternalLink className="h-3.5 w-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className="group inline-flex items-center gap-1.5 text-ink-400 transition-colors hover:text-white"
                >
                  {label === "Docs" && <FileText className="h-4 w-4 transition-transform group-hover:scale-110" />}
                  {label}
                </Link>
              )
            )}
          </nav>
        </div>
        <div className="mt-8 border-t border-ink-800/50 pt-8 text-center text-sm text-ink-500">
          <span className="text-ink-600">MIT License</span>
          <span className="mx-2 text-ink-700">·</span>
          <span className="text-ink-500">Serve Markdown from any Next.js page</span>
        </div>
      </div>
    </footer>
  );
}
