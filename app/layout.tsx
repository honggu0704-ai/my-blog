import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";

const noto = Noto_Sans_KR({
  weight: ["400","500","700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "경제 블로그",
  description: "경제/시장 메모와 인사이트",
  // verification: { google: "구글코드", other: { "naver-site-verification": "네이버코드" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={noto.className}>
        {/* 우측 상단 타이틀만 남김 */}
        <header className="sticky top-0 z-10 border-b border-white/10 bg-black/70 backdrop-blur">
          <nav className="mx-auto max-w-4xl px-4 py-4">
            <div className="flex items-center justify-end">
              <span className="font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl">
                Finance Report
              </span>
            </div>
          </nav>
        </header>

        {/* 본문은 기본 레이아웃만, 텍스트는 각 페이지에서 제거 */}
        <main>{children}</main>

        {/* 푸터 텍스트 제거(빈 영역) */}
        <footer className="mx-auto max-w-3xl px-4 py-8" />
      </body>
    </html>
  );
}
