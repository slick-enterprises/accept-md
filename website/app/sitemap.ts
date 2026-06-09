import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllContent } from "@/lib/content";
import { SITE_URL } from "@/lib/jsonld";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = getAllBlogPosts();
  const docs = getAllContent("docs");
  const learn = getAllContent("learn");
  const integrations = getAllContent("integrations");
  
  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const contentUrls: MetadataRoute.Sitemap = [
    ...docs.map((item) => ({
      url: `${SITE_URL}/docs/${item.slug}`,
      lastModified: new Date(item.updated || item.date || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...learn.map((item) => ({
      url: `${SITE_URL}/learn/${item.slug}`,
      lastModified: new Date(item.updated || item.date || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...integrations.map((item) => ({
      url: `${SITE_URL}/integrations/${item.slug}`,
      lastModified: new Date(item.updated || item.date || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/learn`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/integrations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/markdown-audit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...blogUrls,
    ...contentUrls,
  ];
}
