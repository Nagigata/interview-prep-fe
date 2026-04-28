import { getAdminSkills } from "@/lib/actions/admin.actions";
import AdminSkillsClient from "@/components/admin/AdminSkills";

export default async function AdminSkillsPage() {
  const skills = await getAdminSkills();
  return <AdminSkillsClient skills={skills} />;
}
