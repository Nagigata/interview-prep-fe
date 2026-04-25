import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  FileText,
  History,
  MessageSquareText,
  RotateCcw,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewAttempts,
  getInterviewById,
} from "@/lib/actions/general.action";

const formatDateTime = (value: string | null | undefined, timeZone: string) => {
  if (!value) {
    return "Not completed yet";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date(value));
};

const AttemptsPage = async ({
  params,
}: {
  params: Promise<Record<string, string>>;
}) => {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [interview, attempts] = await Promise.all([
    getInterviewById(id),
    getInterviewAttempts(id),
  ]);

  if (!interview) {
    redirect("/interview");
  }

  const cookieStore = await cookies();
  const timeZone = cookieStore.get("USER_TIMEZONE")?.value || "UTC";

  return (
    <section className="flex flex-col gap-8">
      <div className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(202,197,254,0.16),_transparent_34%),linear-gradient(135deg,#1d1f24_0%,#11141a_100%)] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/20 bg-primary-200/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-100">
              <History size={14} />
              Attempt History
            </div>
            <h1 className="mt-4 text-4xl font-bold capitalize text-white">
              {interview.role} Interview
            </h1>
            <p className="mt-3 max-w-2xl text-light-100">
              Review every time you took this interview, compare scores, and reopen the feedback for each attempt.
            </p>
          </div>

          <Button className="btn-primary">
            <Link href={`/interview/${id}`} className="flex items-center gap-2">
              <RotateCcw size={16} />
              Retake Interview
            </Link>
          </Button>
        </div>
      </div>

      {!attempts || attempts.length === 0 ? (
        <div className="rounded-[28px] border border-white/8 bg-white/[0.04] p-8 text-center">
          <p className="text-lg font-semibold text-white">No attempts yet</p>
          <p className="mt-2 text-light-400">
            Start this interview once and your result will appear here.
          </p>
          <Button className="btn-primary mt-5">
            <Link href={`/interview/${id}`}>Start Interview</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {attempts.map((attempt, index) => {
            const feedback = attempt.feedback;
            const displayDate = formatDateTime(
              attempt.completedAt || attempt.createdAt,
              timeZone,
            );

            return (
              <article
                key={attempt.id}
                className="rounded-[28px] border border-white/8 bg-[#171a20] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-primary-200 px-3 py-1 text-sm font-extrabold text-dark-100">
                        Attempt #{attempts.length - index}
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm text-light-300">
                        <CalendarDays size={16} />
                        {displayDate}
                      </span>
                    </div>

                    <p className="line-clamp-2 max-w-3xl text-light-100">
                      {feedback?.finalAssessment ||
                        "This attempt has not generated feedback yet."}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-light-400">
                      <span className="inline-flex items-center gap-2">
                        <Star size={16} />
                        {feedback ? `${feedback.totalScore}/100` : "No score"}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <MessageSquareText size={16} />
                        {attempt.transcriptCount || 0} transcript messages
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button className="bg-dark-200 text-primary-200 border border-primary-200/40 hover:bg-dark-300">
                      <Link
                        href={`/interview/${id}/attempts/${attempt.id}`}
                        className="flex items-center gap-2"
                      >
                        <FileText size={16} />
                        View Transcript
                      </Link>
                    </Button>

                    {feedback ? (
                      <Button className="bg-primary-200 text-dark-100 hover:bg-primary-200/80">
                        <Link href={`/interview/${id}/feedback?attemptId=${attempt.id}`}>
                          View Feedback
                        </Link>
                      </Button>
                    ) : (
                      <Button disabled className="bg-dark-300 text-light-400">
                        Feedback Pending
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AttemptsPage;
