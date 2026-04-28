"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  createAdminChallenge,
  deleteAdminChallenge,
} from "@/lib/actions/admin.actions";

interface AdminChallengesProps {
  data: any;
  skills: any[];
  currentPage: number;
  currentSearch: string;
}

const difficultyColors: Record<string, string> = {
  EASY: "bg-emerald-500/20 text-emerald-400",
  MEDIUM: "bg-amber-500/20 text-amber-400",
  HARD: "bg-red-500/20 text-red-400",
};

export default function AdminChallengesClient({
  data,
  skills,
  currentPage,
  currentSearch,
}: AdminChallengesProps) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: "",
    slug: "",
    skillId: skills?.[0]?.id || "",
    difficulty: "EASY",
    description: "",
    topics: "",
    templateCode: "{}",
    testCases: "[]",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", "1");
    router.push(`/admin/challenges?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set("search", currentSearch);
    params.set("page", String(page));
    router.push(`/admin/challenges?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this challenge? All related submissions will be removed.")) return;
    setDeleting(id);
    try {
      await deleteAdminChallenge(id);
      router.refresh();
    } catch (err) {
      alert("Failed to delete challenge");
    }
    setDeleting(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      let templateCode, testCases;
      try {
        templateCode = JSON.parse(form.templateCode);
      } catch {
        alert("Invalid Template Code JSON");
        setCreating(false);
        return;
      }
      try {
        testCases = JSON.parse(form.testCases);
      } catch {
        alert("Invalid Test Cases JSON");
        setCreating(false);
        return;
      }
      await createAdminChallenge({
        ...form,
        templateCode,
        testCases,
      });
      setShowCreateForm(false);
      setForm({
        title: "",
        slug: "",
        skillId: skills?.[0]?.id || "",
        difficulty: "EASY",
        description: "",
        topics: "",
        templateCode: "{}",
        testCases: "[]",
      });
      router.refresh();
    } catch (err) {
      alert("Failed to create challenge");
    }
    setCreating(false);
  };

  const handleTitleChange = (title: string) => {
    setForm({
      ...form,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    });
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-light-400">Failed to load challenges.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Challenge Management
          </h1>
          <p className="text-light-400 text-sm mt-1">
            {data.total} total challenges
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-200/15 text-primary-200 text-sm font-medium hover:bg-primary-200/25 transition-colors"
        >
          {showCreateForm ? <X className="size-4" /> : <Plus className="size-4" />}
          {showCreateForm ? "Cancel" : "New Challenge"}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-white/10 bg-dark-200/50 p-6 space-y-4"
        >
          <h3 className="text-base font-semibold text-white">Create Challenge</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-light-400 mb-1">Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-200/50"
              />
            </div>
            <div>
              <label className="block text-xs text-light-400 mb-1">Slug</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-200/50"
              />
            </div>
            <div>
              <label className="block text-xs text-light-400 mb-1">Skill</label>
              <select
                value={form.skillId}
                onChange={(e) => setForm({ ...form, skillId: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-200/50"
              >
                {skills?.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-light-400 mb-1">
                Difficulty
              </label>
              <select
                value={form.difficulty}
                onChange={(e) =>
                  setForm({ ...form, difficulty: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-200/50"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-light-400 mb-1">Topics (comma separated)</label>
            <input
              type="text"
              value={form.topics}
              onChange={(e) => setForm({ ...form, topics: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-200/50"
              placeholder="Array,String,Dynamic Programming"
            />
          </div>
          <div>
            <label className="block text-xs text-light-400 mb-1">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-200/50 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-light-400 mb-1">
                Template Code (JSON)
              </label>
              <textarea
                rows={3}
                value={form.templateCode}
                onChange={(e) =>
                  setForm({ ...form, templateCode: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-200/50 resize-none font-mono"
                placeholder='{"python": "def solve():\\n    pass"}'
              />
            </div>
            <div>
              <label className="block text-xs text-light-400 mb-1">
                Test Cases (JSON)
              </label>
              <textarea
                rows={3}
                value={form.testCases}
                onChange={(e) =>
                  setForm({ ...form, testCases: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-200/50 resize-none font-mono"
                placeholder='[{"input": "1 2", "output": "3"}]'
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="px-6 py-2 rounded-xl bg-primary-200 text-dark-100 text-sm font-bold hover:bg-primary-200/80 transition-colors disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Challenge"}
          </button>
        </form>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-light-400" />
        <input
          type="text"
          placeholder="Search by title or topic..."
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
                Title
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Skill
              </th>
              <th className="text-center px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Topics
              </th>
              <th className="text-center px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Submissions
              </th>
              <th className="text-right px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.items?.map((challenge: any) => (
              <tr
                key={challenge.id}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-white">
                    {challenge.title}
                  </p>
                  <p className="text-xs text-light-400">{challenge.slug}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs text-light-400 bg-white/5 px-2 py-1 rounded-md">
                    {challenge.skill?.name}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      difficultyColors[challenge.difficulty] ||
                      "bg-white/10 text-light-400"
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <p className="text-xs text-light-400 truncate max-w-[200px]">
                    {challenge.topics}
                  </p>
                </td>
                <td className="px-5 py-4 text-center text-sm text-light-100">
                  {challenge.totalSubmissions}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => handleDelete(challenge.id)}
                    disabled={deleting === challenge.id}
                    className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
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
