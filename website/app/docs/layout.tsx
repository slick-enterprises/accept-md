import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const siteUrl = "https://accept.md";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "accept-md documentation: installation, configuration, CLI, and usage for serving Markdown from Next.js pages.",
  openGraph: {
    title: "Documentation | accept-md",
    description:
      "Install, configure, and use accept-md to serve Markdown from any Next.js page.",
    url: `${siteUrl}/docs`,
  },
  alternates: {
    canonical: `${siteUrl}/docs`,
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink-950">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
