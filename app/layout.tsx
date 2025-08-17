import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "경제 블로그",
  description: "경제/시장 메모와 인사이트",
  verification: {
    google: "MYvtRKPb2v1", // Search Console에서 받은 content 값
    other: { "naver-site-verification": "82d7b073ce972a2e57e007f32729359c273c1392" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link className="font-semibold" href="/">경제 블로그</Link>
            <div className="space-x-4 text-sm">
              <Link href="/blog">블로그</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-3xl px-4 py-10 text-sm text-gray-500">
          © {new Date().getFullYear()} 경제 블로그 · 본 콘텐츠는 투자 조언이 아닙니다.
        </footer>
      </body>
    </html>
  );
}
