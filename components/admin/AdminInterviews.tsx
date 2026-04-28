"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface AdminInterviewsProps {
  data: any;
  currentPage: number;
  currentSearch: string;
}

export default function AdminInterviewsClient({
  data,
  currentPage,
  currentSearch,
}: AdminInterviewsProps) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", "1");
    router.push(`/admin/interviews?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set("search", currentSearch);
    params.set("page", String(page));
    router.push(`/admin/interviews?${params.toString()}`);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-light-400">Failed to load interviews.</p>
      </div>
    );
  }

  const levelColors: Record<string, string> = {
    junior: "bg-emerald-500/20 text-emerald-400",
    mid: "bg-amber-500/20 text-amber-400",
    senior: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white">Interview Management</h1>
        <p className="text-light-400 text-sm mt-1">
          {data.total} total interviews
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-light-400" />
        <input
          type="text"
          placeholder="Search by role or user name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-dark-200 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-light-600 focus:outline-none focus:border-primary-200/50 transition-colors"
        />
      </form>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 bg-dark-200/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                User
              </th>
              <th className="text-center px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Level
              </th>
              <th className="text-center px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Type
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Tech Stack
              </th>
              <th className="text-center px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Attempts
              </th>
              <th className="text-center px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.items?.map((interview: any) => (
              <tr
                key={interview.id}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-white capitalize">
                    {interview.role}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-light-100">
                    {interview.user?.name}
                  </p>
                  <p className="text-xs text-light-400">
                    {interview.user?.email}
                  </p>
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                      levelColors[interview.level?.toLowerCase()] ||
                      "bg-white/10 text-light-400"
                    }`}
                  >
                    {interview.level}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-xs text-light-400 bg-white/5 px-2 py-1 rounded-md capitalize">
                    {interview.type}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {interview.techstack?.slice(0, 3).map((tech: string) => (
                      <span
                        key={tech}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-primary-200/10 text-primary-200"
                      >
                        {tech}
                      </span>
                    ))}
                    {interview.techstack?.length > 3 && (
                      <span className="text-[10px] text-light-400">
                        +{interview.techstack.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-center text-sm text-light-100">
                  {interview.totalAttempts}
                </td>
                <td className="px-5 py-4 text-center text-xs text-light-400">
                  {new Date(interview.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg border border-white/10 text-light-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm text-light-400 px-3">
            Page {currentPage} of {data.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= data.totalPages}
            className="p-2 rounded-lg border border-white/10 text-light-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
