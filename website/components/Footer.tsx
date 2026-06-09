import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GitHubStarWidget } from "./GitHubStarWidget";
import { getFooterLinkGroups } from "@/lib/nav";

const META_LINKS = [
  { href: "/about", label: "About" },
  { href: "/llms.txt", label: "llms.txt", external: true },
  { href: "/feed.xml", label: "RSS", external: true },
  {
    href: "https://github.com/slick-enterprises/accept-md",
    label: "GitHub",
    external: true,
  },
  {
    href: "https://github.com/slick-enterprises/accept-md/issues",
    label: "Issues",
    external: true,
  },
] as const;

function FooterLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const className =
    "inline-flex items-center gap-1 text-sm text-ink-400 transition-colors duration-200 hover:text-white";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function Footer() {
  const linkGroups = getFooterLinkGroups();

  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a]">
      <div className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-12 xl:flex-row xl:gap-10">
            <div className="xl:w-56 xl:shrink-0 2xl:w-64">
              <Link
                href="/"
                className="text-lg font-semibold text-white transition-opacity duration-200 hover:opacity-80"
              >
                accept<span className="text-ink-500">.</span>md
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
                Serve clean Markdown from existing Next.js and SvelteKit pages
                when clients send{" "}
                <code className="rounded border border-teal-400/20 bg-teal-400/5 px-1.5 py-0.5 font-mono text-xs text-teal-400">
                  Accept: text/markdown
                </code>
                .
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/docs/installation"
                  className="btn-primary inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium"
                >
                  Get started
                </Link>
                <GitHubStarWidget variant="badge" />
              </div>
              <p className="mt-6 font-mono text-xs text-ink-500">
                <span className="text-ink-600">$</span> npx accept-md init
              </p>
            </div>

            <div className="grid flex-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
              {linkGroups.map((group) => (
                <nav key={group.id} aria-label={`${group.label} links`}>
                  <p className="section-label">{group.label}</p>
                  <ul className="mt-4 space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <FooterLink href={link.href} label={link.label} />
                      </li>
                    ))}
                    <li>
                      <Link
                        href={group.href}
                        className="inline-flex items-center gap-1 text-sm font-medium text-ink-300 transition-colors duration-200 hover:text-teal-400"
                      >
                        All {group.label}
                        <span aria-hidden>→</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
          <p className="text-center text-sm text-ink-500 sm:text-left">
            <span className="text-ink-400">© {new Date().getFullYear()} accept-md</span>
            <span className="mx-2 text-ink-700" aria-hidden>
              ·
            </span>
            <span>MIT License</span>
          </p>
          <nav
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            aria-label="Site meta links"
          >
            {META_LINKS.map((link) => (
              <FooterLink
                key={link.href}
                href={link.href}
                label={link.label}
                external={"external" in link ? link.external : false}
              />
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
