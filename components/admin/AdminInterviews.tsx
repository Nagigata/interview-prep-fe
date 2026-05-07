"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, Eye, RotateCcw, Search } from "lucide-react";
import {
  archiveAdminInterview,
  restoreAdminInterview,
} from "@/lib/actions/admin.actions";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import AdminPagination from "@/components/admin/AdminPagination";

interface AdminInterviewsProps {
  data: any;
  currentPage: number;
  currentSearch: string;
}

interface InterviewArchiveDialog {
  id: string;
  role: string;
  userName?: string;
  archivedAt?: string | null;
  totalAttempts: number;
}

export default function AdminInterviewsClient({
  data,
  currentPage,
  currentSearch,
}: AdminInterviewsProps) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);
  const [archiveDialog, setArchiveDialog] =
    useState<InterviewArchiveDialog | null>(null);
  const [archiveUpdatingId, setArchiveUpdatingId] = useState<string | null>(
    null,
  );
  const [noticeDialog, setNoticeDialog] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

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

  const openArchiveDialog = (interview: any) => {
    setArchiveDialog({
      id: interview.id,
      role: interview.role,
      userName: interview.user?.name,
      archivedAt: interview.archivedAt,
      totalAttempts: interview.totalAttempts || 0,
    });
  };

  const handleConfirmArchiveChange = async () => {
    if (!archiveDialog) return;

    setArchiveUpdatingId(archiveDialog.id);
    try {
      if (archiveDialog.archivedAt) {
        await restoreAdminInterview(archiveDialog.id);
      } else {
        await archiveAdminInterview(archiveDialog.id);
      }
      setArchiveDialog(null);
      router.refresh();
    } catch (error) {
      setNoticeDialog({
        title: archiveDialog.archivedAt
          ? "Restore Interview Failed"
          : "Archive Interview Failed",
        description: getErrorMessage(
          error,
          archiveDialog.archivedAt
            ? "Failed to restore interview"
            : "Failed to archive interview",
        ),
      });
    }
    setArchiveUpdatingId(null);
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px]">
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
                Status
              </th>
              <th className="text-center px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Created
              </th>
              <th className="text-right px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Actions
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
                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      interview.archivedAt
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-emerald-500/15 text-emerald-400"
                    }`}
                  >
                    {interview.archivedAt ? "Archived" : "Active"}
                  </span>
                </td>
                <td className="px-5 py-4 text-center text-xs text-light-400">
                  {new Date(interview.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/interviews/${interview.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-light-100 transition-colors hover:border-primary-200/40 hover:bg-primary-200/10 hover:text-primary-200"
                    >
                      <Eye className="size-3.5" />
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => openArchiveDialog(interview)}
                      disabled={archiveUpdatingId === interview.id}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                        interview.archivedAt
                          ? "border-emerald-400/15 text-emerald-400 hover:bg-emerald-500/10"
                          : "border-amber-400/15 text-amber-400 hover:bg-amber-500/10"
                      }`}
                    >
                      {interview.archivedAt ? (
                        <RotateCcw className="size-3.5" />
                      ) : (
                        <Archive className="size-3.5" />
                      )}
                      {interview.archivedAt ? "Restore" : "Archive"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      <AdminPagination
        currentPage={currentPage}
        totalPages={data.totalPages}
        onPageChange={handlePageChange}
      />

      {archiveDialog && (
        <AdminConfirmDialog
          title={
            archiveDialog.archivedAt ? "Restore Interview" : "Archive Interview"
          }
          description={
            archiveDialog.archivedAt
              ? "This interview will be visible to users again in Explore."
              : "This interview will be hidden from Explore and users will not start new attempts from it."
          }
          itemName={archiveDialog.role}
          itemMeta={`${archiveDialog.userName || "Unknown user"} • ${
            archiveDialog.totalAttempts
          } attempt(s)`}
          warning={
            archiveDialog.archivedAt
              ? undefined
              : "Existing attempts, transcripts, and feedback will be kept for history."
          }
          confirmLabel={archiveDialog.archivedAt ? "Restore" : "Archive"}
          variant={archiveDialog.archivedAt ? "success" : "warning"}
          loading={archiveUpdatingId === archiveDialog.id}
          onCancel={() => setArchiveDialog(null)}
          onConfirm={handleConfirmArchiveChange}
        />
      )}

      {noticeDialog && (
        <AdminConfirmDialog
          title={noticeDialog.title}
          description={noticeDialog.description}
          confirmLabel="Got it"
          variant="warning"
          hideCancel
          onCancel={() => setNoticeDialog(null)}
          onConfirm={() => setNoticeDialog(null)}
        />
      )}
    </div>
  );
}
