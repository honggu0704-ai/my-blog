// 항상 노출되는 고정 사이드바 (토글/오버레이 없음)

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
  return (
    <aside
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 w-64"
      aria-label="섹터 목록"
    >
      {/* 흰색 라운드 사각형 컨테이너 (투명 배경 + 흰색 테두리) */}
      <div className="rounded-2xl border border-white/25 p-4">
        <ul className="space-y-2">
          {ITEMS.map((label) => (
            <li key={label} className="select-none text-white text-sm">
              {label}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
