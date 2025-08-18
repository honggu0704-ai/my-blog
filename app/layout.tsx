import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_KR, Playfair_Display } from "next/font/google";
import Sidebar from "../components/Sidebar";
import AdminFab from "../components/AdminFab";
import { isAdminByCookie } from "../lib/auth";

const noto = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const headline = Playfair_Display({
  weight: ["400"], // 얇고 고급스러운 느낌
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "경제 블로그",
  description: "경제/시장 메모와 인사이트",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${noto.className} bg-black text-white antialiased`}>
        {/* 좌측 고정 사이드바 */}
        <Sidebar />

        {/* 사이드바 폭만큼 본문 좌여백 (Sidebar가 w-56이면 pl-56로 맞추기) */}
        <div className="pl-56">
          <header className="sticky top-0 z-10 bg-black/70 backdrop-blur">
            <nav className="mx-auto max-w-4xl px-4 py-4">
              <div className="flex items-center justify-end">
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
        </div>

        {/* 관리자 로그인 쿠키가 있을 때만 보이는 글쓰기 FAB */}
        {isAdminByCookie() && <AdminFab />}
      </body>
    </html>
  );
}
