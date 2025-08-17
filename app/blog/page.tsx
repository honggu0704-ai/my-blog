import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";

export const dynamic = "force-static";

export default async function BlogIndex() {
  const posts = await getAllPostsMeta();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">블로그</h1>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="block">
              <h3 className="text-lg font-semibold hover:underline">{post.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString("ko-KR")} · {post.summary || ""}
              </p>
              {post.tags?.length ? (
                <div className="mt-1 text-xs text-gray-500">#{post.tags.join(" #")}</div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
