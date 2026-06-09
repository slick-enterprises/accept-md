import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ContentCollection = "docs" | "learn" | "integrations";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ContentItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  order: number;
  category: string;
  keywords: string[];
  content: string;
  faq: FaqItem[];
}

const contentRoot = path.join(process.cwd(), "content");

function normalizeFaq(data: unknown): FaqItem[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter(
      (item): item is { question: string; answer: string } =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as FaqItem).question === "string" &&
        typeof (item as FaqItem).answer === "string"
    )
    .map(({ question, answer }) => ({ question, answer }));
}

function getCollectionDirectory(collection: ContentCollection) {
  return path.join(contentRoot, collection);
}

function readContentItem(collection: ContentCollection, fileName: string): ContentItem {
  const slug = fileName.replace(/\.md$/, "");
  const fullPath = path.join(getCollectionDirectory(collection), fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    date: data.date || "",
    updated: data.updated || data.date || "",
    order: Number(data.order ?? 999),
    category: data.category || "",
    keywords: data.keywords || [],
    content,
    faq: normalizeFaq(data.faq),
  };
}

export function getAllContent(collection: ContentCollection): ContentItem[] {
  const directory = getCollectionDirectory(collection);

  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => readContentItem(collection, fileName))
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }

      return a.title.localeCompare(b.title);
    });
}

export function getContentItem(
  collection: ContentCollection,
  slug: string
): ContentItem | null {
  try {
    const fileName = `${slug}.md`;
    const fullPath = path.join(getCollectionDirectory(collection), fileName);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    return readContentItem(collection, fileName);
  } catch {
    return null;
  }
}

export function getAllContentSlugs(collection: ContentCollection): string[] {
  const directory = getCollectionDirectory(collection);

  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

export function getAdjacentContent(
  collection: ContentCollection,
  slug: string
): { prev: ContentItem | null; next: ContentItem | null } {
  const items = getAllContent(collection);
  const index = items.findIndex((item) => item.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? items[index - 1] : null,
    next: index < items.length - 1 ? items[index + 1] : null,
  };
}
