import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { buildGlobalSchemaGraph, SITE_URL } from "@/lib/jsonld";
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

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

const siteUrl = SITE_URL;

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

const globalSchemaGraph = buildGlobalSchemaGraph();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${sourceSerif.variable}`}
    >
      <head>
        <JsonLd data={globalSchemaGraph} />
      </head>
      <body className="min-h-screen font-sans antialiased bg-[#0a0a0a] text-ink-50">
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
