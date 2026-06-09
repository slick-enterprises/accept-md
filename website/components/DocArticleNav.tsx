import Link from "next/link";
import type { ContentItem } from "@/lib/content";

interface DocArticleNavProps {
  prev: ContentItem | null;
  next: ContentItem | null;
  basePath: string;
}

export function DocArticleNav({ prev, next, basePath }: DocArticleNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Article navigation"
      className="mt-16 grid gap-4 border-t border-white/5 pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`${basePath}/${prev.slug}`}
          className="group rounded-lg border border-white/[0.06] p-4 transition-colors hover:border-white/10 hover:bg-white/[0.02]"
        >
          <span className="text-xs text-ink-500">Previous</span>
          <p className="mt-1 text-sm font-medium text-white group-hover:text-teal-400">
            {prev.title}
          </p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`${basePath}/${next.slug}`}
          className="group rounded-lg border border-white/[0.06] p-4 text-right transition-colors hover:border-white/10 hover:bg-white/[0.02] sm:col-start-2"
        >
          <span className="text-xs text-ink-500">Next</span>
          <p className="mt-1 text-sm font-medium text-white group-hover:text-teal-400">
            {next.title}
          </p>
        </Link>
      ) : null}
    </nav>
  );
}
