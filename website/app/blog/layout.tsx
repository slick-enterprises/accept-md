import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { buildSectionMetadata } from "@/lib/metadata";
import { BLOG_OG_IMAGE_URL, SITE_URL } from "@/lib/jsonld";

const sectionMetadata = buildSectionMetadata({
  title: "Blog",
  description:
    "Guides and best practices for serving Markdown from Next.js and SvelteKit — AI crawlers, content syndication, and more.",
  path: "/blog",
  image: BLOG_OG_IMAGE_URL,
});

export const metadata: Metadata = {
  ...sectionMetadata,
  alternates: {
    ...sectionMetadata.alternates,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell section="blog">{children}</AppShell>;
}
