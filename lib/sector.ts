// lib/sector.ts
export const SECTORS = [
  { value: "energy",                  label: "에너지" },
  { value: "materials",               label: "소재" },
  { value: "industrials",             label: "산업재" },
  { value: "staples",                 label: "필수소비재" },
  { value: "autos",                   label: "자동차" },
  { value: "hotels",                  label: "호텔" },
  { value: "healthcare",              label: "건강관리" },
  { value: "communication-services",  label: "커뮤니케이션서비스" },
  { value: "financials",              label: "금융" },
  { value: "it",                      label: "IT" },
  { value: "utilities",               label: "유틸리티" },
] as const;

export type SectorValue = typeof SECTORS[number]["value"];
export const isValidSector = (v: string): v is SectorValue =>
  SECTORS.some((s) => s.value === v);
export const sectorLabel = (v: string) =>
  SECTORS.find((s) => s.value === v)?.label ?? v;
