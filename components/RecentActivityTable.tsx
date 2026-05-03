import Link from "next/link";
import dayjs from "dayjs";

import { RecentActivityItem } from "@/types";

interface RecentActivityTableProps {
  items: RecentActivityItem[];
  title?: string;
  compact?: boolean;
  actionHref?: string;
  actionLabel?: string;
}

const statusClasses: Record<string, string> = {
  ACCEPTED: "text-emerald-400",
  REJECTED: "text-amber-400",
  WRONG_ANSWER: "text-amber-400",
  PENDING: "text-light-400",
};

const RecentActivityTable = ({
  items,
  title = "Recent Activity",
  compact = false,
  actionHref,
  actionLabel,
}: RecentActivityTableProps) => {
  return (
    <section className="rounded-[28px] border border-white/8 bg-[#1d1f24] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <div className="flex items-center gap-4">
          {!compact && <span className="text-sm text-light-400">{items.length} items</span>}
          {actionHref && actionLabel ? (
            <Link
              href={actionHref}
              className="text-sm font-semibold text-primary-200 hover:text-primary-100"
            >
              {actionLabel}
            </Link>
          ) : null}
        </div>
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
                      href={`/preparation/${item.skillSlug || "algorithms"}/${item.challengeId}`}
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
