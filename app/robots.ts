import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-blog-ochre-alpha.vercel.app";
  const noIndex = process.env.NEXT_PUBLIC_NO_INDEX === "true"; // 프리뷰 차단용(선택)

  return noIndex
    ? { rules: [{ userAgent: "*", disallow: "/" }] }
    : { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${base}/sitemap.xml` };
}
