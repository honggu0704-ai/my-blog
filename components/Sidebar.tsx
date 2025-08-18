"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  "에너지",
  "소재",
  "산업재",
  "필수소비재",
  "자동차",
  "호텔",
  "건강관리",
  "커뮤니케이션서비스",
  "금융",
  "IT",
  "유틸리티",
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  // 사이드바 열릴 때 뒤 스크롤 잠금
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      {/* 좌측 상단의 작은 흰색 동그라미 버튼
          - 헤더와 같은 줄이 되지 않도록 한 줄 아래 배치(top-16 ≈ 64px) */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "사이드바 닫기" : "사이드바 열기"}
        className="fixed left-3 top-16 z-[60] h-8 w-8 rounded-full bg-white focus:outline-none"
      >
        <span className="sr-only">{open ? "사이드바 닫기" : "사이드바 열기"}</span>
      </button>

      {/* 오버레이(빈 여백) 클릭 시 닫힘 */}
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
        className={`fixed left-0 top-0 z-50 h-screen w-[280px] bg-black border-r border-white/15 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="p-4">
          <ul className="space-y-1">
            {ITEMS.map((label) => (
              <li key={label} className="px-3 py-2 select-none">
                {label}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
