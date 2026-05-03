"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, AlertTriangle } from "lucide-react";

import InterviewCard from "./InterviewCard";
import { deleteInterview } from "@/lib/actions/general.action";
import { Interview, Feedback } from "@/types";

interface InterviewTabsProps {
  userId: string;
  myInterviews: Interview[];
  attemptedInterviews: Interview[];
  latestInterviews: Interview[];
  feedbackMap: Record<string, Feedback | null>;
  attemptCountMap: Record<string, number>;
  locale: string;
}

type Tab = "my" | "explore";
type MyFilter = "all" | "created" | "attempted";

interface DeleteConfirm {
  interviewId: string;
  role: string;
  attemptCount: number;
}

export default function InterviewTabs({
  userId,
  myInterviews,
  attemptedInterviews,
  latestInterviews,
  feedbackMap,
  attemptCountMap,
  locale,
}: InterviewTabsProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("my");
  const [myFilter, setMyFilter] = useState<MyFilter>("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm | null>(null);
  const [deleting, setDeleting] = useState(false);

  // My Interviews — merge + deduplicate
  const myFilteredInterviews = useMemo(() => {
    if (myFilter === "created") return myInterviews;
    if (myFilter === "attempted") return attemptedInterviews;
    // "all" — merge and deduplicate
    const seen = new Set<string>();
    const merged: Interview[] = [];
    for (const interview of [...myInterviews, ...attemptedInterviews]) {
      if (!seen.has(interview.id)) {
        seen.add(interview.id);
        merged.push(interview);
      }
    }
    return merged.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [myInterviews, attemptedInterviews, myFilter]);

  // Explore — filter
  const exploreFiltered = useMemo(() => {
    return latestInterviews.filter((i) => {
      const normalizedType = /mix/gi.test(i.type) ? "Mixed" : i.type;
      if (typeFilter !== "all" && normalizedType !== typeFilter) return false;
      if (levelFilter !== "all" && i.level !== levelFilter) return false;
      return true;
    });
  }, [latestInterviews, typeFilter, levelFilter]);

  const isCreatedByUser = (interview: Interview) =>
    interview.userId === userId;

  const handleDelete = (interview: Interview) => {
    setDeleteConfirm({
      interviewId: interview.id,
      role: interview.role,
      attemptCount: attemptCountMap[interview.id] || 0,
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    const result = await deleteInterview(deleteConfirm.interviewId);
    setDeleting(false);
    setDeleteConfirm(null);
    if (result.success) {
      router.refresh();
    }
  };

  const myCreatedIds = new Set(myInterviews.map((i) => i.id));

  return (
    <div className="space-y-6">
      {/* Tab Buttons */}
      <div className="flex items-center gap-1 rounded-2xl bg-dark-200/50 border border-white/5 p-1.5 w-fit">
        <button
          onClick={() => setTab("my")}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === "my"
              ? "bg-primary-200 text-dark-100 shadow-lg"
              : "text-light-400 hover:text-white hover:bg-white/5"
          }`}
        >
          My Interviews
        </button>
        <button
          onClick={() => setTab("explore")}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === "explore"
              ? "bg-primary-200 text-dark-100 shadow-lg"
              : "text-light-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Explore
        </button>
      </div>

      {/* My Interviews Tab */}
      {tab === "my" && (
        <div className="space-y-5 animate-fadeIn">
          {/* Sub-filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(["all", "created", "attempted"] as MyFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setMyFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                    myFilter === f
                      ? "bg-white/10 text-white border border-white/15"
                      : "text-light-400 border border-transparent hover:text-white hover:bg-white/5"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="text-sm text-light-400">
              {myFilteredInterviews.length} sessions
            </span>
          </div>

          {/* Cards */}
          <div className="interviews-section">
            {myFilteredInterviews.length > 0 ? (
              myFilteredInterviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interviewId={interview.id}
                  userId={userId}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                  language={interview.language}
                  feedback={feedbackMap[interview.id]}
                  locale={locale}
                  showDelete={myCreatedIds.has(interview.id)}
                  attemptCount={attemptCountMap[interview.id] || 0}
                  onDelete={() => handleDelete(interview)}
                />
              ))
            ) : (
              <p className="text-light-400">No interviews found.</p>
            )}
          </div>
        </div>
      )}

      {/* Explore Tab */}
      {tab === "explore" && (
        <div className="space-y-5 animate-fadeIn">
          {/* Filters */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-dark-200 px-4 py-2 text-xs text-white focus:outline-none focus:border-primary-200/50 transition-colors"
              >
                <option value="all">All Types</option>
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Mixed">Mixed</option>
              </select>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-dark-200 px-4 py-2 text-xs text-white focus:outline-none focus:border-primary-200/50 transition-colors"
              >
                <option value="all">All Levels</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            <span className="text-sm text-light-400">
              {exploreFiltered.length} sessions
            </span>
          </div>

          {/* Cards */}
          <div className="interviews-section">
            {exploreFiltered.length > 0 ? (
              exploreFiltered.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interviewId={interview.id}
                  userId={userId}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                  language={interview.language}
                  feedback={feedbackMap[interview.id]}
                  locale={locale}
                />
              ))
            ) : (
              <p className="text-light-400">
                No interviews match the selected filters.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1c1f26] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="absolute top-4 right-4 text-light-400 hover:text-white transition-colors"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl p-2.5 bg-red-500/15 text-red-400">
                <AlertTriangle className="size-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Delete Interview
              </h3>
            </div>

            {deleteConfirm.attemptCount > 0 ? (
              <>
                <p className="text-sm text-light-100 mb-3">
                  This interview has{" "}
                  <span className="font-semibold text-white">
                    {deleteConfirm.attemptCount} attempt
                    {deleteConfirm.attemptCount > 1 ? "s" : ""}
                  </span>{" "}
                  with feedback and transcripts.
                </p>
                <p className="text-xs text-red-400/80 mb-4">
                  ⚠ All attempts, feedback, and transcripts will be permanently
                  deleted. This action cannot be undone.
                </p>
              </>
            ) : (
              <p className="text-sm text-light-100 mb-4">
                Delete the{" "}
                <span className="font-semibold text-white capitalize">
                  {deleteConfirm.role}
                </span>{" "}
                interview? This action cannot be undone.
              </p>
            )}

            <div className="rounded-xl bg-white/5 px-4 py-3 mb-5">
              <p className="text-sm font-medium text-white capitalize">
                {deleteConfirm.role} Mock Interview
              </p>
              <p className="text-xs text-light-400 mt-0.5">
                {deleteConfirm.attemptCount} attempt
                {deleteConfirm.attemptCount !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm rounded-xl border border-white/10 text-light-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
