"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, Shield, User } from "lucide-react";
import { updateAdminUser } from "@/lib/actions/admin.actions";

interface AdminUsersProps {
  data: any;
  currentPage: number;
  currentSearch: string;
}

export default function AdminUsersClient({
  data,
  currentPage,
  currentSearch,
}: AdminUsersProps) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);
  const [updating, setUpdating] = useState<string | null>(null);

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

  const handleToggleRole = async (userId: string, currentRole: string) => {
    setUpdating(userId);
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    await updateAdminUser(userId, { role: newRole });
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

      {/* Table */}
      <div className="rounded-2xl border border-white/5 bg-dark-200/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Provider
              </th>
              <th className="text-center px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Interviews
              </th>
              <th className="text-center px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Submissions
              </th>
              <th className="text-center px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Role
              </th>
              <th className="text-center px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Joined
              </th>
              <th className="text-right px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.items?.map((user: any) => (
              <tr
                key={user.id}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary-200/10 flex items-center justify-center text-primary-200 text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-light-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs text-light-400 bg-white/5 px-2 py-1 rounded-md">
                    {user.provider || "LOCAL"}
                  </span>
                </td>
                <td className="px-5 py-4 text-center text-sm text-light-100">
                  {user.totalInterviews}
                </td>
                <td className="px-5 py-4 text-center text-sm text-light-100">
                  {user.totalSubmissions}
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                      user.role === "ADMIN"
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
                <td className="px-5 py-4 text-center text-xs text-light-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => handleToggleRole(user.id, user.role)}
                    disabled={updating === user.id}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-light-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    {updating === user.id
                      ? "..."
                      : user.role === "ADMIN"
                        ? "Demote"
                        : "Promote"}
                  </button>
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
