// app/admin/page.tsx
import { redirect } from "next/navigation";
import { isAdminByCookie } from "../../lib/auth";
import AdminEditor from "../../components/AdminEditor";

export default async function AdminPage() {
  const isAdmin = await isAdminByCookie();
  if (!isAdmin) redirect("/login");
  return <AdminEditor />;
}
