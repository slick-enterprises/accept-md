import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
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
  themeColor: "#0c0c0e",
  width: "device-width",
  initialScale: 1,
};

const siteUrl = "https://accept.md";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "accept-md | Serve Markdown from Any Next.js Page",
    template: "%s | accept-md",
  },
  description:
    "Serve clean Markdown representations of any Next.js page when clients request Accept: text/markdown. No changes to your pages. Works with App Router, Pages Router, SSG, SSR, and ISR. Perfect for AI crawlers, docs exports, and content syndication.",
  keywords: [
    "next.js",
    "markdown",
    "middleware",
    "accept-header",
    "SSG",
    "SSR",
    "AI crawlers",
    "LLM",
    "content syndication",
    "documentation export",
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
    title: "accept-md | Serve Markdown from Any Next.js Page",
    description:
      "Serve clean Markdown representations of any Next.js page via Accept: text/markdown. Zero changes to your pages. Works with App Router, Pages Router, SSG, SSR, ISR.",
  },
  twitter: {
    card: "summary_large_image",
    title: "accept-md | Serve Markdown from Any Next.js Page",
    description:
      "Serve Markdown from any Next.js page via Accept: text/markdown. No code changes. AI crawlers, docs export, content syndication.",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "accept-md",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description:
    "Serve clean Markdown representations of any Next.js page when clients request Accept: text/markdown. No changes to your existing pages; works with App Router, Pages Router, SSG, SSR, and ISR.",
  url: siteUrl,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased bg-ink-950 text-ink-50 bg-grid">
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
