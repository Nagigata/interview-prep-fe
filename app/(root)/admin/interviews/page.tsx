import { getAdminInterviews } from "@/lib/actions/admin.actions";
import AdminInterviewsClient from "@/components/admin/AdminInterviews";

export default async function AdminInterviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const search = params.search || "";
  const data = await getAdminInterviews({ page, limit: 10, search });

  return <AdminInterviewsClient data={data} currentPage={page} currentSearch={search} />;
}
