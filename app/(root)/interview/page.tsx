import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/i18n";

const page = async () => {
  const user = await getCurrentUser();

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const t = getDictionary(locale);

  return (
    <>
      <h3 className="flex justify-center mb-4">{t.agent.aiInterviewer} - Setup</h3>

      <Agent userName={user?.name!} userId={user?.id} type="generate" dictionary={t} />
    </>
  );
};

export default page;
