"use client";

import { ActivityCalendar } from "react-activity-calendar";
import { ActivityDay } from "@/types";

interface ActivityHeatmapProps {
  activity: ActivityDay[];
  activeDays: number;
  maxStreak: number;
}

const ActivityHeatmap = ({
  activity,
  activeDays,
  maxStreak,
}: ActivityHeatmapProps) => {
  const submissionCount = activity.reduce((total, day) => total + day.count, 0);

  return (
    <section className="rounded-[28px] border border-white/8 bg-[#1d1f24] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.28)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-lg text-light-100">
          <span className="text-2xl font-semibold text-white">{submissionCount}</span>{" "}
          submissions in the past one year
        </div>
        <div className="flex gap-6 text-sm text-light-400">
          <p>
            Total active days: <span className="text-white">{activeDays}</span>
          </p>
          <p>
            Max streak: <span className="text-white">{maxStreak}</span>
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-[24px] border border-white/6 bg-[#202228] p-4">
        <div className="flex min-w-max justify-center">
          <div className="[&_.react-activity-calendar__count]:hidden [&_.react-activity-calendar__legend-colors]:gap-1.5 [&_.react-activity-calendar__legend-month]:text-light-400 [&_.react-activity-calendar__month-label]:fill-[#d6e0ff] [&_.react-activity-calendar__svg]:mx-auto [&_.react-activity-calendar__svg]:w-auto">
          <ActivityCalendar
            data={activity}
            colorScheme="dark"
            blockSize={12}
            blockMargin={5}
            blockRadius={3}
            fontSize={13}
            showWeekdayLabels={false}
            weekStart={0}
            theme={{
              dark: ["#2b2d31", "#0e5e54", "#148f67", "#20b36f", "#49de50"],
            }}
            labels={{
              totalCount: "{{count}} submissions in the past one year",
              legend: {
                less: "Less",
                more: "More",
              },
            }}
          />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivityHeatmap;
