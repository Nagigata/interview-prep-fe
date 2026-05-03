import { getAdminUsers } from "@/lib/actions/admin.actions";
import { getMyProfile } from "@/lib/actions/user.actions";
import AdminUsersClient from "@/components/admin/AdminUsers";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const search = params.search || "";
  const [data, profile] = await Promise.all([
    getAdminUsers({ page, limit: 10, search }),
    getMyProfile(),
  ]);

  return (
    <AdminUsersClient
      data={data}
      currentPage={page}
      currentSearch={search}
      currentUserId={profile?.id || ""}
    />
  );
}
