"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { GitHubStarWidget } from "./GitHubStarWidget";
import { SiteSearchForm } from "./SiteSearchForm";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="text-lg font-semibold text-white transition-opacity duration-200 hover:opacity-80"
            >
              accept<span className="text-ink-500">.</span>md
            </Link>

            <nav className="hidden items-center gap-6 lg:flex">
              <MegaMenu pathname={pathname} />
              <div className="w-52 xl:w-64">
                <SiteSearchForm compact id="header-site-search" />
              </div>
              <GitHubStarWidget className="px-4 py-2" />
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
      </div>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-[#0a0a0a] px-4 py-4 md:hidden">
          <div className="mb-4">
            <SiteSearchForm compact id="mobile-site-search" />
          </div>
          <MobileNav pathname={pathname} onNavigate={closeMobile} />
          <GitHubStarWidget
            className="mt-4 w-full justify-center px-4 py-2.5"
            onClick={closeMobile}
          />
        </div>
      )}
    </header>
  );
}
