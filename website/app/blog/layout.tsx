import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const siteUrl = "https://accept.md";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Learn about Next.js markdown conversion, AI crawlers, and best practices for serving Markdown from your Next.js applications.",
  openGraph: {
    title: "Blog | accept-md",
    description:
      "Learn about Next.js markdown conversion, AI crawlers, and best practices.",
    url: `${siteUrl}/blog`,
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink-950">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
