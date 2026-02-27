import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const siteUrl = "https://accept.md";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides and best practices for serving Markdown from Next.js and SvelteKit — AI crawlers, content syndication, and more.",
  openGraph: {
    title: "Blog | accept-md",
    description:
      "Guides and best practices for serving Markdown from Next.js and SvelteKit.",
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
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pt-16 pb-24 sm:px-6 sm:pt-20 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
