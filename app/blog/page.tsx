import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";

export const dynamic = "force-static";

export default async function BlogIndex() {
  const posts = await getAllPostsMeta();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {posts.map((post) => (
        <div key={post.slug} className="card h-28">
          {/* 시각적으로는 텍스트 0, 접근성용 레이블만 남김 */}
          <Link
            href={`/blog/${post.slug}`}
            aria-label={post.title}
            className="block h-full w-full"
          />
        </div>
      ))}
    </div>
  );
}

