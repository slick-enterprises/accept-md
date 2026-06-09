import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

const siteUrl = "https://accept.md";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "accept-md | Accept Markdown for Next.js and SvelteKit",
    template: "%s | accept-md",
  },
  description:
    "Add Accept Markdown support to any Next.js or SvelteKit route via Accept: text/markdown. Serve clean Markdown for AI agents, docs export, and content syndication with zero page changes.",
  keywords: [
    "accept markdown",
    "Accept: text/markdown",
    "next.js",
    "sveltekit",
    "markdown",
    "content negotiation",
    "accept-header",
    "SSG",
    "SSR",
    "AI crawlers",
    "LLM",
    "content syndication",
    "documentation export",
    "vercel",
  ],
  authors: [{ name: "accept-md", url: "https://github.com/slick-enterprises/accept-md" }],
  creator: "accept-md",
  publisher: "accept-md",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "accept-md",
    title: "accept-md | Accept Markdown for Next.js and SvelteKit",
    description:
      "Serve clean Markdown from existing Next.js and SvelteKit routes with Accept: text/markdown. Built for AI agents, docs export, and content syndication.",
  },
  twitter: {
    card: "summary_large_image",
    title: "accept-md | Accept Markdown for Next.js and SvelteKit",
    description:
      "Add Accept Markdown support to any Next.js or SvelteKit page. Built for AI agents, docs export, and content syndication.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "accept-md",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description:
    "Add Accept Markdown support to Next.js and SvelteKit routes when clients send Accept: text/markdown. Zero page changes. Works with App Router, Pages Router, SSG, SSR, ISR, and SvelteKit.",
  url: siteUrl,
  applicationSubCategory: "Content Negotiation",
  potentialAction: {
    "@type": "UseAction",
    target: `${siteUrl}/markdown-audit`,
    name: "Run Markdown Audit",
  },
  author: {
    "@type": "Organization",
    name: "accept-md",
    url: "https://github.com/slick-enterprises/accept-md",
  },
  codeRepository: "https://github.com/slick-enterprises/accept-md",
  license: "https://opensource.org/licenses/MIT",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "accept-md",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    "Open-source tooling that serves Markdown from any Next.js or SvelteKit page via Accept: text/markdown. Built for AI agents, docs export, and content syndication.",
  sameAs: [
    "https://github.com/slick-enterprises/accept-md",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Technical Support",
    url: "https://github.com/slick-enterprises/accept-md/issues",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased bg-[#0a0a0a] text-ink-50 bg-grid relative z-10">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KHJV0Y5CRX"
          strategy="afterInteractive"
        />
        <Script id="ga4-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KHJV0Y5CRX');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
