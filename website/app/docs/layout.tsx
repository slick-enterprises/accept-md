import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { DocsSidebar } from "@/components/DocsSidebar";
import { buildSectionMetadata } from "@/lib/metadata";
import { DOCS_OG_IMAGE_URL } from "@/lib/jsonld";
import { getAllContent } from "@/lib/content";

export const metadata: Metadata = buildSectionMetadata({
  title: "Documentation",
  description:
    "accept-md docs: install, configure, and operate Accept Markdown support for any Next.js or SvelteKit route.",
  path: "/docs",
  section: "Docs",
  image: DOCS_OG_IMAGE_URL,
});

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docs = getAllContent("docs");

  return (
    <AppShell section="docs" sidebar={<DocsSidebar items={docs} />}>
      {children}
    </AppShell>
  );
}
