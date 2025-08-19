// lib/posts.ts
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
  sector?: string;   // "energy" 등
  cover?: string;
};

export async function getAllSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    return files
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""))
      .sort();
  } catch {
    return [];
  }
}

export async function getAllPostsMeta(): Promise<PostMeta[]> {
  const slugs = await getAllSlugs();
  const metas: PostMeta[] = [];
  for (const slug of slugs) {
    const p = await getPostBySlug(slug);
    if (p) metas.push(p.meta);
  }
  // 최신 날짜 우선
  metas.sort((a, b) => (a.date > b.date ? -1 : 1));
  return metas;
}

export async function getPostBySlug(slug: string): Promise<{ meta: PostMeta; content: string } | null> {
  try {
    const file = path.join(POSTS_DIR, `${slug}.md`);
    const raw = await fs.readFile(file, "utf8");
    const { data, content } = matter(raw);

    const meta: PostMeta = {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? new Date().toISOString().slice(0, 10)),
      summary: data.summary ?? "",
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      sector: data.sector ? String(data.sector) : "",
      cover: data.cover ? String(data.cover) : undefined,
    };

    return { meta, content };
  } catch {
    return null;
  }
}
