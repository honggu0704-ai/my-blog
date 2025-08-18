"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "login failed");
      router.replace("/admin");
    } catch (err: any) {
      setMsg(err?.message || "에러");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-xl mb-4">관리자 로그인</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="password"
          placeholder="관리자 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black text-white rounded border border-white/20 px-3 py-2"
          autoFocus
          required
        />
        <button type="submit" disabled={loading} className="rounded border border-white/50 px-4 py-2">
          {loading ? "확인 중…" : "로그인"}
        </button>
        {msg && <div className="text-red-400">{msg}</div>}
      </form>
    </div>
  );
}
