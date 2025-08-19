// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTORS } from "../lib/sector";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40 select-none">
      <ul className="space-y-6">
        {SECTORS.map((s) => {
          const href = `/sector/${s.value}`;
          const active = pathname?.startsWith(href);
          return (
            <li key={s.value}>
              <Link
                href={href}
                className={[
                  "block text-base tracking-wide transition pl-4 border-l-2",
                  active ? "opacity-100 font-semibold border-white"
                         : "opacity-70 hover:opacity-100 border-white/20",
                ].join(" ")}
              >
                {s.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
