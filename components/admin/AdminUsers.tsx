"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  User,
  AlertTriangle,
  X,
  Minus,
} from "lucide-react";
import { updateAdminUser } from "@/lib/actions/admin.actions";

interface AdminUsersProps {
  data: any;
  currentPage: number;
  currentSearch: string;
  currentUserId: string;
}

interface ConfirmState {
  userId: string;
  userName: string;
  currentRole: string;
  newRole: string;
}

export default function AdminUsersClient({
  data,
  currentPage,
  currentSearch,
  currentUserId,
}: AdminUsersProps) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);
  const [updating, setUpdating] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", "1");
    router.push(`/admin/users?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set("search", currentSearch);
    params.set("page", String(page));
    router.push(`/admin/users?${params.toString()}`);
  };

  const openConfirm = (user: any) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    setConfirm({
      userId: user.id,
      userName: user.name,
      currentRole: user.role,
      newRole,
    });
  };

  const handleConfirmRole = async () => {
    if (!confirm) return;
    setUpdating(confirm.userId);
    setConfirm(null);
    await updateAdminUser(confirm.userId, { role: confirm.newRole });
    setUpdating(null);
    router.refresh();
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-light-400">Failed to load users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-light-400 text-sm mt-1">
            {data.total} total users
          </p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-light-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-dark-200 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-light-600 focus:outline-none focus:border-primary-200/50 transition-colors"
        />
      </form>

      {/* Table — horizontal scroll wrapper */}
      <div className="rounded-2xl border border-white/5 bg-dark-200/50 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Provider
              </th>
              <th className="text-center px-4 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Interviews
              </th>
              <th className="text-center px-4 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Submissions
              </th>
              <th className="text-center px-4 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Role
              </th>
              <th className="text-center px-4 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Joined
              </th>
              <th className="text-right px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.items?.map((user: any) => {
              const isSelf = user.id === currentUserId;
              return (
                <tr
                  key={user.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 shrink-0 rounded-full bg-primary-200/10 flex items-center justify-center text-primary-200 text-sm font-semibold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {user.name}
                          {isSelf && (
                            <span className="ml-1.5 text-[10px] text-light-600">
                              (you)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-light-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs text-light-400 bg-white/5 px-2 py-1 rounded-md whitespace-nowrap">
                      {user.provider || "LOCAL"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-light-100">
                    {user.totalInterviews}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-light-100">
                    {user.totalSubmissions}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${user.role === "ADMIN"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-white/10 text-light-400"
                        }`}
                    >
                      {user.role === "ADMIN" ? (
                        <Shield className="size-3" />
                      ) : (
                        <User className="size-3" />
                      )}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-xs text-light-400 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {isSelf ? (
                      <span className="text-xs text-light-600 italic">—</span>
                    ) : (
                      <button
                        onClick={() => openConfirm(user)}
                        disabled={updating === user.id}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 whitespace-nowrap ${user.role === "ADMIN"
                          ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                          : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                      >
                        {updating === user.id
                          ? "..."
                          : user.role === "ADMIN"
                            ? "Demote"
                            : "Promote"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
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

      {/* Confirm Dialog */}
      {confirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1c1f26] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setConfirm(null)}
              className="absolute top-4 right-4 text-light-400 hover:text-white transition-colors"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`rounded-xl p-2.5 ${confirm.newRole === "ADMIN"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
                  }`}
              >
                <AlertTriangle className="size-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {confirm.newRole === "ADMIN"
                  ? "Promote to Admin"
                  : "Demote to User"}
              </h3>
            </div>

            <p className="text-sm text-light-100 mb-1">
              Are you sure you want to{" "}
              <span className="font-semibold text-white">
                {confirm.newRole === "ADMIN" ? "promote" : "demote"}
              </span>{" "}
              the following user?
            </p>
            <div className="rounded-xl bg-white/5 px-4 py-3 my-4">
              <p className="text-sm font-medium text-white">
                {confirm.userName}
              </p>
              <p className="text-xs text-light-400 mt-0.5">
                {confirm.currentRole} → {confirm.newRole}
              </p>
            </div>

            {confirm.newRole === "ADMIN" && (
              <p className="text-xs text-amber-400/80 mb-4">
                ⚠ Admin users have full access to manage all data in the system.
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="px-4 py-2 text-sm rounded-xl border border-white/10 text-light-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRole}
                className={`px-4 py-2 text-sm rounded-xl font-medium transition-colors ${confirm.newRole === "ADMIN"
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-red-500 text-white hover:bg-red-600"
                  }`}
              >
                {confirm.newRole === "ADMIN" ? "Promote" : "Demote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
