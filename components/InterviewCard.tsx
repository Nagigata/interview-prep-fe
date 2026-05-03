"use client";

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Calendar, Star, Clock } from "lucide-react";

import DisplayTechIcons from "./DisplayTechIcons";
import { getDictionary } from "@/lib/i18n";
import { Feedback, InterviewCardProps } from "@/types";

interface InterviewCardProps2 extends InterviewCardProps {
  feedback?: Feedback | null;
  locale?: string;
  showDelete?: boolean;
  attemptCount?: number;
  onDelete?: () => void;
}

const typeStyles: Record<string, string> = {
  Technical: "bg-indigo-500/15 text-indigo-300 border-indigo-500/20",
  Behavioral: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  Mixed: "bg-amber-500/15 text-amber-300 border-amber-500/20",
};

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  language,
  feedback,
  locale = "en",
  showDelete,
  attemptCount = 0,
  onDelete,
}: InterviewCardProps2) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const t = getDictionary(locale);

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now(),
  ).format("MMM D, YYYY");

  const score = feedback?.totalScore;
  const scoreColor = score
    ? score >= 80
      ? "text-emerald-400"
      : score >= 50
        ? "text-amber-400"
        : "text-red-400"
    : "text-light-400";

  return (
    <div className="group relative w-[360px] max-sm:w-full">
      <div className="relative flex flex-col rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#1a1d25] to-[#12141a] p-5 transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
        {/* Delete button */}
        {showDelete && onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-dark-200/80 border border-white/10 text-light-400 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-200"
            title="Delete interview"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}

        {/* Header — badges */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${typeStyles[normalizedType] || typeStyles.Mixed}`}
          >
            {normalizedType}
          </span>
          {language && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1">
              <Image
                src={
                  language === "vi"
                    ? "https://flagcdn.com/vn.svg"
                    : "https://flagcdn.com/gb.svg"
                }
                alt={language}
                width={16}
                height={11}
                className="object-cover rounded-[2px]"
              />
              <span className="text-[11px] font-semibold text-light-100 uppercase">
                {language === "vi" ? "VI" : "EN"}
              </span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white capitalize leading-tight mb-3">
          {role} {t.interviewCard.mockInterview}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-4 mb-4 text-xs text-light-400">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5 text-light-600" />
            {formattedDate}
          </span>
          <span className={`inline-flex items-center gap-1.5 font-semibold ${scoreColor}`}>
            <Star className="size-3.5" />
            {score ? `${score}/100` : "---"}
          </span>
          {attemptCount > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-light-600" />
              {attemptCount} attempt{attemptCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Assessment preview */}
        <p className="text-sm text-light-400 leading-relaxed line-clamp-2 mb-5 min-h-[40px]">
          {feedback?.finalAssessment || t.interviewCard.notTakenMsg}
        </p>

        {/* Tech Stack */}
        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.05] px-4 py-3 mb-5">
          <span className="text-xs text-light-400 font-medium">Tech Stack</span>
          <DisplayTechIcons techStack={techstack} />
        </div>

        {/* Actions */}
        {feedback ? (
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/interview/${interviewId}/attempts`}
              className="flex items-center justify-center rounded-xl bg-primary-200 px-4 py-2.5 text-xs font-bold text-dark-100 transition-colors hover:bg-primary-200/80"
            >
              {t.interviewCard.viewAttempts}
            </Link>
            <Link
              href={`/interview/${interviewId}`}
              className="flex items-center justify-center rounded-xl border border-primary-200/30 px-4 py-2.5 text-xs font-bold text-primary-200 transition-colors hover:bg-primary-200/10"
            >
              {t.common.retakeInterview}
            </Link>
          </div>
        ) : (
          <Link
            href={`/interview/${interviewId}`}
            className="flex items-center justify-center rounded-xl bg-primary-200 px-4 py-3 text-sm font-bold text-dark-100 transition-colors hover:bg-primary-200/80"
          >
            {t.interviewCard.startInterview}
          </Link>
        )}
      </div>
    </div>
  );
};

export default InterviewCard;
