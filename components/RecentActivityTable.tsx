import Link from "next/link";
import dayjs from "dayjs";

import { RecentActivityItem } from "@/types";

interface RecentActivityTableProps {
  items: RecentActivityItem[];
  title?: string;
  compact?: boolean;
}

const statusClasses: Record<string, string> = {
  ACCEPTED: "text-[#49de50]",
  REJECTED: "text-[#f59e0b]",
  WRONG_ANSWER: "text-[#f59e0b]",
  PENDING: "text-light-400",
};

const RecentActivityTable = ({
  items,
  title = "Recent Activity",
  compact = false,
}: RecentActivityTableProps) => {
  return (
    <section className="rounded-[28px] border border-white/8 bg-[#1d1f24] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {!compact && <span className="text-sm text-light-400">{items.length} items</span>}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full border-collapse">
          <thead className="bg-[#24272d] text-left text-sm text-light-400">
            <tr>
              <th className="px-4 py-3 font-medium">Challenge</th>
              <th className="px-4 py-3 font-medium">Language</th>
              <th className="px-4 py-3 font-medium">Result</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="border-t border-white/8 bg-[#1d1f24]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/challenges`}
                      className="font-medium text-white hover:text-primary-100"
                    >
                      {item.challengeTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-light-100">{item.language}</td>
                  <td className={`px-4 py-3 text-sm font-semibold ${statusClasses[item.status] || "text-light-100"}`}>
                    {item.status.replaceAll("_", " ")}
                  </td>
                  <td className="px-4 py-3 text-sm text-light-400">
                    {dayjs(item.submittedAt).format(compact ? "MMM D" : "MMM D, YYYY HH:mm")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-light-400">
                  No recent submissions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentActivityTable;
