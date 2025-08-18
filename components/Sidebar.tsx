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
  const [selected, setSelected] = useState<string>("");

  // 선택 유지(선택 항목 기억)
  useEffect(() => {
    const v = localStorage.getItem("sb-selected");
    if (v) setSelected(v);
  }, []);
  useEffect(() => {
    if (selected) localStorage.setItem("sb-selected", selected);
  }, [selected]);

  return (
    <aside
      aria-label="섹터 목록"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 select-none"
    >
      <ul className="space-y-6"> {/* 넓직한 간격 */}
        {ITEMS.map((label) => {
          const active = selected === label;
          return (
            <li key={label}>
              <button
                onClick={() => setSelected(label)}
                className={[
                  "block text-base tracking-wide transition",
                  "pl-4 border-l-2",                       // 왼쪽 라인
                  active ? "opacity-100 font-semibold border-white"
                         : "opacity-70 hover:opacity-100 border-white/20",
                ].join(" ")}
                aria-pressed={active}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
