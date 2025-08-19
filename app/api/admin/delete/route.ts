// app/api/admin/delete/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { isAdminByCookie } from "../../../../lib/auth";
import { deleteFile, listDirectory, getContentSha, octokit } from "../../../../lib/github";

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug") || "";

    const cookieOK = await isAdminByCookie();
    if (!cookieOK) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    if (!slug) return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });

    const deleted: string[] = [];

    // 1) 메타 삭제
    const metaPath = `content/posts/${slug}.md`;
    try {
      await deleteFile({ path: metaPath, message: `delete(meta): ${slug}` });
      deleted.push(metaPath);
    } catch {}

    // 2) 파일 디렉토리의 파일들 삭제
    const dir = `public/files/${slug}`;
    const items = await listDirectory(dir);
    for (const it of items) {
      await deleteFile({ path: it.path, message: `delete(file): ${it.path}` });
      deleted.push(it.path);
    }
    // (깃은 빈 디렉토리는 자동 사라짐)

    return NextResponse.json({ ok: true, deleted });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}
