import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div>
      <header className="mb-16">
        <p className="section-label">Blog</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Blog
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-400">
          Guides, deep dives, and best practices for serving Markdown from Next.js and SvelteKit.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="py-12 text-ink-400">No posts yet. Check back soon.</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {posts.map((post) => (
            <li key={post.slug} className="py-10 first:pt-0">
              <article>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
                  Article ·{" "}
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-3 block text-xl font-semibold tracking-tight text-white transition-colors hover:text-ink-200 sm:text-2xl"
                >
                  {post.title}
                </Link>
                {post.description && (
                  <p className="mt-2 text-base leading-relaxed text-ink-400">
                    {post.description}
                  </p>
                )}
                <p className="mt-3 text-sm text-ink-500">
                  {post.author}
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
