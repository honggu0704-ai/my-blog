// lib/auth.ts
import { cookies } from "next/headers";
import { createHash } from "crypto";

export function adminHash() {
  const pwd = process.env.ADMIN_PASSWORD || "";
  const salt = process.env.ADMIN_SALT || "blog-salt";
  return createHash("sha256").update(`${pwd}:${salt}`).digest("hex");
}

export function isAdminByCookie() {
  const v = cookies().get("admin")?.value;
  return !!v && v === adminHash();
}
