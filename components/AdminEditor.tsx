// components/AdminEditor.tsx
"use client";

import { useState } from "react";

export default function AdminEditor() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const makeSlug = () => {
    const s = (title || "")
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\-가-힣]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(s);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/new-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, date, summary, tags, body }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "save failed");
      setMsg(`저장 완료: ${json.path}`);
    } catch (err: any) {
      setMsg(err?.message || "에러");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      <h1 className="text-2xl mb-2">새 글 작성</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-black text-white rounded border border-white/20 px-3 py-2"
            required
          />
          <button type="button" onClick={makeSlug} className="rounded border border-white/30 px-3">
            슬러그 생성
          </button>
        </div>

        <input
          placeholder="슬러그(선택)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full bg-black text-white rounded border border-white/20 px-3 py-2"
        />

        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-black text-white rounded border border-white/20 px-3 py-2"
          />
          <input
            placeholder="요약(선택)"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="flex-1 bg-black text-white rounded border border-white/20 px-3 py-2"
          />
        </div>

        <input
          placeholder="태그(쉼표로 구분, 예: 경제,시장)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full bg-black text-white rounded border border-white/20 px-3 py-2"
        />

        <textarea
          placeholder="본문(Markdown)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full min-h-[40vh] bg-black text-white rounded border border-white/20 px-3 py-2"
          required
        />

        <button type="submit" disabled={saving} className="rounded border border-white/50 px-4 py-2">
          {saving ? "저장 중…" : "저장"}
        </button>

        {msg && <div className="text-white/80">{msg}</div>}
      </form>
    </div>
  );
}
