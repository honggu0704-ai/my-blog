// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "../../../lib/posts";
import { markdownToHtml } from "../../../lib/markdown";

// ✅ 새 슬러그도 허용 (이 줄이 핵심)
export const dynamicParams = true;

// (선택) 항상 최신으로 렌더하고 싶으면 주석 해제
// export const revalidate = 0;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.summary ?? "",
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const html = await markdownToHtml(post.content);

  return (
    <article className="prose prose-invert prose-zinc max-w-none">
      <h1>{post.meta.title}</h1>
      <p className="text-sm opacity-70">
        {new Date(post.meta.date).toLocaleDateString("ko-KR")}
      </p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
