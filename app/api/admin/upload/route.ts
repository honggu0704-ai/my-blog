// app/api/admin/upload/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { isAdminByCookie } from "../../../../lib/auth";
import { isValidSector } from "../../../../lib/sector";
import { createOrUpdateFileContents } from "../../../../lib/github";

function toSlug(s: string) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\-가-힣]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
function sanitizeFileName(name: string) {
  const dot = name.lastIndexOf(".");
  const base = toSlug(dot > 0 ? name.slice(0, dot) : name);
  const ext = dot > 0 ? name.slice(dot).toLowerCase() : "";
  return `${base || "file"}${ext}`;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const password = String(form.get("password") ?? "");
    const title = String(form.get("title") ?? "");
    const slugRaw = form.get("slug");
    const date = String(form.get("date") ?? new Date().toISOString().slice(0, 10));
    const sector = String(form.get("sector") ?? "");
    const file = form.get("file") as File | null;

    const cookieOK = await isAdminByCookie();
    const bodyOK = !!process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD;
    if (!cookieOK && !bodyOK) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    if (!title || !file || !sector) {
      return NextResponse.json({ ok: false, error: "title/sector/file required" }, { status: 400 });
    }
    if (!isValidSector(sector)) {
      return NextResponse.json({ ok: false, error: "invalid sector" }, { status: 400 });
    }

    const safeSlug = (slugRaw && String(slugRaw).trim()) || `${date}-${toSlug(title) || "post"}`;
    const safeName = sanitizeFileName(file.name);
    const fileRepoPath = `public/files/${safeSlug}/${safeName}`;
    const fileUrl = `/files/${safeSlug}/${safeName}`;

    // 파일 Base64로 커밋
    const buf = Buffer.from(await file.arrayBuffer());
    const base64 = buf.toString("base64");
    await createOrUpdateFileContents({
      path: fileRepoPath,
      contentBase64: base64,
      message: `upload(file): ${fileRepoPath}`,
    });

    // 메타(.md with frontmatter) 커밋
    const metaPath = `content/posts/${safeSlug}.md`;
    const fm = [
      "---",
      `title: "${title.replace(/"/g, '\\"')}"`,
      `date: "${date}"`,
      `summary: ""`,
      `sector: "${sector}"`,
      `tags: []`,
      `file: "${fileUrl}"`,
      "---",
      "",
    ].join("\n");
    const metaB64 = Buffer.from(fm, "utf8").toString("base64");
    await createOrUpdateFileContents({
      path: metaPath,
      contentBase64: metaB64,
      message: `post(meta): ${safeSlug}`,
    });

    return NextResponse.json({ ok: true, slug: safeSlug, pathFile: fileRepoPath, pathMeta: metaPath });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}
