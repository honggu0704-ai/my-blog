// app/api/auth/login/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { adminHash } from "../../../../lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: "admin",
    value: adminHash(),
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7일
  });
  return res;
}
