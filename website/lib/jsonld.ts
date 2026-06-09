export const SITE_URL = "https://accept.md";
export const OG_IMAGE_URL = `${SITE_URL}/opengraph-image`;
export const DOCS_OG_IMAGE_URL = `${SITE_URL}/docs/opengraph-image`;
export const BLOG_OG_IMAGE_URL = `${SITE_URL}/blog/opengraph-image`;
export const AUDIT_OG_IMAGE_URL = `${SITE_URL}/markdown-audit/opengraph-image`;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

export const LOGO_URL = `${SITE_URL}/logo.png`;
export const LOGO_WIDTH = 512;
export const LOGO_HEIGHT = 512;

export function buildPublisherLogo() {
  return {
    "@type": "ImageObject" as const,
    url: LOGO_URL,
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  };
}

export function buildPublisher() {
  return {
    "@type": "Organization" as const,
    "@id": ORGANIZATION_ID,
    name: "accept-md",
    url: SITE_URL,
    logo: buildPublisherLogo(),
  };
}

export function buildWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "accept-md",
    url: SITE_URL,
    publisher: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?s={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "accept-md",
    url: SITE_URL,
    logo: buildPublisherLogo(),
    description:
      "Open-source tooling that serves Markdown from any Next.js or SvelteKit page via Accept: text/markdown. Built for AI agents, docs export, and content syndication.",
    sameAs: ["https://github.com/slick-enterprises/accept-md"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Technical Support",
      url: "https://github.com/slick-enterprises/accept-md/issues",
    },
  };
}

export function buildSoftwareApplicationSchema() {
  return {
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID,
    name: "accept-md",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    description:
      "Add Accept Markdown support to Next.js and SvelteKit routes when clients send Accept: text/markdown. Zero page changes. Works with App Router, Pages Router, SSG, SSR, ISR, and SvelteKit.",
    url: SITE_URL,
    applicationSubCategory: "Content Negotiation",
    potentialAction: {
      "@type": "UseAction",
      target: `${SITE_URL}/markdown-audit`,
      name: "Run Markdown Audit",
    },
    author: { "@id": ORGANIZATION_ID },
    codeRepository: "https://github.com/slick-enterprises/accept-md",
    license: "https://opensource.org/licenses/MIT",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function buildGlobalSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebSiteSchema(),
      buildOrganizationSchema(),
      buildSoftwareApplicationSchema(),
    ],
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface TechArticleInput {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  keywords?: string[];
  image?: string;
}

export function buildTechArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  keywords,
  image = OG_IMAGE_URL,
}: TechArticleInput) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
    image,
    author: buildPublisher(),
    publisher: buildPublisher(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export interface CollectionItem {
  name: string;
  url: string;
}

export interface CollectionPageInput {
  name: string;
  description: string;
  url: string;
  items: CollectionItem[];
}

export function buildCollectionPageSchema({
  name,
  description,
  url,
  items,
}: CollectionPageInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: {
          "@type": "WebPage",
          name: item.name,
          url: item.url,
        },
      })),
    },
  };
}

export interface WebPageInput {
  name: string;
  description: string;
  url: string;
}

export function buildWebPageSchema({ name, description, url }: WebPageInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function buildAboutPageSchema({ name, description, url }: WebPageInput) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name,
    description,
    url,
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export interface ArticleInput {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  keywords: string[];
  image?: string;
}

export function buildArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
  keywords,
  image = OG_IMAGE_URL,
}: ArticleInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Organization",
      name: authorName,
      url: "https://github.com/slick-enterprises/accept-md",
    },
    publisher: buildPublisher(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: keywords.join(", "),
  };
}

export interface WebApplicationInput {
  name: string;
  description: string;
  url: string;
  featureList: string[];
}

export function buildWebApplicationSchema({
  name,
  description,
  url,
  featureList,
}: WebApplicationInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    url,
    description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList,
    author: { "@id": ORGANIZATION_ID },
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}
