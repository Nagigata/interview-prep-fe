import { getAdminDashboard, getAdminStats } from "@/lib/actions/admin.actions";
import AdminDashboardClient from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const [dashboard, stats] = await Promise.all([
    getAdminDashboard(),
    getAdminStats(),
  ]);

  return <AdminDashboardClient dashboard={dashboard} stats={stats} />;
}
