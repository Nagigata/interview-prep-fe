import { getAdminUsers } from "@/lib/actions/admin.actions";
import AdminUsersClient from "@/components/admin/AdminUsers";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const search = params.search || "";
  const data = await getAdminUsers({ page, limit: 10, search });

  return <AdminUsersClient data={data} currentPage={page} currentSearch={search} />;
}
