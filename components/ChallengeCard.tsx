"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Check, ChevronRight } from "lucide-react";
import { Challenge, Difficulty } from "@/types";
import { cn } from "@/lib/utils";
import { toggleChallengeStar } from "@/lib/actions/challenges.action";

interface ChallengeCardProps {
  challenge: Challenge;
  skillSlug: string;
  dictionary: any;
}

const difficultyStyles: Record<Difficulty, string> = {
  EASY: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  MEDIUM: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  HARD: "bg-red-500/15 text-red-300 border-red-500/20",
};

const ChallengeCard = ({
  challenge,
  skillSlug,
  dictionary,
}: ChallengeCardProps) => {
  const router = useRouter();
  const [isStarred, setIsStarred] = useState(challenge.isStarred);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    const result = await toggleChallengeStar(challenge.id);
    if (result) {
      setIsStarred(result.starred);
    }
    setIsLoading(false);
  };

  const formatDifficulty = (diff: string) =>
    diff.charAt(0) + diff.slice(1).toLowerCase();

  const topics = challenge.topics ? challenge.topics.split(", ") : [];

  return (
    <div
      onClick={() => router.push(`/preparation/${skillSlug}/${challenge.id}`)}
      className="group cursor-pointer w-full"
    >
      <div className="relative flex flex-row items-center justify-between gap-6 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#1a1d25] to-[#12141a] p-5 transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
        {/* Left: Info */}
        <div className="flex flex-col gap-2.5 flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-lg font-bold text-white group-hover:text-primary-100 transition-colors leading-tight">
            {challenge.title}
          </h3>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-semibold",
                difficultyStyles[challenge.difficulty] ||
                  "bg-white/5 text-light-400 border-white/10",
              )}
            >
              {formatDifficulty(challenge.difficulty)}
            </span>
            {topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center rounded-lg border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-[11px] text-light-400"
              >
                {topic}
              </span>
            ))}
            {topics.length > 3 && (
              <span className="text-[11px] text-light-600">
                +{topics.length - 3} more
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-light-400 line-clamp-1 leading-relaxed">
            {challenge.description}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Star */}
          <button
            onClick={handleToggleStar}
            disabled={isLoading}
            className={cn(
              "rounded-full p-1 transition-all duration-200",
              isStarred
                ? "text-yellow-400"
                : "text-light-400/30 hover:text-light-400",
            )}
            title={isStarred ? "Unmark" : "Mark Star"}
          >
            <Star
              size={18}
              fill={isStarred ? "currentColor" : "none"}
              strokeWidth={2}
            />
          </button>

          {/* Solve / Solved */}
          {challenge.isSolved ? (
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-5 py-2.5 text-xs font-bold text-emerald-400 min-w-[140px] justify-center">
              Solved
              <Check size={14} strokeWidth={3} />
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-xl bg-primary-200 px-5 py-2.5 text-xs font-bold text-dark-100 transition-colors group-hover:bg-primary-200/80 min-w-[140px] justify-center">
              Solve Challenge
              <ChevronRight size={14} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
