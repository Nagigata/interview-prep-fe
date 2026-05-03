import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  House,
  Minus,
  CheckCircle2,
} from "lucide-react";

import {
  getFeedbackByAttemptId,
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/i18n";

const Feedback = async ({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const attemptId =
    typeof resolvedSearchParams.attemptId === "string"
      ? resolvedSearchParams.attemptId
      : undefined;
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = attemptId
    ? await getFeedbackByAttemptId({ attemptId, userId: user.id })
    : await getFeedbackByInterviewId({ interviewId: id, userId: user.id });

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const t = getDictionary(locale);

  const score = feedback?.totalScore ?? 0;
  const scoreColor =
    score >= 80
      ? "text-emerald-400"
      : score >= 50
        ? "text-amber-400"
        : "text-red-400";
  const scoreBg =
    score >= 80
      ? "bg-emerald-500/15 border-emerald-500/20"
      : score >= 50
        ? "bg-amber-500/15 border-amber-500/20"
        : "bg-red-500/15 border-red-500/20";

  return (
    <section className="mx-auto max-w-4xl space-y-8 max-sm:px-4">
      {/* Back link */}
      <Link
        href={`/interview/${id}/attempts`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-100 hover:text-primary-200 transition-colors"
      >
        <ArrowLeft size={16} />
        {/* {t.interviewCard.viewAttempts} */}
        Back to Attempt History
      </Link>

      {/* Hero header */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(202,197,254,0.16),_transparent_34%),linear-gradient(135deg,#1d1f24_0%,#11141a_100%)] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {t.feedback.title}
              <span className="capitalize text-primary-100">
                {interview.role}
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-light-300">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={15} />
                {feedback?.createdAt
                  ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Score ring */}
          <div
            className={`flex flex-col items-center justify-center rounded-2xl border ${scoreBg} px-10 py-5`}
          >
            <span className={`text-4xl font-extrabold ${scoreColor}`}>
              {score}
            </span>
            <Minus size={12} className="text-xs text-light-400 mt-1" />
            <span className="text-xs text-light-400 mt-1">100</span>
          </div>
        </div>
      </div>

      {/* Final Assessment */}
      <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-6">
        <p className="text-base leading-7 text-light-100">
          {feedback?.finalAssessment}
        </p>
      </div>

      {/* Category Breakdown */}
      {feedback?.categoryScores && feedback.categoryScores.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">
            {t.feedback.breakdown}
          </h2>
          <div className="grid gap-3">
            {feedback.categoryScores.map((category, index) => {
              const catScoreColor =
                category.score >= 80
                  ? "text-emerald-400"
                  : category.score >= 50
                    ? "text-amber-400"
                    : "text-red-400";
              const catBarColor =
                category.score >= 80
                  ? "bg-emerald-400"
                  : category.score >= 50
                    ? "bg-amber-400"
                    : "bg-red-400";

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-white/6 bg-white/[0.03] p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white">
                      {category.name}
                    </h3>
                    <span
                      className={`text-sm font-extrabold ${catScoreColor}`}
                    >
                      {category.score}/100
                    </span>
                  </div>
                  {/* Score bar */}
                  <div className="h-1.5 w-full rounded-full bg-white/10 mb-3">
                    <div
                      className={`h-full rounded-full ${catBarColor} transition-all`}
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-light-400 leading-relaxed">
                    {category.comment}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Strengths & Improvements */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Strengths */}
        {feedback?.strengths && feedback.strengths.length > 0 && (
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <h3 className="text-sm font-bold text-emerald-400">
                {t.feedback.strengths}
              </h3>
            </div>
            <ul className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-light-100 leading-relaxed"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {feedback?.areasForImprovement &&
          feedback.areasForImprovement.length > 0 && (
            <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-amber-400" />
                <h3 className="text-sm font-bold text-amber-400">
                  {t.feedback.areasForImprovement}
                </h3>
              </div>
              <ul className="space-y-2">
                {feedback.areasForImprovement.map((area, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-light-100 leading-relaxed"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-400" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center pt-2 pb-4">
        <Link
          href="/interview"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-light-100 transition-colors hover:bg-white/5"
        >
          <House size={16} />
          {t.feedback.backToInterviews}
        </Link>

        <Link
          href={`/interview/${id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-200 px-5 py-3 text-sm font-bold text-dark-100 transition-colors hover:bg-primary-200/80"
        >
          <RotateCcw size={16} />
          {t.common.retakeInterview}
        </Link>
      </div>
    </section>
  );
};

export default Feedback;
