// app/layout.tsx
export const dynamic = "force-dynamic"; // 쿠키 읽기 보장

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
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "전홍구의 경제블로그",
  description: "경제/시장 메모와 인사이트",
};

// ✅ 레이아웃을 async로 바꾸고 쿠키 체크를 await
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await isAdminByCookie();

  return (
    <html lang="ko">
      <body className={`${noto.className} bg-black text-white antialiased`}>
        <Sidebar />
        <div className="pl-56">
          <header className="sticky top-0 z-10 bg-black/70 backdrop-blur">
            <nav className="mx-auto max-w-4xl px-4 py-4">
              <div className="flex items-center justify-end">
                <span className={`${headline.className} text-4xl sm:text-5xl md:text-6xl font-normal leading-none`}>
                  Finance Report
                </span>
              </div>
            </nav>
          </header>

          <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
          <footer className="mx-auto max-w-3xl px-4 py-8" />
        </div>

        {isAdmin && <AdminFab />}
      </body>
    </html>
  );
}
