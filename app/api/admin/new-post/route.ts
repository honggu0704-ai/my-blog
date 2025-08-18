// app/api/admin/new-post/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createOrUpdateFile } from "@/lib/github";
import { isAdminByCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password, title, slug, date, summary, tags, body } = await req.json();

    // ✅ 쿠키 또는 비번 둘 중 하나로 인증
    const cookieOK = await isAdminByCookie();
    const bodyOK = !!process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD;
    if (!cookieOK && !bodyOK) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!title || !body) {
      return NextResponse.json({ ok: false, error: "title and body are required" }, { status: 400 });
    }

    const owner = process.env.GITHUB_OWNER!;
    const repo = process.env.GITHUB_REPO!;
    const branch = process.env.GITHUB_BRANCH || "main";
    if (!owner || !repo || !process.env.GITHUB_TOKEN) {
      return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });
    }

    const safeSlug = (slug && String(slug).trim()) || toSlug(title);
    const filePath = `content/posts/${safeSlug}.md`;

    const fm = frontMatter({
      title,
      date: date || new Date().toISOString().slice(0, 10),
      summary: summary || "",
      tags: parseTags(tags),
    });

    const content = `${fm}\n\n${body}\n`;

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
