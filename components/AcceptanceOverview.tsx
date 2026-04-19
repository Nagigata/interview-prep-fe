"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Check } from "lucide-react";

import { UserDashboardStats } from "@/types";

interface AcceptanceOverviewProps {
  stats: UserDashboardStats;
}

const difficultyConfig = [
  {
    key: "easy",
    label: "Easy",
    accentClass: "text-[#49de50]",
  },
  {
    key: "medium",
    label: "Med.",
    accentClass: "text-[#f59e0b]",
  },
  {
    key: "hard",
    label: "Hard",
    accentClass: "text-[#ef4444]",
  },
] as const;

const AcceptanceOverview = ({ stats }: AcceptanceOverviewProps) => {
  const chartData = [
    { name: "segment-easy", value: 1, fill: "#7b6617" },
    { name: "segment-medium", value: 1, fill: "#0f5960" },
    { name: "segment-hard", value: 1, fill: "#6a2d31" },
  ];
  const totalChallenges =
    stats.difficultyProgress.easy.total +
    stats.difficultyProgress.medium.total +
    stats.difficultyProgress.hard.total;

  return (
    <section className="flex h-full rounded-[32px] border border-white/8 bg-[#1d1f24] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.28)]">
      <div className="grid w-full items-center gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative flex min-h-[280px] items-center justify-center rounded-[24px]  px-4 py-5">
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  startAngle={210}
                  endAngle={-30}
                  innerRadius="72%"
                  outerRadius="82%"
                  cornerRadius={10}
                  paddingAngle={10}
                  stroke="none"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="flex items-baseline gap-1">
              <p className="text-5xl font-bold text-white">
                {stats.totalSolvedChallenges}
              </p>
              <p className="text-xl font-semibold text-light-400">
                /{totalChallenges}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-light-100">
              <Check className="size-4 text-[#49de50]" />
              <span className="text-xl">Solved</span>
            </div>
            <p className="mt-6 text-sm text-light-400">
              {stats.attemptingChallenges} Attempting
            </p>
          </div>
        </div>

        <div className="grid content-center gap-3">
          {difficultyConfig.map((item) => {
            const value =
              stats.difficultyProgress[
                item.key as keyof typeof stats.difficultyProgress
              ];

            return (
              <div
                key={item.key}
                className="rounded-2xl border border-white/8 bg-[#2a2d33] px-5 py-4"
              >
                <p className={`text-xl font-semibold ${item.accentClass}`}>
                  {item.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {value.solved}/{value.total}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AcceptanceOverview;
