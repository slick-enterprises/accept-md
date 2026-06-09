import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { ContentCard } from "./ContentCard";

interface ContentCardGridProps {
  items: ContentItem[];
  basePath: string;
}

export function ContentCardGrid({ items, basePath }: ContentCardGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <ContentCard key={item.slug} href={`${basePath}/${item.slug}`}>
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
        </ContentCard>
      ))}
    </div>
  );
}

interface ContentListProps {
  items: ContentItem[];
  basePath: string;
}

export function ContentList({ items, basePath }: ContentListProps) {
  return (
    <ul className="divide-y divide-white/5">
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={`${basePath}/${item.slug}`}
            className="group block py-5 transition-colors first:pt-0 last:pb-0"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="font-display text-lg font-semibold text-white transition-colors group-hover:text-teal-400">
                {item.title}
              </h2>
              {item.date && (
                <time
                  dateTime={item.date}
                  className="shrink-0 text-sm text-ink-500"
                >
                  {new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              {item.description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

interface IntegrationListProps {
  items: ContentItem[];
  basePath: string;
}

export function IntegrationList({ items, basePath }: IntegrationListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] bg-white/[0.02]">
            <th className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wider text-ink-500">
              Framework
            </th>
            <th className="hidden px-4 py-3 font-mono text-xs font-medium uppercase tracking-wider text-ink-500 sm:table-cell">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.slug}
              className="border-b border-white/[0.06] last:border-0"
            >
              <td className="px-4 py-4">
                <Link
                  href={`${basePath}/${item.slug}`}
                  className="font-mono text-teal-400 transition-colors hover:text-teal-300"
                >
                  {item.title}
                </Link>
              </td>
              <td className="hidden px-4 py-4 text-ink-400 sm:table-cell">
                {item.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
