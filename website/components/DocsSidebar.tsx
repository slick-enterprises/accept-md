"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ContentItem } from "@/lib/content";

interface DocsSidebarProps {
  items: ContentItem[];
  currentSlug?: string;
}

export function DocsSidebar({ items, currentSlug }: DocsSidebarProps) {
  const pathname = usePathname();

  const nav = (
    <ul className="space-y-1">
      {items.map((item) => {
        const href = `/docs/${item.slug}`;
        const isActive =
          currentSlug === item.slug || pathname === href;

        return (
          <li key={item.slug}>
            <Link
              href={href}
              className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "border-l-2 border-teal-400 bg-white/[0.04] pl-[10px] font-medium text-white"
                  : "text-ink-400 hover:bg-white/[0.03] hover:text-ink-200"
              }`}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <nav aria-label="Documentation">
      <details className="group lg:hidden">
        <summary className="cursor-pointer list-none rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm font-medium text-ink-300">
          <span className="flex items-center justify-between">
            Browse docs
            <span className="text-ink-500 group-open:rotate-180 transition-transform">
              ▾
            </span>
          </span>
        </summary>
        <div className="mt-2 px-1">{nav}</div>
      </details>
      <div className="hidden lg:block">
        <p className="section-label mb-4">Docs</p>
        {nav}
      </div>
    </nav>
  );
}
