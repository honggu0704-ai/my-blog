// lib/auth.ts
import { cookies } from "next/headers";
import { createHash } from "crypto";

export function adminHash() {
  const pwd = process.env.ADMIN_PASSWORD || "";
  const salt = process.env.ADMIN_SALT || "blog-salt";
  return createHash("sha256").update(`${pwd}:${salt}`).digest("hex");
}

// ✅ Next.js 15: cookies()는 Promise → await 필요
export async function isAdminByCookie() {
  const jar = await cookies();
  const v = jar.get("admin")?.value;
  return !!v && v === adminHash();
}
