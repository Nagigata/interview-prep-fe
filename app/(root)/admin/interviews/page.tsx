import { getAdminInterviews } from "@/lib/actions/admin.actions";
import AdminInterviewsClient from "@/components/admin/AdminInterviews";

export default async function AdminInterviewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    type?: string;
    level?: string;
  }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const search = params.search || "";
  const status = params.status || "";
  const type = params.type || "";
  const level = params.level || "";
  const data = await getAdminInterviews({
    page,
    limit: 10,
    search,
    status,
    type,
    level,
  });

  return (
    <AdminInterviewsClient
      data={data}
      currentPage={page}
      currentSearch={search}
      currentStatus={status}
      currentType={type}
      currentLevel={level}
    />
  );
}
