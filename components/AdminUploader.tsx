// components/AdminUploader.tsx
"use client";

import { useState } from "react";
import { SECTORS, SectorValue } from "../lib/sector";

function toSlugClient(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\-가-힣]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminUploader() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [sector, setSector] = useState<SectorValue | "">("");
  const [file, setFile] = useState<File | null>(null);

  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const [delSlug, setDelSlug] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    if (!file) {
      setMsg("파일을 선택해 주세요.");
      return;
    }
    try {
      setSaving(true);
      const fd = new FormData();
      fd.set("title", title);
      if (slug) fd.set("slug", slug);
      fd.set("date", date);
      fd.set("sector", String(sector));
      fd.set("file", file, file.name);

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "업로드 실패");
      setMsg(`업로드 완료: ${json.pathMeta} / ${json.pathFile}`);
    } catch (err: any) {
      setMsg(err?.message || "에러");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!delSlug) { setMsg("삭제할 슬러그를 입력하세요."); return; }
    setMsg("");
    const ok = confirm(`정말 삭제합니까? slug=${delSlug}`);
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/delete?slug=${encodeURIComponent(delSlug)}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "삭제 실패");
      setMsg(`삭제 완료: ${json.deleted?.join(", ") || ""}`);
    } catch (err: any) {
      setMsg(err?.message || "에러");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl">파일 업로드</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            placeholder="제목"
            value={title}
            onChange={(e) => {
              const v = e.target.value;
              setTitle(v);
              if (!slugTouched) setSlug(toSlugClient(v));
            }}
            className="flex-1 bg-black text-white rounded border border-white/20 px-3 py-2"
            required
          />
          <input
            placeholder="슬러그(선택)"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
            className="w-64 bg-black text-white rounded border border-white/20 px-3 py-2"
          />
        </div>

        {(slug || title) && (
          <div className="text-xs opacity-60">
            URL 미리보기: /blog/{slug || toSlugClient(title)}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-black text-white rounded border border-white/20 px-3 py-2"
          />
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value as SectorValue)}
            required
            className="flex-1 bg-black text-white rounded border border-white/20 px-3 py-2"
          >
            <option value="">섹터 선택</option>
            {SECTORS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full bg-black text-white rounded border border-white/20 px-3 py-2"
          required
        />

        <button type="submit" disabled={saving} className="rounded border border-white/50 px-4 py-2">
          {saving ? "업로드 중…" : "업로드"}
        </button>

        {msg && <div className="text-white/80 text-sm">{msg}</div>}
      </form>

      <div className="border-t border-white/10 pt-4 space-y-2">
        <h2 className="text-lg">글/파일 삭제</h2>
        <div className="flex gap-2">
          <input
            placeholder="슬러그 입력 (예: 2025-08-19-energy-report)"
            value={delSlug}
            onChange={(e) => setDelSlug(e.target.value)}
            className="flex-1 bg-black text-white rounded border border-white/20 px-3 py-2"
          />
          <button onClick={onDelete} className="rounded border border-red-400 px-4 py-2 text-red-300">
            삭제
          </button>
        </div>
        <div className="text-xs opacity-60">슬러그에 해당하는 메타(.md)와 /public/files/&lt;slug&gt; 아래 파일을 삭제합니다.</div>
      </div>
    </div>
  );
}
