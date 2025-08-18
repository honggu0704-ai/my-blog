"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  // (선택) 마지막 상태 기억
  useEffect(() => {
    try {
      const v = localStorage.getItem("sb-open");
      if (v) setOpen(v === "1");
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("sb-open", open ? "1" : "0");
    } catch {}
    // 열릴 때 뒤 스크롤 잠금
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  // 단축키: ⌘/Ctrl + B 토글, ESC 닫기
  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      setOpen((o) => !o);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  return (
    <>
      {/* 좌측 끝 핸들(토글 버튼) */}
      <button
        aria-label={open ? "사이드바 닫기" : "사이드바 열기"}
        onClick={() => setOpen((o) => !o)}
        className="fixed left-2 top-1/2 z-50 h-10 w-10 -translate-y-1/2 rounded-xl border border-white/20 bg-black/70 hover:bg-white/10 focus:outline-none"
      >
        {/* 햄버거 아이콘 (심플한 CSS 막대 3개) */}
        <span aria-hidden className="mx-auto mb-1.5 block h-0.5 w-5 bg-white" />
        <span aria-hidden className="mx-auto mb-1.5 block h-0.5 w-5 bg-white" />
        <span aria-hidden className="mx-auto block h-0.5 w-5 bg-white" />
      </button>

      {/* 오버레이 */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0"
        }`}
      />

      {/* 사이드바 패널 */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed left-0 top-0 z-50 h-screen w-[280px] bg-black border-r border-white/15 shadow-2xl transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          {/* 메뉴 텍스트를 최소화. 필요하면 아래에 항목을 더 추가하세요. */}
          <nav className="space-y-2 text-base">
            <Link href="/" className="block rounded-lg px-3 py-2 hover:bg-white/10">
              Home
            </Link>
            <Link href="/blog" className="block rounded-lg px-3 py-2 hover:bg-white/10">
              Blog
            </Link>
          </nav>

          <div className="mt-8 border-t border-white/10 pt-4 text-xs opacity-50">
            ⌘/Ctrl + B: 토글 · Esc: 닫기
          </div>
        </div>
      </aside>
    </>
  );
}
