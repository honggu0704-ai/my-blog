import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";

export const dynamic = "force-static";

export default async function Page() {
  const posts = await getAllPostsMeta();
  return (
    <div className="space-y-10">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">안녕하세요 👋</h1>
        <p className="text-gray-600">Next.js + Markdown 기반의 초간단 블로그입니다.</p>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">최근 글</h2>
        <ul className="space-y-4">
          {posts.slice(0, 5).map((post) => (
            <li key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <h3 className="text-lg font-medium group-hover:underline">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString("ko-KR")} · {post.summary || ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Link href="/blog" className="text-sm underline">전체 글 보러가기 →</Link>
        </div>
      </section>
    </div>
  );
}
