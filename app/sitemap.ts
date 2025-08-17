import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-blog-ochre-alpha.vercel.app";
  const slugs = await getAllSlugs();
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/blog`, lastModified: now },
    ...slugs.map((slug) => ({ url: `${base}/blog/${slug}`, lastModified: now })),
  ];
}
