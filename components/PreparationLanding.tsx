"use client";

import Link from "next/link";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ChartNoAxesColumn,
  Flame,
  FolderOpenDot,
  Sparkles,
  Target,
} from "lucide-react";

import SkillCard from "@/components/SkillCard";
import { cn } from "@/lib/utils";
import { RecentActivityItem, Skill, UserProfile } from "@/types";

interface PreparationLandingProps {
  dictionary: any;
  locale: string;
  profile: UserProfile | null;
  recentChallenges: RecentActivityItem[];
  continueChallenges: RecentActivityItem[];
  recommendedSkills: Skill[];
  skills: Skill[];
}

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getStatusTone = (status: string) => {
  if (status === "ACCEPTED") {
    return "border-success-100/25 bg-success-100/10 text-success-100";
  }

  return "border-orange-400/25 bg-orange-400/10 text-orange-400";
};

const PreparationLanding = ({
  dictionary,
  locale,
  profile,
  recentChallenges,
  continueChallenges,
  recommendedSkills,
  skills,
}: PreparationLandingProps) => {
  const name = profile?.name?.split(" ")[0] || "there";
  const stats = profile?.stats;
  const resumeChallenge = continueChallenges[0] ?? recentChallenges[0];
  const continueTarget = resumeChallenge
    ? `/preparation/${resumeChallenge.skillSlug}/${resumeChallenge.challengeId}`
    : "/challenges";

  const text =
    locale === "vi"
      ? {
          eyebrow: "Workspace cá nhân",
          heroTitle: `Chào mừng trở lại, ${name}.`,
          heroSubtitle:
            "Tiếp tục luyện bài đang dở, khám phá lộ trình mới và chuyển nhanh sang mock interview khi bạn sẵn sàng.",
          continueLabel: "Tiếp tục học",
          browseLabel: "Xem Challenges",
          interviewLabel: "AI Interview",
          progressTitle: "Nhịp độ học của bạn",
          progressSubtitle:
            "Một ảnh chụp nhanh để bạn biết mình đang tiến đến đâu.",
          continueEyebrow: "Tiếp tục học",
          continueTitle: "Tiếp tục từ nơi bạn dừng lại",
          continueSubtitle:
            "Những challenge gần đây nhất của bạn nằm ở đây để có thể quay lại nhanh mà không cần tìm lại.",
          noContinue:
            "Chưa có hoạt động gần đây. Hãy bắt đầu bằng một track cơ bản bên dưới.",
          recentTitle: "Hoạt động gần đây",
          recentSubtitle:
            "Nhìn nhanh những challenge bạn vừa đụng tới và trạng thái hiện tại.",
          noRecent:
            "Khi bạn bắt đầu submit challenge, lịch sử gần đây sẽ xuất hiện ở đây.",
          recommendedTitle: "Track gợi ý để bắt đầu",
          recommendedSubtitle:
            "Gợi ý track phù hợp từ dữ liệu bạn đã có, hoặc đơn giản là điểm bắt đầu tốt để lấy đà.",
          allSkillsTitle: dictionary.preparation.skillTitle,
          allSkillsSubtitle:
            "Mỗi skill là một đường vào rõ ràng để bạn luyện theo chủ đề thay vì học rời rạc.",
          stats: [
            {
              label: "Solved Challenges",
              value: stats?.totalSolvedChallenges ?? 0,
              icon: Target,
              accent: "from-success-100/20 to-success-100/5 text-success-100",
            },
            {
              label: "Current Streak",
              value: stats?.currentStreak ?? 0,
              icon: Flame,
              accent: "from-orange-400/20 to-orange-400/5 text-orange-400",
            },
            {
              label: "Acceptance",
              value: `${Math.round(stats?.acceptanceRate ?? 0)}%`,
              icon: ChartNoAxesColumn,
              accent: "from-primary-200/20 to-primary-200/5 text-primary-100",
            },
            {
              label: "Interviews",
              value: stats?.totalInterviews ?? 0,
              icon: BrainCircuit,
              accent: "from-cyan-400/20 to-cyan-400/5 text-cyan-300",
            },
          ],
        }
      : {
          eyebrow: "Your learning workspace",
          heroTitle: `Welcome back, ${name}.`,
          heroSubtitle:
            "Pick up a challenge, discover a new path, and jump into a mock interview when you are ready.",
          continueLabel: "Continue learning",
          browseLabel: "Browse challenges",
          interviewLabel: "Start mock interview",
          progressTitle: "Your momentum",
          progressSubtitle:
            "A quick snapshot of how your preparation is moving this week.",
          continueEyebrow: "Continue learning",
          continueTitle: "Pick up where you left off",
          continueSubtitle:
            "Your latest challenges are right here so you can jump back in without digging around.",
          noContinue:
            "No recent challenge activity yet. Start with one of the recommended tracks below.",
          recentTitle: "Recent challenge activity",
          recentSubtitle:
            "A quick look at the challenges you touched most recently and how they went.",
          noRecent:
            "Once you start submitting solutions, your latest challenge activity will appear here.",
          recommendedTitle: "Recommended starting tracks",
          recommendedSubtitle:
            "A simple recommendation layer built from your recent activity and the most useful paths to begin with.",
          allSkillsTitle: dictionary.preparation.skillTitle,
          allSkillsSubtitle:
            "Each skill gives you a clear entry point so your practice feels guided instead of scattered.",
          stats: [
            {
              label: "Solved Challenges",
              value: stats?.totalSolvedChallenges ?? 0,
              icon: Target,
              accent: "from-success-100/20 to-success-100/5 text-success-100",
            },
            {
              label: "Current Streak",
              value: stats?.currentStreak ?? 0,
              icon: Flame,
              accent: "from-orange-400/20 to-orange-400/5 text-orange-400",
            },
            {
              label: "Acceptance",
              value: `${Math.round(stats?.acceptanceRate ?? 0)}%`,
              icon: ChartNoAxesColumn,
              accent: "from-primary-200/20 to-primary-200/5 text-primary-100",
            },
            {
              label: "Interviews",
              value: stats?.totalInterviews ?? 0,
              icon: BrainCircuit,
              accent: "from-cyan-400/20 to-cyan-400/5 text-cyan-300",
            },
          ],
        };

  return (
    <div className="flex flex-col gap-10">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[34px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(202,197,254,0.22),_transparent_32%),linear-gradient(160deg,_rgba(20,24,33,0.98),_rgba(8,10,14,0.98))] px-7 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.35)] sm:px-10 sm:py-10"
      >
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary-200/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.45fr_0.95fr] xl:items-end">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/15 bg-primary-200/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-100">
              <Sparkles size={14} />
              {text.eyebrow}
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {text.heroTitle}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-light-100 sm:text-lg">
                {text.heroSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={continueTarget}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary-200 px-5 py-3 text-sm font-extrabold text-dark-100 transition-transform hover:-translate-y-0.5"
              >
                {text.continueLabel}
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/challenges"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/8"
              >
                <FolderOpenDot size={16} />
                {text.browseLabel}
              </Link>

              <Link
                href="/interview"
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-200 transition-colors hover:bg-cyan-400/15"
              >
                <BrainCircuit size={16} />
                {text.interviewLabel}
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {text.stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className={cn(
                    "rounded-[24px] border border-white/8 bg-gradient-to-br px-5 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.2)]",
                    stat.accent,
                  )}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-light-100/90">
                      {stat.label}
                    </span>
                    <Icon size={18} />
                  </div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
        className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="rounded-[30px] border border-white/8 bg-[#11141a] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-100/80">
                {text.continueEyebrow}
              </p>
              <h2 className="text-2xl font-bold text-white sm:text-[30px]">
                {text.continueTitle}
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-light-100/80">
                {text.continueSubtitle}
              </p>
            </div>
          </div>

          {continueChallenges.length > 0 ? (
            <div className="space-y-3">
              {continueChallenges.map((item) => (
                <Link
                  key={item.id}
                  href={`/preparation/${item.skillSlug}/${item.challengeId}`}
                  className="group flex items-center justify-between gap-4 rounded-[22px] border border-white/6 bg-white/[0.03] px-4 py-4 transition-all hover:border-primary-200/20 hover:bg-primary-200/[0.06]"
                >
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
                          getStatusTone(item.status),
                        )}
                      >
                        {formatStatus(item.status)}
                      </span>
                      <span className="text-xs text-light-400">
                        {item.language}
                      </span>
                    </div>

                    <h3 className="truncate text-lg font-semibold text-white group-hover:text-primary-100">
                      {item.challengeTitle}
                    </h3>
                    <p className="text-sm text-light-400">
                      {dayjs(item.submittedAt).format("DD MMM YYYY, HH:mm")}
                    </p>
                  </div>

                  <ArrowRight
                    size={18}
                    className="shrink-0 text-light-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-100"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-light-400">
              {text.noContinue}
            </div>
          )}
        </div>

        <div className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(10,16,22,0.96),rgba(6,9,13,0.96))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:p-7">
          <div className="mb-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
              {text.recentTitle}
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-[30px]">
              {text.recommendedTitle}
            </h2>
            <p className="text-sm leading-6 text-light-100/80">
              {text.recommendedSubtitle}
            </p>
          </div>

          {recommendedSkills.length > 0 ? (
            <div className="space-y-3">
              {recommendedSkills.map((skill, index) => (
                <Link
                  key={skill.id}
                  href={`/preparation/${skill.slug}`}
                  className="group flex items-center justify-between rounded-[22px] border border-white/6 bg-white/[0.03] px-4 py-4 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/[0.06]"
                >
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
                      Track {index + 1}
                    </p>
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-200">
                      {skill.name}
                    </h3>
                    <p className="mt-1 text-sm text-light-400">
                      {skill._count?.challenges ?? 0}{" "}
                      {dictionary.preparation.challenges.toLowerCase()}
                    </p>
                  </div>
                  <BookOpen
                    size={18}
                    className="text-light-400 transition-colors group-hover:text-cyan-200"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-light-400">
              {dictionary.preparation.noSkills}
            </div>
          )}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.16, ease: "easeOut" }}
        className="rounded-[30px] border border-white/8 bg-[#101318] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:p-7"
      >
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-100/80">
              {text.recentTitle}
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-[30px]">
              {text.recentTitle}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-light-100/80">
              {text.recentSubtitle}
            </p>
          </div>
          <Link
            href="/submissions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-100 transition-colors hover:text-primary-200"
          >
            {locale === "vi" ? "Xem tất cả submissions" : "View all submissions"}
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentChallenges.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {recentChallenges.map((item) => (
              <Link
                key={item.id}
                href={`/preparation/${item.skillSlug}/${item.challengeId}`}
                className="group rounded-[24px] border border-white/6 bg-white/[0.03] p-5 transition-all hover:border-primary-200/15 hover:bg-primary-200/[0.05]"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
                      getStatusTone(item.status),
                    )}
                  >
                    {formatStatus(item.status)}
                  </span>
                  <span className="text-xs text-light-400">{item.language}</span>
                </div>
                <h3 className="line-clamp-2 text-lg font-semibold text-white group-hover:text-primary-100">
                  {item.challengeTitle}
                </h3>
                <p className="mt-3 text-sm text-light-400">
                  {dayjs(item.submittedAt).format("DD MMM YYYY, HH:mm")}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-light-400">
            {text.noRecent}
          </div>
        )}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.24, ease: "easeOut" }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-100/80">
            {text.allSkillsTitle}
          </p>
          <h2 className="text-3xl font-bold text-white">{text.allSkillsTitle}</h2>
          <p className="max-w-2xl text-sm leading-6 text-light-100/80">
            {text.allSkillsSubtitle}
          </p>
        </div>

        {skills.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {skills.map((skill, index) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                dictionary={dictionary}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-light-400">
            {dictionary.preparation.noSkills}
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default PreparationLanding;
