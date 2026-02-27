"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Zap, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/blog", label: "Blog" },
  { href: "/docs", label: "Docs" },
];

const HERO_HIDE_THRESHOLD = 400;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= HERO_HIDE_THRESHOLD) {
        setNavVisible(true);
      } else {
        setNavVisible(y < lastY);
      }
      lastY = y;
    };
    onScroll(); // sync initial state when already scrolled
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md transition-transform duration-300 ease-out"
      style={{ transform: navVisible ? "translateY(0)" : "translateY(-100%)" }}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/5 bg-ink-500/10 px-4 py-2 text-sm font-medium text-ink-300">
        <Zap className="h-4 w-4 shrink-0 text-amber-400" fill="currentColor" strokeWidth={0} aria-hidden />
        <span>
          <span className="font-semibold text-white">v4.07.</span> now supports SvelteKit Projects
        </span>
        <Link
          href="/docs"
          className="ml-1 inline-flex shrink-0 items-center gap-0.5 text-ink-300 transition-colors hover:text-white"
        >
          Read docs
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold text-white transition-opacity duration-200 hover:opacity-80"
          >
            accept<span className="text-ink-500">.</span>md
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-ink-400 transition-colors duration-200 hover:text-white"
              >
                {label}
              </Link>
            ))}
            <a
              href="https://github.com/slick-enterprises/accept-md"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium"
            >
              GitHub
            </a>
          </nav>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-400 transition-colors duration-200 hover:bg-white/5 hover:text-white md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-[#0a0a0a] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://github.com/slick-enterprises/accept-md"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-2 inline-flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
