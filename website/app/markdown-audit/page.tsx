import type { Metadata } from "next";
import { CheckPageContent, faqSchemaItems } from "@/components/CheckPageContent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { UrlChecker } from "@/components/UrlChecker";

const siteUrl = "https://accept.md";
const pageUrl = `${siteUrl}/markdown-audit`;

const title = "Website Markdown Audit — Test Accept Markdown Support";
const description =
  "Free Markdown audit tool: paste any URL to test Accept: text/markdown responses, compare HTML vs Markdown size, verify Vary: Accept, and get a production-readiness report.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "markdown audit",
    "audit website markdown",
    "Accept: text/markdown test",
    "content negotiation audit",
    "Vary Accept",
    "AI crawler markdown",
  ],
  openGraph: {
    title: `${title} | accept-md`,
    description,
    url: pageUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | accept-md`,
    description,
  },
  alternates: {
    canonical: pageUrl,
  },
};

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Markdown Audit",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  url: pageUrl,
  description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Markdown response verification",
    "HTML fallback check",
    "Vary: Accept header audit",
    "Distinct representation comparison",
  ],
  author: {
    "@type": "Organization",
    name: "accept-md",
    url: "https://github.com/slick-enterprises/accept-md",
  },
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqSchemaItems.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Markdown Audit",
      item: pageUrl,
    },
  ],
};

export default function MarkdownAuditPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <main className="pb-16">
        <UrlChecker />
        <CheckPageContent />
      </main>
      <Footer />
    </div>
  );
}
