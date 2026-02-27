import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/docs", label: "Docs" },
  { href: "https://github.com/slick-enterprises/accept-md", label: "GitHub", external: true },
  { href: "https://github.com/slick-enterprises/accept-md/issues", label: "Issues", external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <Link
            href="/"
            className="text-base font-semibold text-white transition-opacity duration-200 hover:opacity-80"
          >
            accept<span className="text-ink-500">.</span>md
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
            {FOOTER_LINKS.map(({ href, label, external }) =>
              external ? (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-400 transition-colors duration-200 hover:text-white"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className="text-ink-400 transition-colors duration-200 hover:text-white"
                >
                  {label}
                </Link>
              )
            )}
          </nav>
        </div>
        <div className="mt-8 border-t border-white/5 pt-8 text-center text-sm text-ink-500">
          <span className="text-ink-600">MIT License</span>
          <span className="mx-2 text-ink-600">·</span>
          <span>Markdown from any Next.js or SvelteKit page</span>
        </div>
      </div>
    </footer>
  );
}
