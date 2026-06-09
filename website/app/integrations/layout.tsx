import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const siteUrl = "https://accept.md";

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "Set up accept-md with Next.js App Router, Pages Router, SvelteKit, and Vercel.",
  openGraph: {
    title: "Integrations | accept-md",
    description:
      "Framework-specific setup paths for serving Markdown with Accept: text/markdown.",
    url: `${siteUrl}/integrations`,
  },
  alternates: {
    canonical: `${siteUrl}/integrations`,
  },
};

export default function IntegrationsLayout({
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
