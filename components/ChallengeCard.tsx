"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Check } from "lucide-react";
import { Challenge, Difficulty } from "@/types";
import { cn } from "@/lib/utils";
import { toggleChallengeStar } from "@/lib/actions/challenges.action";

interface ChallengeCardProps {
  challenge: Challenge;
  skillSlug: string;
  dictionary: any;
}

const ChallengeCard = ({ challenge, skillSlug, dictionary }: ChallengeCardProps) => {
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

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "EASY": return "text-success-100 bg-success-100/10 border-success-100/20";
      case "MEDIUM": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "HARD": return "text-destructive-100 bg-destructive-100/10 border-destructive-100/20";
      default: return "text-light-400 bg-light-400/10 border-light-400/20";
    }
  };

  const formatDifficulty = (diff: string) => {
    return diff.charAt(0) + diff.slice(1).toLowerCase();
  };

  return (
    <div
      onClick={() => router.push(`/preparation/${skillSlug}/${challenge.id}`)}
      className="cursor-pointer card-border group hover:scale-[1.005] transition-all duration-200 w-full mb-1"
    >
      <div className="card-interview flex flex-row items-center justify-between p-7 gap-8 w-full">
        {/* Left Side: Info */}
        <div className="flex flex-col gap-2.5 flex-1 min-w-0 ">
          <div className="flex flex-col gap-2">
            {/* Title */}
            <h3 className="text-xl font-bold text-white group-hover:text-primary-100 transition-colors">
              {challenge.title}
            </h3>

            {/* Meta Labels */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                getDifficultyColor(challenge.difficulty)
              )}>
                {formatDifficulty(challenge.difficulty)}
              </span>
              {challenge.topics && challenge.topics.split(", ").slice(0, 3).map((topic) => (
                <span key={topic} className="text-[10px] text-light-400 bg-dark-200 px-2 py-0.5 rounded border border-white/5">
                  {topic}
                </span>
              ))}
              {challenge.topics && challenge.topics.split(", ").length > 3 && (
                <span className="text-[10px] text-light-600">+{challenge.topics.split(", ").length - 3} more</span>
              )}
            </div>
          </div>

          <p className="text-sm text-light-100 line-clamp-1 max-w-2xl opacity-70">
            {challenge.description}
          </p>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-6">
          {/* Star Toggle */}
          <button
            onClick={handleToggleStar}
            disabled={isLoading}
            className={cn(
              "rounded-full transition-all duration-200 ",
              isStarred ? "text-yellow-400" : "text-light-400/30 hover:text-light-400"
            )}
            title={isStarred ? "Unmark" : "Mark Star"}
          >
            <Star
              size={20}
              fill={isStarred ? "currentColor" : "white"}
              strokeWidth={2}
            />
          </button>

          {/* Solve Button */}
          {challenge.isSolved ? (
            <div className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-success-100/30 bg-success-100/5 text-success-100 font-bold text-sm min-w-[160px]">
              <span>Solved</span>
              <Check size={16} strokeWidth={3} />
            </div>
          ) : (
            <div
              className="flex items-center justify-center px-6 py-2.5 rounded-xl bg-primary-200 text-dark-100 font-extrabold text-sm group-hover:bg-primary-100 transition-all shadow-lg shadow-primary-200/10 min-w-[160px]"
            >
              Solve Challenge
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
