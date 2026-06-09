import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Install } from "@/components/Install";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Accept Markdown for Next.js and SvelteKit",
  description:
    "Serve clean Markdown from existing Next.js and SvelteKit pages when agents request Accept: text/markdown. Install accept-md with one command.",
  keywords: [
    "accept markdown",
    "Accept: text/markdown",
    "Next.js markdown",
    "SvelteKit markdown",
    "AI agents markdown",
    "markdown audit",
    "website markdown audit",
  ],
  alternates: {
    canonical: "https://accept.md",
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Install />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
