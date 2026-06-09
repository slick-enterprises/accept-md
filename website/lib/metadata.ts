import type { Metadata } from "next";
import { OG_IMAGE_URL, SITE_URL } from "@/lib/jsonld";

export function buildOgTitle(pageTitle: string, section?: string): string {
  if (pageTitle.includes("accept-md")) {
    return pageTitle;
  }
  const suffix = section ? ` | accept-md ${section}` : " | accept-md";
  return `${pageTitle}${suffix}`;
}

export interface ArticleMetadataInput {
  title: string;
  description: string;
  url: string;
  keywords?: string[];
  section?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  ogType?: "article" | "website";
  image?: string;
}

export function buildArticleMetadata({
  title,
  description,
  url,
  keywords,
  section,
  publishedTime,
  modifiedTime,
  authors,
  ogType = "article",
  image = OG_IMAGE_URL,
}: ArticleMetadataInput): Metadata {
  const ogTitle = buildOgTitle(title, section);

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    openGraph: {
      title: ogTitle,
      description,
      url,
      type: ogType,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors?.length ? { authors } : {}),
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function buildSectionMetadata({
  title,
  description,
  path,
  section,
  image,
}: {
  title: string;
  description: string;
  path: string;
  section?: string;
  image?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogTitle = buildOgTitle(title, section);
  const ogImage = image ?? OG_IMAGE_URL;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description,
      url,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}
