"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  MessageSquare,
  Code2,
  FileCheck,
  TrendingUp,
  Layers,
  ArrowUpRight,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import AdminSelectFilter from "@/components/admin/AdminSelectFilter";

interface DashboardProps {
  dashboard: any;
  stats: any;
  currentRange: string;
}

const TIME_RANGE_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "6m", label: "Last 6 months" },
  { value: "12m", label: "Last 12 months" },
];

const statCards = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: Users,
    color: "from-indigo-500/20 to-indigo-600/5",
    iconColor: "text-indigo-400",
    summary: (dashboard: any) => `+${dashboard.usersToday ?? 0} today`,
  },
  {
    key: "totalInterviews",
    label: "Interviews",
    icon: MessageSquare,
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-400",
    summary: (dashboard: any) => `+${dashboard.interviewsToday ?? 0} today`,
  },
  {
    key: "totalChallenges",
    label: "Challenges",
    icon: Code2,
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-400",
    summary: (dashboard: any) =>
      `${dashboard.activeChallenges ?? 0} active / ${
        dashboard.disabledChallenges ?? 0
      } disabled`,
  },
  {
    key: "totalSubmissions",
    label: "Submissions",
    icon: FileCheck,
    color: "from-rose-500/20 to-rose-600/5",
    iconColor: "text-rose-400",
    summary: (dashboard: any) => `+${dashboard.submissionsToday ?? 0} today`,
  },
  {
    key: "totalAttempts",
    label: "Attempts",
    icon: TrendingUp,
    color: "from-cyan-500/20 to-cyan-600/5",
    iconColor: "text-cyan-400",
    summary: (dashboard: any) => `+${dashboard.attemptsToday ?? 0} today`,
  },
  {
    key: "totalSkills",
    label: "Skills",
    icon: Layers,
    color: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-400",
    summary: (dashboard: any) =>
      `${dashboard.activeSkills ?? 0} active / ${
        dashboard.disabledSkills ?? 0
      } disabled`,
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-dark-200 px-4 py-2.5 shadow-xl">
        <p className="mb-1 text-xs text-light-400">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p
            key={i}
            className="text-sm font-semibold"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const EmptyState = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-6 text-center text-sm text-light-400">
    {message}
  </div>
);

