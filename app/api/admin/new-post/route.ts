// app/api/admin/new-post/route.ts
// 서버 런타임(버퍼 사용) 보장
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createOrUpdateFile } from "@/lib/github";
import { isAdminByCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password, title, slug, date, summary, tags, body } = await req.json();

    // 인증: (1) 관리자 쿠키 있거나 (2) 비밀번호 일치하면 허용
    const cookieOK = isAdminByCookie();
    const bodyOK =
      !!process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD;

    if (!cookieOK && !bodyOK) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    // 필수값 체크
    if (!title || !body) {
      return NextResponse.json({ ok: false, error: "title and body are required" }, { status: 400 });
    }

    const owner = process.env.GITHUB_OWNER!;
    const repo = process.env.GITHUB_REPO!;
    const branch = process.env.GITHUB_BRANCH || "main";
    if (!owner || !repo || !process.env.GITHUB_TOKEN) {
      return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });
    }

    // 슬러그 결정
    const safeSlug = (slug && String(slug).trim()) || toSlug(title);
    const filePath = `content/posts/${safeSlug}.md`;

    // 프론트매터 + 본문 구성
    const fm = frontMatter({
      title,
      date: date || new Date().toISOString().slice(0, 10),
      summary: summary || "",
      tags: parseTags(tags),
    });
    const content = `${fm}\n\n${body}\n`;

    // GitHub 커밋(파일 생성/갱신)
    await createOrUpdateFile({
      owner,
      repo,
      path: filePath,
      content,
      message: `post: ${safeSlug}`,
      branch,
    });

    return NextResponse.json({ ok: true, slug: safeSlug, path: filePath });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}

// 유틸들
function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\-가-힣]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function escapeYaml(v: string) {
  return (v || "").replace(/"/g, '\\"');
}

function frontMatter({ title, date, summary, tags }: { title: string; date: string; summary: string; tags: string[] }) {
  const tagsLine = tags.map((t) => `"${escapeYaml(t)}"`).join(", ");
  return `---\ntitle: "${escapeYaml(title)}"\ndate: "${date}"\nsummary: "${escapeYaml(summary)}"\ntags: [${tagsLine}]\n---`;
}

function parseTags(input: unknown): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(String).map((s) => s.trim()).filter(Boolean);
  return String(input).split(",").map((s) => s.trim()).filter(Boolean);
}
