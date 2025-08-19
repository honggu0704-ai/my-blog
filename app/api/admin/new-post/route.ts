// app/api/admin/new-post/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createOrUpdateFileContents } from "../../../../lib/github"; // ✅ 새 함수
import { isAdminByCookie } from "../../../../lib/auth";
import { isValidSector } from "../../../../lib/sector";

export async function POST(req: Request) {
  try {
    const { password, title, slug, date, summary, tags, body, sector } = await req.json();

    // 인증: (1) 관리자 쿠키 또는 (2) 비밀번호
    const cookieOK = await isAdminByCookie();
    const bodyOK = !!process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD;
    if (!cookieOK && !bodyOK) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    // 유효성
    if (!title || !body) {
      return NextResponse.json({ ok: false, error: "title and body are required" }, { status: 400 });
    }
    if (sector && !isValidSector(String(sector))) {
      return NextResponse.json({ ok: false, error: "invalid sector" }, { status: 400 });
    }

    const safeSlug = (slug && String(slug).trim()) || toSlug(title);
    const filePath = `content/posts/${safeSlug}.md`;

    const fm = frontMatter({
      title,
      date: (date && String(date)) || new Date().toISOString().slice(0, 10),
      summary: summary || "",
      tags: parseTags(tags),
      sector: sector ? String(sector) : "",
    });

    const content = `${fm}\n\n${body}\n`;

    // ✅ Base64로 인코딩해서 새 헬퍼 호출
    const base64 = Buffer.from(content, "utf8").toString("base64");
    await createOrUpdateFileContents({
      path: filePath,
      contentBase64: base64,
      message: `post: ${safeSlug}`,
    });

    return NextResponse.json({ ok: true, slug: safeSlug, path: filePath });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}

// ------------ 유틸 ------------
function toSlug(s: string) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\-가-힣]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function escapeYaml(v: string) {
  return (v || "").replace(/"/g, '\\"');
}

function frontMatter({
  title, date, summary, tags, sector,
}: {
  title: string; date: string; summary: string; tags: string[]; sector: string;
}) {
  const tagsLine = (tags || []).map((t) => `"${escapeYaml(t)}"`).join(", ");
  return `---\ntitle: "${escapeYaml(title)}"\ndate: "${date}"\nsummary: "${escapeYaml(summary)}"\nsector: "${sector}"\ntags: [${tagsLine}]\n---`;
}

function parseTags(input: unknown): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(String).map((s) => s.trim()).filter(Boolean);
  return String(input).split(",").map((s) => s.trim()).filter(Boolean);
}
