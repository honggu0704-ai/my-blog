import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { markdownToHtml } from "@/lib/markdown";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: "Finance Report", // 탭 제목도 단일화
    description: "",
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();
  const html = await markdownToHtml(post.content);

  return (
    <article className="space-y-4 leading-7">
      {/* 제목/날짜/태그 등 모든 텍스트 요소 제거, 본문만 남김 */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
