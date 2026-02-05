"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Github } from "lucide-react";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/docs", label: "Docs" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-800/80 bg-ink-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-white hover:text-brand-400 transition-colors"
        >
          accept<span className="text-brand-400">.md</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-ink-400 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
          <a
            href="https://github.com/hemanthvalsaraj/accept-md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-900/50 px-4 py-2.5 text-sm font-medium text-ink-200 hover:border-ink-600 hover:bg-ink-800/60 hover:text-white transition-colors"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-800 hover:text-white md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-ink-800 bg-ink-950/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-ink-800 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://github.com/hemanthvalsaraj/accept-md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-ink-800 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
