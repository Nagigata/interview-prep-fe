import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getMyProfile } from "@/lib/actions/user.actions";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const profile = await getMyProfile();

  if (!profile || profile.role !== "ADMIN") {
    redirect("/preparation");
  }

  return <AdminShell>{children}</AdminShell>;
}