const GrowthBadge = ({ value }: { value: number }) => {
  const isPositive = value >= 0;

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        isPositive
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-red-500/15 text-red-400"
      }`}
    >
      {isPositive ? "+" : ""}
      {value}% growth
    </span>
  );
};

const getStatusColor = (status: string) => {
  if (status === "ACCEPTED") {
    return "bg-emerald-500/15 text-emerald-400";
  }

  if (status === "WRONG_ANSWER" || status.includes("ERROR")) {
    return "bg-red-500/15 text-red-400";
  }

  return "bg-amber-500/15 text-amber-400";
};

export default function AdminDashboardClient({
  dashboard,
  stats,
  currentRange,
}: DashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedRange = TIME_RANGE_OPTIONS.some(
    (option) => option.value === currentRange,
  )
    ? currentRange
    : "6m";
  const selectedRangeLabel =
    TIME_RANGE_OPTIONS.find((option) => option.value === selectedRange)?.label ??
    "Last 6 months";

  const handleRangeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  if (!dashboard) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-lg text-light-400">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-light-400">
            System statistics and recent activity
          </p>
        </div>

        <AdminSelectFilter
          label="Time range"
          value={selectedRange}
          options={TIME_RANGE_OPTIONS}
          onChange={handleRangeChange}
          className="w-full sm:w-48"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = dashboard[card.key] ?? 0;
          const summary = card.summary(dashboard);

          return (
            <div
              key={card.key}
              className={`relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${card.color} p-5 transition-all hover:-translate-y-0.5 hover:border-white/10 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-light-400">{card.label}</p>
                  <p className="text-3xl font-bold text-white">
                    {value.toLocaleString()}
                  </p>
                  <p className="mt-2 text-xs font-medium text-light-300">
                    {summary}
                  </p>
                </div>
                <div className={`rounded-xl bg-white/5 p-3 ${card.iconColor}`}>
                  <Icon className="size-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-dark-200/50 p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-white">
                User Growth ({selectedRangeLabel})
              </h3>
              <GrowthBadge value={stats.growth?.users ?? 0} />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={stats.userGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6870a6", fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "#6870a6", fontSize: 12 }}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Users"
                  stroke="#818cf8"
                  fill="url(#colorUsers)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-white/5 bg-dark-200/50 p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-white">
                Submissions Trend ({selectedRangeLabel})
              </h3>
              <GrowthBadge value={stats.growth?.submissions ?? 0} />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.submissionTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6870a6", fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "#6870a6", fontSize: 12 }}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(34, 197, 94, 0.08)" }}
                />
                <Bar
                  dataKey="count"
                  name="Submissions"
                  fill="#22c55e"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-white/5 bg-dark-200/50 p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-white">
                Interview Trend ({selectedRangeLabel})
              </h3>
              <GrowthBadge value={stats.growth?.interviews ?? 0} />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={stats.interviewTrend}>
                <defs>
                  <linearGradient
                    id="colorInterviews"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6870a6", fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "#6870a6", fontSize: 12 }}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Interviews"
                  stroke="#f59e0b"
                  fill="url(#colorInterviews)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-white/5 bg-dark-200/50 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Submission Success Rate
                </h3>
                <p className="mt-1 text-xs text-light-400">
                  Accepted submissions within {selectedRangeLabel.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-5xl font-bold text-white">
                    {stats.submissionSuccessRate?.rate ?? 0}%
                  </p>
                  <p className="mt-2 text-sm text-light-400">
                    {stats.submissionSuccessRate?.accepted ?? 0} accepted of{" "}
                    {stats.submissionSuccessRate?.total ?? 0} submissions
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                  Success
                </span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300"
                  style={{
                    width: `${Math.min(
                      stats.submissionSuccessRate?.rate ?? 0,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {stats.submissionSuccessRate?.breakdown?.length ? (
                stats.submissionSuccessRate.breakdown.map((item: any) => (
                  <span
                    key={item.status}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                      item.status,
                    )}`}
                  >
                    {item.status}: {item.count}
                  </span>
                ))
              ) : (
                <p className="text-sm text-light-400">No submissions yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-dark-200/50 p-6">
          <h3 className="mb-4 text-base font-semibold text-white">
            Recent Users
          </h3>
          <div className="space-y-3">
            {dashboard.recentUsers?.length ? (
              dashboard.recentUsers.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-light-400">
                      {user.email}
                    </p>
                  </div>
                  <span
                    className={`ml-3 rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-white/10 text-light-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState message="No recent users yet." />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-dark-200/50 p-6">
          <h3 className="mb-4 text-base font-semibold text-white">
            Recent Submissions
          </h3>
          <div className="space-y-3">
            {dashboard.recentSubmissions?.length ? (
              dashboard.recentSubmissions.map((sub: any) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {sub.challengeTitle}
                    </p>
                    <p className="text-xs text-light-400">
                      by {sub.userName} | {sub.language}
                    </p>
                  </div>
                  <span
                    className={`ml-3 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${
                      sub.status === "ACCEPTED"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : sub.status === "WRONG_ANSWER"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState message="No recent submissions yet." />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-white/5 bg-dark-200/50 p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white">
                Recent Interviews
              </h3>
              <p className="mt-1 text-xs text-light-400">
                Latest generated interviews and attempt activity
              </p>
            </div>
            <Link
              href="/admin/interviews"
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-light-300 transition-colors hover:border-primary-200/40 hover:text-white"
            >
              View all
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {dashboard.recentInterviews?.length ? (
              dashboard.recentInterviews.map((interview: any) => (
                <Link
                  key={interview.id}
                  href={`/admin/interviews/${interview.id}`}
                  className="group flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-white">
                        {interview.role}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          interview.status === "Active"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-slate-500/15 text-slate-300"
                        }`}
                      >
                        {interview.status}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-light-400">
                      {interview.userName} | {interview.level} |{" "}
                      {interview.type}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-light-500">
                      {interview.techstack?.join(", ") || "No tech stack"} |{" "}
                      {formatDate(interview.createdAt)}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-bold text-primary-200">
                      {interview.attempts}
                    </p>
                    <p className="text-[11px] text-light-500">attempts</p>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState message="No recent interviews yet." />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-dark-200/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
              <Trophy className="size-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Top Content
              </h3>
              <p className="mt-1 text-xs text-light-400">
                Skills by challenges and challenges by submissions
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-light-500">
                  Top Skills
                </p>
                <Link
                  href="/admin/skills"
                  className="text-xs font-semibold text-primary-200 hover:text-primary-100"
                >
                  Manage
                </Link>
              </div>
              <div className="space-y-2">
                {dashboard.topSkills?.length ? (
                  dashboard.topSkills.map((skill: any, index: number) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-light-300">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {skill.name}
                          </p>
                          <p className="text-[11px] text-light-500">
                            {skill.isActive ? "Active" : "Disabled"}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-amber-300">
                        {skill.challengeCount}
                      </p>
                    </div>
                  ))
                ) : (
                  <EmptyState message="No skills available yet." />
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-light-500">
                  Top Challenges
                </p>
                <Link
                  href="/admin/challenges"
                  className="text-xs font-semibold text-primary-200 hover:text-primary-100"
                >
                  Manage
                </Link>
              </div>
              <div className="space-y-2">
                {dashboard.topChallenges?.length ? (
                  dashboard.topChallenges.map((challenge: any, index: number) => (
                    <Link
                      key={challenge.id}
                      href={`/admin/challenges?search=${encodeURIComponent(
                        challenge.title,
                      )}`}
                      className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 transition-colors hover:bg-white/10"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-light-300">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {challenge.title}
                          </p>
                          <p className="truncate text-[11px] text-light-500">
                            {challenge.skillName} | {challenge.difficulty}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-emerald-300">
                        {challenge.submissionCount}
                      </p>
                    </Link>
                  ))
                ) : (
                  <EmptyState message="No challenge submissions yet." />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
