import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getMyProfile } from "@/lib/actions/user.actions";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const profile = await getMyProfile();

  if (!profile || profile.role !== "ADMIN") {
    redirect("/preparation");
  }

  return (
    <div className="min-h-screen bg-dark-100">
      <AdminSidebar />
      <main className="ml-60 pt-16 p-8">{children}</main>
    </div>
  );
}
