import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

export type BlogPostListItem = {
  slug: string;
  title: string;
  date: string;
  description: string;
};

export type BlogPost = BlogPostListItem & {
  contentHtml: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

async function getMarkdownFilenames(): Promise<string[]> {
  const entries = await fs.readdir(BLOG_DIR);
  return entries.filter((name) => name.endsWith(".md"));
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/i, "");
}

function metaFromMatter(
  data: Record<string, unknown>,
  fallbackSlug: string,
): BlogPostListItem | null {
  const title = data.title;
  const date = data.date;
  const description = data.description;
  if (
    typeof title !== "string" ||
    typeof date !== "string" ||
    typeof description !== "string"
  ) {
    return null;
  }
  const slug =
    typeof data.slug === "string" && data.slug.length > 0
      ? data.slug
      : fallbackSlug;
  return { slug, title, date, description };
}

export async function getAllPosts(): Promise<BlogPostListItem[]> {
  const files = await getMarkdownFilenames();
  const posts: BlogPostListItem[] = [];

  for (const file of files) {
    const fullPath = path.join(BLOG_DIR, file);
    const raw = await fs.readFile(fullPath, "utf8");
    const { data } = matter(raw);
    const meta = metaFromMatter(data as Record<string, unknown>, slugFromFilename(file));
    if (meta) {
      posts.push(meta);
    }
  }

  posts.sort((a, b) => {
    const ta = new Date(a.date).getTime();
    const tb = new Date(b.date).getTime();
    return tb - ta;
  });

  return posts;
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const files = await getMarkdownFilenames();

  for (const file of files) {
    const fullPath = path.join(BLOG_DIR, file);
    const raw = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(raw);
    const meta = metaFromMatter(data as Record<string, unknown>, slugFromFilename(file));
    if (!meta || meta.slug !== slug) {
      continue;
    }

    const processed = await remark().use(remarkHtml).process(content);
    return {
      ...meta,
      contentHtml: String(processed),
    };
  }

  return null;
}
