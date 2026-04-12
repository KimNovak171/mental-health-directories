import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on mental health, finding care, therapy, and emotional well-being from MentalHealthDirectories.com.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | MentalHealthDirectories.com",
    description:
      "Articles on mental health, finding care, therapy, and emotional well-being.",
    url: "/blog",
    siteName: "MentalHealthDirectories.com",
    type: "website",
  },
};

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) {
    return isoDate;
  }
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          Blog
        </p>
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          Mental health articles
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Practical guides and explainers on mental health, therapy, and
          finding support.
        </p>
      </header>

      <ul className="mt-10 divide-y divide-navy/10 border-t border-navy/10">
        {posts.length === 0 ? (
          <li className="py-8 text-sm text-slate-600">No articles yet.</li>
        ) : (
          posts.map((post) => (
            <li key={post.slug} className="py-6">
              <article className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  {formatDate(post.date)}
                </p>
                <h2 className="text-lg font-semibold text-navy">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                  {post.description}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-block text-sm font-medium text-teal hover:text-teal-soft"
                >
                  Read more →
                </Link>
              </article>
            </li>
          ))
        )}
      </ul>

      <div className="mt-10">
        <Link href="/" className="text-sm text-teal hover:text-teal-soft">
          ← Back to homepage
        </Link>
      </div>
    </main>
  );
}
