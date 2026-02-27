import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";
import { Calendar, User, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article className="prose prose-invert max-w-none prose-p:text-ink-300 prose-p:leading-relaxed prose-headings:text-white prose-headings:font-display prose-headings:tracking-tight prose-a:text-brand-400 prose-a:no-underline hover:prose-a:text-brand-300 prose-code:rounded-md prose-code:border prose-code:border-ink-700/50 prose-code:bg-ink-900/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-code:text-brand-300 prose-code:font-mono prose-code:text-sm prose-pre:bg-gradient-to-br prose-pre:from-ink-900/90 prose-pre:to-ink-950/80 prose-pre:border prose-pre:border-ink-800/60 prose-pre:rounded-card-lg prose-pre:shadow-lg prose-strong:text-white prose-ul:text-ink-300 prose-ol:text-ink-300 prose-li:text-ink-300 prose-li:leading-relaxed prose-blockquote:border-brand-500/30 prose-blockquote:bg-ink-900/30 prose-blockquote:text-ink-300 prose-blockquote:rounded-lg prose-blockquote:pl-4 prose-blockquote:py-2">
      <div className="mb-10">
        <Link
          href="/blog"
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-400 transition-colors hover:text-brand-400"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to blog
        </Link>
        <h1 className="mt-4 font-display text-4xl text-white md:text-5xl lg:text-6xl xl:text-7xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-300">{post.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-ink-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-ink-500" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-ink-500" />
            <span>{post.author}</span>
          </div>
        </div>
      </div>

      <div className="prose-content prose-img:rounded-lg prose-img:shadow-lg">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      <div className="mt-16 rounded-card-lg border border-ink-800/60 bg-gradient-to-br from-ink-900/50 to-ink-950/80 p-6 backdrop-blur-sm">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to blog
        </Link>
      </div>
    </article>
    </>
  );
}
