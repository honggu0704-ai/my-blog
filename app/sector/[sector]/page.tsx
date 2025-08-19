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
  const PAGE_SIZE = 10;
  const page = Math.max(1, parseInt(sp?.page ?? "1", 10));

  const all = await getAllPostsMeta();
  const filtered = all
    .filter((p) => (p.sector ?? "") === sector)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  const total = filtered.length;
  const start = (page - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{sectorLabel(sector)}</h1>

      <ul className="space-y-2">
        {items.map((p) => (
          <li key={p.slug} className="text-sm">
            <Link href={`/blog/${p.slug}`} className="hover:underline">
              {p.title}
            </Link>
            <span className="opacity-60 ml-2">
              {new Date(p.date).toLocaleDateString("ko-KR")}
            </span>
          </li>
        ))}
        {!items.length && <li className="opacity-60 text-sm">게시물이 없습니다.</li>}
      </ul>

      <div className="flex items-center justify-between pt-4 text-sm">
        {page > 1 ? (
          <Link href={`/sector/${sector}?page=${page - 1}`} className="underline">
            이전
          </Link>
        ) : (
          <span />
        )}
        {start + PAGE_SIZE < total ? (
          <Link href={`/sector/${sector}?page=${page + 1}`} className="underline">
            다음
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
