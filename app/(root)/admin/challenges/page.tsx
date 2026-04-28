import {
  getAdminChallenges,
  getAdminSkills,
} from "@/lib/actions/admin.actions";
import AdminChallengesClient from "@/components/admin/AdminChallenges";

export default async function AdminChallengesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const search = params.search || "";
  const [data, skills] = await Promise.all([
    getAdminChallenges({ page, limit: 10, search }),
    getAdminSkills(),
  ]);

  return (
    <AdminChallengesClient
      data={data}
      skills={skills}
      currentPage={page}
      currentSearch={search}
    />
  );
}
