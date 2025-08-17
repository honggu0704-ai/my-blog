import type { PageProps, Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { markdownToHtml } from "@/lib/markdown";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: PageProps<{ slug: string }>
): Promise<Metadata> {
  const { slug } = await params; // ✅ Next 15: params는 Promise
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.meta.title, description: post.meta.summary ?? "" };
}

export default async function PostPage(
  { params }: PageProps<{ slug: string }>
) {
  const { slug } = await params; // ✅ Next 15: params는 Promise
  const post = await getPostBySlug(slug);
  if (!post) return notFound();
  const html = await markdownToHtml(post.content);

  return (
    <article className="prose prose-zinc max-w-none">
      <h1>{post.meta.title}</h1>
      <p className="text-sm text-gray-500">
        {new Date(post.meta.date).toLocaleDateString("ko-KR")}
        {post.meta.tags?.length ? " · " + post.meta.tags.join(", ") : ""}
      </p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
