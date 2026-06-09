import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { buildSectionMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildSectionMetadata({
  title: "Integrations",
  description:
    "Set up accept-md with Next.js App Router, Pages Router, SvelteKit, and Vercel.",
  path: "/integrations",
});

export default function IntegrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell section="integrations">{children}</AppShell>;
}
