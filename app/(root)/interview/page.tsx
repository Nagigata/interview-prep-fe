import Link from "next/link";
import { cookies } from "next/headers";
import { BrainCircuit, Mic2, Sparkles } from "lucide-react";

import InterviewCard from "@/components/InterviewCard";
import { getDictionary } from "@/lib/i18n";
import { getMyProfile } from "@/lib/actions/user.actions";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

const page = async () => {
  const user = await getMyProfile();

  if (!user) {
    return null;
  }

  const [myInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id, limit: 6 }),
  ]);

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const t = getDictionary(locale);

  return (
    <div className="flex flex-col gap-8">
      <section className="relative animate-fadeIn overflow-hidden rounded-[34px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(202,197,254,0.2),_transparent_28%),linear-gradient(155deg,_rgba(18,22,30,0.98),_rgba(8,10,14,0.98))] px-7 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:px-10 sm:py-10">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary-200/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.4fr_0.5fr] xl:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/15 bg-primary-200/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-100">
              <Sparkles size={14} />
              AI Interview
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <BrainCircuit className="text-primary-100" size={30} />
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {t.agent.aiInterviewer}
                </h1>
              </div>
              <p className="max-w-2xl text-base leading-7 text-light-100 sm:text-lg">
                Start a new mock interview, explore public interview templates,
                and keep your own interview sessions in one place.
              </p>
            </div>

            <Link
              href="/interview/setup"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary-200 px-5 py-3 text-sm font-extrabold text-dark-100 transition-transform hover:-translate-y-0.5"
            >
              <Mic2 size={16} />
              {t.home.startBtn}
            </Link>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[24px] border border-white/8 bg-white/[0.04] px-5 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
              <div className="mb-5 flex items-start justify-between gap-4">
                <span className="text-sm font-medium text-light-100/90">
                  Your interviews
                </span>
                <Mic2 size={18} className="shrink-0 text-primary-100" />
              </div>
              <div className="text-3xl font-bold text-white">
                {myInterviews?.length || 0}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="flex flex-col gap-5 animate-fadeIn"
        style={{ animationDelay: "0.08s", animationFillMode: "both" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            {t.home.yourInterviews}
          </h2>
          <span className="text-sm text-light-400">
            {myInterviews?.length || 0} sessions
          </span>
        </div>

        <div className="interviews-section">
          {myInterviews && myInterviews.length > 0 ? (
            myInterviews.slice(0, 6).map((interview) => (
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
            <p className="text-light-400">{t.home.noPastInterviews}</p>
          )}
        </div>
      </section>

      <section
        className="flex flex-col gap-5 animate-fadeIn"
        style={{ animationDelay: "0.16s", animationFillMode: "both" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            {t.home.takeInterviews}
          </h2>
          <span className="text-sm text-light-400">
            {latestInterviews?.length || 0} sessions
          </span>
        </div>

        <div className="interviews-section">
          {latestInterviews && latestInterviews.length > 0 ? (
            latestInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                language={interview.language}
              />
            ))
          ) : (
            <p className="text-light-400">{t.home.noUpcomingInterviews}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default page;
