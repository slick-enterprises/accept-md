"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Github } from "lucide-react";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/blog", label: "Blog" },
  { href: "/docs", label: "Docs" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 pt-4 pb-4">
      {/* Floating nav container with glassmorphism */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl border border-ink-800/50 bg-ink-950/90 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5),0_0_0_1px_rgba(139,92,246,0.1)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/8 before:via-white/3 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100">
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-500/8 via-brand-500/3 to-transparent pointer-events-none"></div>
          {/* Subtle border glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-500/0 via-brand-500/5 to-brand-500/0 pointer-events-none opacity-0 transition-opacity duration-500 hover:opacity-100"></div>
          
          <div className="relative flex h-14 items-center justify-between px-4 sm:px-6">
            <Link
              href="/"
              className="group relative inline-flex items-baseline gap-1 font-display text-xl font-bold tracking-tight transition-all duration-300"
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

            <nav className="hidden items-center gap-3 md:flex">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="group relative rounded-lg px-3 py-1.5 text-sm font-medium text-ink-400 transition-all duration-200 hover:bg-ink-800/40 hover:text-white"
                >
                  {label}
                  <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-brand-400 transition-all duration-300 group-hover:w-[calc(100%-0.5rem)]"></span>
                </Link>
              ))}
              <a
                href="https://github.com/slick-enterprises/accept-md"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary group relative ml-2 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
              >
                <Github className="relative z-10 h-4 w-4" />
                <span className="relative z-10">GitHub</span>
              </a>
            </nav>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-400 transition-all duration-200 hover:bg-ink-800/40 hover:text-white md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-ink-800/40 bg-ink-950/95 backdrop-blur-2xl shadow-xl px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 transition-all duration-200 hover:bg-ink-800/40 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <a
                href="https://github.com/slick-enterprises/accept-md"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary group relative mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                <Github className="relative z-10 h-4 w-4" />
                <span className="relative z-10">GitHub</span>
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
