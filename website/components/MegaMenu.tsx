"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { isNavActive, NAV_SECTIONS, type NavSection } from "@/lib/nav";
import { MegaMenuCard } from "./MegaMenuCard";

const CLOSE_DELAY_MS = 200;

interface MegaMenuProps {
  pathname: string;
}

function MegaMenuPanel({ section }: { section: NavSection }) {
  const isAudit = section.id === "audit";
  const featuredCount = section.featured.length;

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          {section.tagline && (
            <p className="text-sm text-ink-400">{section.tagline}</p>
          )}
          <Link
            href={section.href}
            className="link-accent shrink-0 inline-flex items-center gap-1 text-sm font-medium no-underline hover:opacity-80"
          >
            View all {section.label.toLowerCase()}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        <div
          className={`grid gap-4 ${
            isAudit
              ? "grid-cols-1"
              : featuredCount >= 3
                ? "sm:grid-cols-3"
                : "sm:grid-cols-2"
          }`}
        >
          {section.featured.map((item) => (
            <MegaMenuCard key={item.href} {...item} />
          ))}
        </div>
      </div>

      {section.links.length > 0 && (
        <div className="col-span-4 border-l border-white/10 pl-6">
          <p className="section-label mb-4">More</p>
          <ul className="flex flex-col gap-2">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-sm text-ink-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function MegaMenu({ pathname }: MegaMenuProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openSection = useCallback(
    (id: string) => {
      clearCloseTimer();
      setOpenId(id);
    },
    [clearCloseTimer]
  );

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenId(null);
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenId(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  const activeSection = NAV_SECTIONS.find((s) => s.id === openId);

  return (
    <>
      <div
        className="relative flex items-center gap-6"
        onMouseLeave={scheduleClose}
      >
        {NAV_SECTIONS.map((section) => {
          const active = isNavActive(pathname, section.href);
          const isOpen = openId === section.id;

          return (
            <button
              key={section.id}
              type="button"
              className={`relative inline-flex items-center gap-1 py-0.5 text-sm font-medium transition-colors duration-200 ${
                active || isOpen
                  ? "text-white"
                  : "text-ink-400 hover:text-white"
              }`}
              aria-haspopup="true"
              aria-expanded={isOpen}
              onMouseEnter={() => openSection(section.id)}
              onFocus={() => openSection(section.id)}
            >
              {section.label}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
              {(active || isOpen) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-teal-400" />
              )}
            </button>
          );
        })}
      </div>

      {activeSection && (
        <>
          <div
            className="fixed inset-x-0 top-14 z-40 h-4"
            aria-hidden
            onMouseEnter={() => openSection(activeSection.id)}
          />
          <div
            className="fixed inset-x-0 top-16 z-40 animate-fade-in"
            onMouseEnter={() => openSection(activeSection.id)}
            onMouseLeave={scheduleClose}
          >
            <div
              className="pointer-events-none fixed inset-x-0 top-16 bottom-0 bg-[#050505]/92"
              aria-hidden
            />
            <div className="relative border-b border-white/10 bg-[#0a0a0a] shadow-[0_24px_48px_rgba(0,0,0,0.6)]">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl py-8">
                  <MegaMenuPanel section={activeSection} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
