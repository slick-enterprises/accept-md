import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";
import { Calendar, User } from "lucide-react";

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div>
      <div className="mb-12">
        <p className="section-label">Blog</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
          Latest Articles
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-300">
          Learn about Next.js markdown conversion, AI crawlers, and best
          practices for serving Markdown from your applications.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-card-lg border border-ink-800/60 bg-gradient-to-br from-ink-900/50 to-ink-950/80 p-8 text-center backdrop-blur-sm">
          <p className="text-ink-300">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group card-hover rounded-card-lg border border-ink-800/60 bg-gradient-to-br from-ink-900/30 to-ink-950/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-brand-500/30 hover:from-ink-900/50 hover:to-ink-950/70 hover:shadow-lg"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="font-display text-2xl font-semibold text-white transition-colors group-hover:text-brand-400">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-3 leading-relaxed text-ink-300 transition-colors group-hover:text-ink-200">
                {post.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-400">
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
              <Link
                href={`/blog/${post.slug}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300 hover:gap-2"
              >
                Read more
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
