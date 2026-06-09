import Link from "next/link";
import type { ContentItem } from "@/lib/content";

interface ContentCardGridProps {
  items: ContentItem[];
  basePath: string;
}

export function ContentCardGrid({ items, basePath }: ContentCardGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`${basePath}/${item.slug}`}
          className="card-hover rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.05]"
        >
          {item.category && (
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-500">
              {item.category}
            </p>
          )}
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {item.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-400">
            {item.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
