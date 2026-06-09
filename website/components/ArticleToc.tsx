interface TocHeading {
  id: string;
  text: string;
  level: number;
}

interface ArticleTocProps {
  headings: TocHeading[];
}

export function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/`/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    headings.push({ id, text, level });
  }

  return headings;
}

export function ArticleToc({ headings }: ArticleTocProps) {
  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="mb-8 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 lg:hidden"
    >
      <p className="section-label mb-3">On this page</p>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: heading.level === 3 ? "0.75rem" : 0 }}
          >
            <a
              href={`#${heading.id}`}
              className="text-ink-400 transition-colors hover:text-teal-400"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
