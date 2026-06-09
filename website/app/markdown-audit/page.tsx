import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { CheckPageContent, faqSchemaItems } from "@/components/CheckPageContent";
import { UrlChecker } from "@/components/UrlChecker";
import { JsonLd } from "@/components/JsonLd";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildWebApplicationSchema,
  AUDIT_OG_IMAGE_URL,
  SITE_URL,
} from "@/lib/jsonld";
import { buildArticleMetadata } from "@/lib/metadata";

const pageUrl = `${SITE_URL}/markdown-audit`;

const title = "Website Markdown Audit — Test Accept Markdown Support";
const description =
  "Free Markdown audit tool: paste any URL to test Accept: text/markdown responses, compare HTML vs Markdown size, verify Vary: Accept, and get a production-readiness report.";

export const metadata: Metadata = buildArticleMetadata({
  title,
  description,
  url: pageUrl,
  keywords: [
    "markdown audit",
    "audit website markdown",
    "Accept: text/markdown test",
    "content negotiation audit",
    "Vary Accept",
    "AI crawler markdown",
  ],
  ogType: "website",
  image: AUDIT_OG_IMAGE_URL,
});

export default function MarkdownAuditPage() {
  return (
    <AppShell section="audit">
      <JsonLd
        data={[
          buildWebApplicationSchema({
            name: "Markdown Audit",
            description,
            url: pageUrl,
            featureList: [
              "Markdown response verification",
              "HTML fallback check",
              "Vary: Accept header audit",
              "Distinct representation comparison",
            ],
          }),
          buildFaqPageSchema(faqSchemaItems),
          buildBreadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Markdown Audit", url: pageUrl },
          ]),
        ]}
      />
      <UrlChecker />
      <CheckPageContent />
    </AppShell>
  );
}
