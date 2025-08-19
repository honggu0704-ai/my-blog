// app/sector/[sector]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPostsMeta } from "../../../lib/posts";
import { SECTORS, isValidSector, sectorLabel } from "../../../lib/sector";

type Props = {
  params: Promise<{ sector: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const dynamicParams = false;
export async function generateStaticParams() {
  return SECTORS.map((s) => ({ sector: s.value }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector } = await params;
  return { title: `Finance Report – ${sectorLabel(sector)}` };
}

export default async function SectorPage({ params, searchParams }: Props) {
  const { sector } = await params;
  if (!isValidSector(sector)) return notFound();

  const sp = await searchParams;
  const PAGE_SIZE = 16;
  const page = Math.max(1, parseInt(sp?.page ?? "1", 10));

  const all = await getAllPostsMeta();
  const posts = all
    .filter((p) => (p.sector ?? "") === sector)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  const total = posts.length;
  const start = (page - 1) * PAGE_SIZE;
  const items = posts.slice(start, start + PAGE_SIZE);

  const nextPage = start + PAGE_SIZE < total ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{sectorLabel(sector)}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-items-stretch">
        {items.map((p) => {
          const fileName = p.file ? decodeURIComponent(p.file.split("/").pop()!) : "(파일 없음)";
          return (
            <div key={p.slug} className="rounded-2xl border border-white/15 p-4">
              {/* 파일 링크(다운로드) */}
              {p.file ? (
                <a href={p.file} download className="inline-block rounded border border-white/30 px-3 py-1 text-sm hover:bg-white/10">
                  파일 다운로드
                </a>
              ) : (
                <span className="inline-block rounded border border-white/10 px-3 py-1 text-sm opacity-50">
                  파일 없음
                </span>
              )}

              <div className="mt-3 text-base font-semibold line-clamp-2">
                {p.title}
              </div>
              <div className="mt-1 text-xs opacity-70">{new Date(p.date).toLocaleDateString("ko-KR")}</div>

              {/* 파일명(작게) */}
              <div className="mt-2 text-xs opacity-60 break-words">{fileName}</div>

              {/* (선택) 상세 페이지가 필요하면 아래 링크 유지 */}
              {/* <div className="mt-3">
                <Link href={`/blog/${p.slug}`} className="text-sm underline">자세히</Link>
              </div> */}
            </div>
          );
        })}
        {!items.length && (
          <div className="opacity-60 text-sm col-span-full">게시물이 없습니다.</div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 text-sm">
        {prevPage ? (
          <Link href={`/sector/${sector}?page=${prevPage}`} className="underline">이전</Link>
        ) : <span />}
        {nextPage ? (
          <Link href={`/sector/${sector}?page=${nextPage}`} className="underline">다음</Link>
        ) : <span />}
      </div>
    </div>
  );
}
