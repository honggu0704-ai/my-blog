import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

type Meta = {
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
  published?: boolean;
};

const postsDir = path.join(process.cwd(), 'content', 'posts');

export async function getAllSlugs(): Promise<string[]> {
  const files = await fs.readdir(postsDir);
  return files
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export async function getAllPostsMeta(): Promise<Array<{slug: string} & Meta>> {
  const files = await fs.readdir(postsDir);
  const posts: Array<{slug: string} & Meta> = [];
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const raw = await fs.readFile(path.join(postsDir, file), 'utf-8');
    const { data } = matter(raw);
    const meta = data as Meta;
    if (meta.published === false) continue;
    posts.push({ slug: file.replace(/\.md$/, ''), ...meta });
  }
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export async function getPostBySlug(slug: string): Promise<{meta: Meta, content: string} | null> {
  try {
    const raw = await fs.readFile(path.join(postsDir, `${slug}.md`), 'utf-8');
    const { data, content } = matter(raw);
    const meta = data as Meta;
    if (meta.published === false) return null;
    return { meta, content };
  } catch {
    return null;
  }
}
