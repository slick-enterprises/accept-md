import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/CodeBlock";

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

  const siteUrl = "https://accept.md";
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const siteUrl = "https://accept.md";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${siteUrl}/opengraph-image`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://github.com/slick-enterprises/accept-md",
    },
    publisher: {
      "@type": "Organization",
      name: "accept-md",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    keywords: post.keywords.join(", "),
  };

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
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
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{post.author}</span>
          </p>
        </header>

        <div className="prose prose-invert prose-blog max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre({ children }) {
                const code = React.Children.only(children) as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
                const lang = (code.props?.className ?? "").match(/language-(\S+)/)?.[1] ?? "text";
                return (
                  <CodeBlock language={lang} className="my-6">
                    {code.props?.children}
                  </CodeBlock>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <footer className="mt-16 pt-8 border-t border-white/5">
          <Link
            href="/blog"
            className="text-sm font-medium text-ink-400 transition-colors hover:text-white"
          >
            Back to blog
          </Link>
        </footer>
      </article>
    </>
  );
}
