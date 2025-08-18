import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_KR, Playfair_Display } from "next/font/google";

const noto = Noto_Sans_KR({
  weight: ["400","500","700"],
  subsets: ["latin"],
  display: "swap",
});

const headline = Playfair_Display({
  weight: ["400"],          // 얇고 고급스러운 느낌
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "경제 블로그",
  description: "경제/시장 메모와 인사이트",
  // verification: { google: "구글-코드", other: { "naver-site-verification": "네이버-코드" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      {/* 본문은 Noto Sans */}
      <body className={noto.className}>
        {/* ▼ 밑에 흰 줄(보더) 제거: border-b 삭제 */}
        <header className="sticky top-0 z-10 bg-black/70 backdrop-blur">
          <nav className="mx-auto max-w-4xl px-4 py-4">
            <div className="flex items-center justify-end">
              {/* ▼ 타이틀만 Playfair Display + 얇게 */}
              <span
                className={`${headline.className} text-4xl sm:text-5xl md:text-6xl font-normal leading-none`}
              >
                Finance Report
              </span>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-3xl px-4 py-8" />
      </body>
    </html>
  );
}
