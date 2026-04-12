import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Article not found" };
  }
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} | MentalHealthDirectories.com`,
      description: post.description,
      url: `/blog/${post.slug}`,
      siteName: "MentalHealthDirectories.com",
      type: "article",
    },
  };
}

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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <article>
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Blog
          </p>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            {formatDate(post.date)}
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold text-navy sm:text-4xl">
            {post.title}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
            {post.description}
          </p>
        </header>

        <div
          className="blog-content mt-10 max-w-3xl text-sm leading-relaxed text-slate-700 [&_a]:font-medium [&_a]:text-teal [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-teal-soft [&_blockquote]:border-l-4 [&_blockquote]:border-teal/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_code]:rounded [&_code]:bg-navy/5 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-navy [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_strong]:font-semibold [&_strong]:text-navy [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>

      <div className="mt-12 flex flex-wrap gap-6 border-t border-navy/10 pt-8">
        <Link href="/blog" className="text-sm text-teal hover:text-teal-soft">
          ← All articles
        </Link>
        <Link href="/" className="text-sm text-teal hover:text-teal-soft">
          Homepage
        </Link>
      </div>
    </main>
  );
}
