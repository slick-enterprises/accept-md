import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const siteUrl = "https://accept.md";

export const metadata: Metadata = {
  title: "Learn Accept Markdown",
  description:
    "Learn how Accept: text/markdown works, why AI agents benefit from Markdown, and how to serve Markdown correctly with content negotiation.",
  openGraph: {
    title: "Learn Accept Markdown | accept-md",
    description:
      "Protocol lessons for serving Markdown to AI agents with Accept: text/markdown.",
    url: `${siteUrl}/learn`,
  },
  alternates: {
    canonical: `${siteUrl}/learn`,
  },
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main className="mx-auto max-w-4xl px-4 pt-16 pb-24 sm:px-6 sm:pt-20 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
