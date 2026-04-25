import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  CalendarDays,
  MessageSquareText,
  Star,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewAttemptById } from "@/lib/actions/general.action";
import { cn } from "@/lib/utils";

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

const AttemptTranscriptPage = async ({
  params,
}: {
  params: Promise<Record<string, string>>;
}) => {
  const { id, attemptId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const attempt = await getInterviewAttemptById(attemptId);

  if (!attempt || attempt.interviewId !== id) {
    redirect(`/interview/${id}/attempts`);
  }

  const cookieStore = await cookies();
  const timeZone = cookieStore.get("USER_TIMEZONE")?.value || "UTC";
  const completedAt = formatDateTime(
    attempt.completedAt || attempt.createdAt,
    timeZone,
  );

  return (
    <section className="flex flex-col gap-8">
      <div className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(92,114,255,0.18),_transparent_34%),linear-gradient(135deg,#1d1f24_0%,#11141a_100%)] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href={`/interview/${id}/attempts`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-100 hover:text-primary-200"
            >
              <ArrowLeft size={16} />
              Back to attempt history
            </Link>

            <h1 className="mt-4 text-4xl font-bold capitalize text-white">
              {attempt.interview.role} Transcript
            </h1>
            <p className="mt-3 max-w-2xl text-light-100">
              Review the conversation captured during this interview attempt.
            </p>

            <div className="mt-5 flex flex-wrap gap-4 text-sm text-light-300">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} />
                {completedAt}
              </span>
              <span className="inline-flex items-center gap-2">
                <MessageSquareText size={16} />
                {attempt.transcripts.length} messages
              </span>
              <span className="inline-flex items-center gap-2">
                <Star size={16} />
                {attempt.feedback
                  ? `${attempt.feedback.totalScore}/100`
                  : "No feedback yet"}
              </span>
            </div>
          </div>

          {attempt.feedback && (
            <Button className="btn-primary">
              <Link href={`/interview/${id}/feedback?attemptId=${attempt.id}`}>
                View Feedback
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-[32px] border border-white/8 bg-[#12151b] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
        {attempt.transcripts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg font-semibold text-white">
              No transcript messages saved
            </p>
            <p className="mt-2 text-light-400">
              This can happen if the call ended before transcript data was
              returned.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {attempt.transcripts.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    isUser ? "justify-end" : "justify-start",
                  )}
                >
                  {!isUser && (
                    <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-200/15 text-primary-100">
                      <Bot size={19} />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[78%] rounded-[22px] px-5 py-4",
                      isUser
                        ? "bg-primary-200 text-dark-100"
                        : "border border-white/8 bg-white/[0.05] text-light-100",
                    )}
                  >
                    <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] opacity-70">
                      {isUser ? "You" : "AI Interviewer"}
                    </div>
                    <p
                      className={cn(
                        "whitespace-pre-wrap leading-7",
                        isUser ? "text-black" : "text-light-100",
                      )}
                    >
                      {message.content}
                    </p>
                  </div>

                  {isUser && (
                    <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-200 text-dark-100">
                      <UserRound size={19} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default AttemptTranscriptPage;
