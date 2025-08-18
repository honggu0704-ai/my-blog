import Link from "next/link";

export default function AdminFab() {
  return (
    <Link
      href="/admin"
      className="fixed right-6 bottom-6 z-50 rounded-full bg-white text-black px-4 py-2"
      aria-label="글쓰기"
      title="글쓰기"
    >
      ✏️
    </Link>
  );
}
