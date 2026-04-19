import Agent from "@/components/Agent";
import InterviewCard from "@/components/InterviewCard";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/i18n";
import { getMyProfile } from "@/lib/actions/user.actions";
import { getInterviewsByUserId } from "@/lib/actions/general.action";

const page = async () => {
  const user = await getMyProfile();

  if (!user) {
    return null;
  }

  const interviews = await getInterviewsByUserId(user.id);

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const t = getDictionary(locale);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(92,114,255,0.14),_transparent_40%),linear-gradient(135deg,#1d1f24_0%,#12151b_100%)] p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-light-400">AI Interview</p>
        <h1 className="mt-3 text-4xl font-bold text-white">{t.agent.aiInterviewer}</h1>
        <p className="mt-3 max-w-3xl text-light-100">
          Configure your interview session, pick your language, and continue reviewing your recent mock interviews below.
        </p>
      </section>

      <section>
        <Agent userName={user.name} userId={user.id} type="generate" dictionary={t} />
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Your Recent Interviews</h2>
          <span className="text-sm text-light-400">{interviews?.length || 0} sessions</span>
        </div>

        <div className="interviews-section">
          {interviews && interviews.length > 0 ? (
            interviews.slice(0, 6).map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                language={interview.language}
              />
            ))
          ) : (
            <p className="text-light-400">You have not completed any interviews yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default page;
