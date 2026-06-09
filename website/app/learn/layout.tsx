import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { buildSectionMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildSectionMetadata({
  title: "Learn Accept Markdown",
  description:
    "Learn how Accept: text/markdown works, why AI agents benefit from Markdown, and how to serve Markdown correctly with content negotiation.",
  path: "/learn",
});

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell section="learn">{children}</AppShell>;
}
