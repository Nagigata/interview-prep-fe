"use client";

import ReactMarkdown from "react-markdown";
import { Challenge } from "@/types";

interface ProblemDescriptionProps {
  challenge: Challenge;
}

const ProblemDescription = ({ challenge }: ProblemDescriptionProps) => {
  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto h-full bg-dark-200/20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {challenge.title}
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${
            challenge.difficulty === "EASY" ? "text-success-100 border-success-100/20 bg-success-100/10" :
            challenge.difficulty === "MEDIUM" ? "text-orange-400 border-orange-400/20 bg-orange-400/10" :
            "text-destructive-100 border-destructive-100/20 bg-destructive-100/10"
          }`}>
            {challenge.difficulty}
          </span>
          <div className="flex gap-2">
            {challenge.tags.map(tag => (
              <span key={tag} className="text-[10px] text-light-400 border border-white/5 bg-dark-200/50 px-2 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-6">
        <div className="prose prose-invert max-w-none prose-p:text-light-100 prose-headings:text-white prose-strong:text-primary-100 prose-code:text-primary-200 prose-code:bg-dark-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-dark-300 prose-pre:border prose-pre:border-white/5">
          <ReactMarkdown>
            {challenge.description}
          </ReactMarkdown>
        </div>
      </div>
      
      {/* Footer info or constraints would go here */}
    </div>
  );
};

export default ProblemDescription;
