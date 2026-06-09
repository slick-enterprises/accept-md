import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllContent } from "@/lib/content";

const siteUrl = "https://accept.md";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = getAllBlogPosts();
  const docs = getAllContent("docs");
  const learn = getAllContent("learn");
  const integrations = getAllContent("integrations");
  
  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const contentUrls: MetadataRoute.Sitemap = [
    ...docs.map((item) => ({
      url: `${siteUrl}/docs/${item.slug}`,
      lastModified: item.date ? new Date(item.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...learn.map((item) => ({
      url: `${siteUrl}/learn/${item.slug}`,
      lastModified: item.date ? new Date(item.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...integrations.map((item) => ({
      url: `${siteUrl}/integrations/${item.slug}`,
      lastModified: item.date ? new Date(item.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/integrations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/markdown-audit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...blogUrls,
    ...contentUrls,
  ];
}
