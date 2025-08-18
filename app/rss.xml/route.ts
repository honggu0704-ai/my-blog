import { NextResponse } from "next/server";
import { getAllPostsMeta } from "../../lib/posts";


export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-blog-ochre-alpha.vercel.app";
  const posts = await getAllPostsMeta();

  const items = posts.map(p => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${site}/blog/${p.slug}</link>
      <guid>${site}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.summary ?? ""}]]></description>
    </item>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>경제 블로그</title>
      <link>${site}</link>
      <description>경제 블로그 RSS</description>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" }});
}

function escapeXml(s: string) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
}
