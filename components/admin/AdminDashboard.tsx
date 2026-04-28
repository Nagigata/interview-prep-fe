"use client";

import {
  Users,
  MessageSquare,
  Code2,
  FileCheck,
  TrendingUp,
  Layers,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

interface DashboardProps {
  dashboard: any;
  stats: any;
}

const COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#6366f1", "#ec4899"];

const statCards = [
  { key: "totalUsers", label: "Total Users", icon: Users, color: "from-indigo-500/20 to-indigo-600/5", iconColor: "text-indigo-400" },
  { key: "totalInterviews", label: "Interviews", icon: MessageSquare, color: "from-emerald-500/20 to-emerald-600/5", iconColor: "text-emerald-400" },
  { key: "totalChallenges", label: "Challenges", icon: Code2, color: "from-amber-500/20 to-amber-600/5", iconColor: "text-amber-400" },
  { key: "totalSubmissions", label: "Submissions", icon: FileCheck, color: "from-rose-500/20 to-rose-600/5", iconColor: "text-rose-400" },
  { key: "totalAttempts", label: "Attempts", icon: TrendingUp, color: "from-cyan-500/20 to-cyan-600/5", iconColor: "text-cyan-400" },
  { key: "totalSkills", label: "Skills", icon: Layers, color: "from-purple-500/20 to-purple-600/5", iconColor: "text-purple-400" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-dark-200 px-4 py-2.5 shadow-xl">
        <p className="text-xs text-light-400 mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboardClient({ dashboard, stats }: DashboardProps) {
  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-light-400 text-lg">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-light-400 text-sm mt-1">
          System statistics and recent activity
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = dashboard[card.key] ?? 0;
          return (
            <div
              key={card.key}
              className={`relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${card.color} p-5 transition-all hover:border-white/10 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-light-400 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
                </div>
                <div className={`rounded-xl bg-white/5 p-3 ${card.iconColor}`}>
                  <Icon className="size-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <div className="rounded-2xl border border-white/5 bg-dark-200/50 p-6">
            <h3 className="text-base font-semibold text-white mb-4">
              User Growth (6 months)
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={stats.userGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#6870a6", fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: "#6870a6", fontSize: 12 }} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" name="Users" stroke="#818cf8" fill="url(#colorUsers)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Submissions Trend */}
          <div className="rounded-2xl border border-white/5 bg-dark-200/50 p-6">
            <h3 className="text-base font-semibold text-white mb-4">
              Submissions Trend (6 months)
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.submissionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#6870a6", fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: "#6870a6", fontSize: 12 }} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Submissions" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Interview Trend */}
          <div className="rounded-2xl border border-white/5 bg-dark-200/50 p-6">
            <h3 className="text-base font-semibold text-white mb-4">
              Interview Trend (6 months)
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={stats.interviewTrend}>
                <defs>
                  <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#6870a6", fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: "#6870a6", fontSize: 12 }} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" name="Interviews" stroke="#f59e0b" fill="url(#colorInterviews)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Submission Status Pie */}
          <div className="rounded-2xl border border-white/5 bg-dark-200/50 p-6">
            <h3 className="text-base font-semibold text-white mb-4">
              Submissions by Status
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={stats.submissionsByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={3}
                  label={(props: any) => `${props.name} (${props.value})`}
                  labelLine={false}
                >
                  {stats.submissionsByStatus?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="rounded-2xl border border-white/5 bg-dark-200/50 p-6">
          <h3 className="text-base font-semibold text-white mb-4">Recent Users</h3>
          <div className="space-y-3">
            {dashboard.recentUsers?.map((user: any) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-light-400">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      user.role === "ADMIN"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-white/10 text-light-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="rounded-2xl border border-white/5 bg-dark-200/50 p-6">
          <h3 className="text-base font-semibold text-white mb-4">
            Recent Submissions
          </h3>
          <div className="space-y-3">
            {dashboard.recentSubmissions?.map((sub: any) => (
              <div
                key={sub.id}
                className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {sub.challengeTitle}
                  </p>
                  <p className="text-xs text-light-400">
                    by {sub.userName} · {sub.language}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-3 ${
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
