import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";
import type { Metadata } from "next";
import { MarkdownContent } from "@/components/MarkdownContent";
import { JsonLd } from "@/components/JsonLd";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  SITE_URL,
} from "@/lib/jsonld";
import { buildArticleMetadata } from "@/lib/metadata";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const pageUrl = `${SITE_URL}/blog/${post.slug}`;

  return buildArticleMetadata({
    title: post.title,
    description: post.description,
    url: pageUrl,
    keywords: post.keywords,
    publishedTime: post.date,
    authors: [post.author],
  });
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const pageUrl = `${SITE_URL}/blog/${post.slug}`;

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const schema = [
    buildArticleSchema({
      title: post.title,
      description: post.description,
      url: pageUrl,
      datePublished: post.date,
      authorName: post.author,
      keywords: post.keywords,
    }),
    buildBreadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Blog", url: `${SITE_URL}/blog` },
      { name: post.title, url: pageUrl },
    ]),
    ...(post.faq.length > 0 ? [buildFaqPageSchema(post.faq)] : []),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <article className="blog-article">
        <nav className="mb-8 text-sm text-ink-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link
                href="/blog"
                className="transition-colors hover:text-ink-400"
              >
                Blog
              </Link>
            </li>
            <li aria-hidden="true">·</li>
            <li className="text-ink-400" aria-current="page">
              {post.title}
            </li>
          </ol>
        </nav>

        <header className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-tight">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-5 text-lg leading-relaxed text-ink-400">
              {post.description}
            </p>
          )}
          <p className="mt-6 text-sm text-ink-500">
            <time dateTime={post.date}>{formattedDate}</time>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span>{post.author}</span>
          </p>
        </header>

        <MarkdownContent content={post.content} variant="blog" />

        <footer className="mt-16 border-t border-white/5 pt-8">
          <Link href="/blog" className="link-accent text-sm font-medium">
            ← Back to blog
          </Link>
        </footer>
      </article>
    </>
  );
}
