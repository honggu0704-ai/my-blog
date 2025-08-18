// app/admin/page.tsx (서버 컴포넌트)
import { redirect } from "next/navigation";
import { isAdminByCookie } from "../../lib/auth";
import AdminEditor from "../../components/AdminEditor";

export default function AdminPage() {
  if (!isAdminByCookie()) redirect("/login");
  return <AdminEditor />;
}
