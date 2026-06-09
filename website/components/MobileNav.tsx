"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { isNavActive, NAV_SECTIONS } from "@/lib/nav";
import { MegaMenuCard } from "./MegaMenuCard";

interface MobileNavProps {
  pathname: string;
  onNavigate: () => void;
}

export function MobileNav({ pathname, onNavigate }: MobileNavProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <nav className="flex flex-col gap-1">
      {NAV_SECTIONS.map((section) => {
        const active = isNavActive(pathname, section.href);
        const isExpanded = expandedId === section.id;

        return (
          <div key={section.id} className="rounded-lg border border-white/[0.04]">
            <button
              type="button"
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                active
                  ? "bg-white/[0.04] text-teal-400"
                  : "text-ink-300 hover:bg-white/5 hover:text-white"
              }`}
              aria-expanded={isExpanded}
              onClick={() => toggleSection(section.id)}
            >
              {section.label}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>

            {isExpanded && (
              <div className="space-y-3 border-t border-white/5 px-3 py-3">
                {section.tagline && (
                  <p className="text-xs text-ink-500">{section.tagline}</p>
                )}

                <div className="flex flex-col gap-3">
                  {section.featured.map((item) => (
                    <MegaMenuCard
                      key={item.href}
                      {...item}
                      onClick={onNavigate}
                    />
                  ))}
                </div>

                {section.links.length > 0 && (
                  <ul className="flex flex-col gap-1.5 pt-1">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block rounded-md px-2 py-1.5 text-sm text-ink-400 transition-colors hover:bg-white/5 hover:text-white"
                          onClick={onNavigate}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  href={section.href}
                  className="link-accent inline-flex text-sm font-medium"
                  onClick={onNavigate}
                >
                  View all {section.label.toLowerCase()}
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
