import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/i18n";
import { InterviewCardProps } from "@/types";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  language,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
        interviewId,
        userId,
      })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const t = getDictionary(locale);

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now(),
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 flex max-sm:flex-col">
            {/* Language Badge */}
            {language && (
              <div className={cn("px-4 py-2 rounded-bl-lg max-sm:rounded-bl-none max-sm:rounded-tl-none bg-dark-200/50 backdrop-blur-sm text-white border-b border-l border-white/10 flex items-center gap-2")}>
                <Image
                  src={language === "vi" ? "https://flagcdn.com/vn.svg" : "https://flagcdn.com/gb.svg"}
                  alt={language}
                  width={24}
                  height={16}
                  className="object-cover"
                />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {language === "vi" ? "VI" : "EN"}
                </span>
              </div>
            )}

            {/* Type Badge */}
            <div
              className={cn(
                "px-4 py-2  max-sm:rounded-bl-none max-sm:rounded-tl-none",
                badgeColor,
              )}
            >
              <p className="badge-text">{normalizedType}</p>
            </div>
          </div>

          {/* Role Initial Avatar */}
          {/* <div className="flex items-center justify-center bg-primary-200/20 text-primary-200 font-bold text-4xl rounded-full size-[72px] mt-4 shadow-inner ring-1 ring-primary-200/50">
            {role ? role.charAt(0).toUpperCase() : "I"}
          </div> */}

          {/* Interview Role */}
          <h3 className="mt-5 capitalize">
            {role} {t.interviewCard.mockInterview}
          </h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar"
              />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" width={22} height={22} alt="star" />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment || t.interviewCard.notTakenMsg}
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-4 border-t border-dark-300 pt-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-light-100">Tech Stack:</span>
            <DisplayTechIcons techStack={techstack} />
          </div>

          {feedback ? (
            <Button className="w-full bg-primary-200 text-dark-100 hover:bg-primary-200/80 rounded-lg font-bold min-h-12 transition-all">
              <Link
                href={`/interview/${interviewId}/feedback`}
                className="px-6 flex items-center justify-center w-full h-full"
              >
                {t.interviewCard.viewFeedback}
              </Link>
            </Button>
          ) : (
            <Button className="w-full bg-primary-200 text-dark-100 hover:bg-primary-200/80 rounded-lg font-bold min-h-12 transition-all">
              <Link
                href={`/interview/${interviewId}`}
                className="px-6 flex items-center justify-center w-full h-full"
              >
                {t.interviewCard.startInterview}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
