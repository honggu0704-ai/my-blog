// app/admin/page.tsx
import { redirect } from "next/navigation";
import { isAdminByCookie } from "../../lib/auth";
import AdminUploader from "../../components/AdminUploader";

export default async function AdminPage() {
  const isAdmin = await isAdminByCookie();
  if (!isAdmin) redirect("/login");
  return <AdminUploader />;
}
