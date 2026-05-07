"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Pencil,
  CheckCircle2,
  Lock,
  Unlock,
  X,
} from "lucide-react";
import {
  createAdminChallenge,
  updateAdminChallenge,
} from "@/lib/actions/admin.actions";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import AdminPagination from "@/components/admin/AdminPagination";
import CodeEditor from "@/components/CodeEditor";

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

type ChallengeFormMode = "create" | "edit";

interface StatusChallengeConfirm {
  id: string;
  title: string;
  slug: string;
  totalSubmissions: number;
  isActive: boolean;
}

interface ChallengeNoticeDialog {
  title: string;
  description: string;
  warning?: string;
}

const emptyCreateForm = (skillId = "") => ({
  title: "",
  slug: "",
  skillId,
  difficulty: "EASY",
  description: "",
  topics: "",
  examples: "[]",
  constraints: "[]",
  hints: "[]",
  followUps: "[]",
  templateCode: "{}",
  testCases: "[]",
  solution: "",
});

const stringifyJson = (value: unknown, fallback: unknown) =>
  JSON.stringify(value ?? fallback, null, 2);

const getChallengeFormValues = (challenge: any, fallbackSkillId = "") => ({
  title: challenge.title || "",
  slug: challenge.slug || "",
  skillId: challenge.skillId || challenge.skill?.id || fallbackSkillId,
  difficulty: challenge.difficulty || "EASY",
  description: challenge.description || "",
  topics: challenge.topics || "",
  examples: stringifyJson(challenge.examples, []),
  constraints: stringifyJson(challenge.constraints, []),
  hints: stringifyJson(challenge.hints, []),
  followUps: stringifyJson(challenge.followUps, []),
  templateCode: stringifyJson(challenge.templateCode, {}),
  testCases: stringifyJson(challenge.testCases, []),
  solution: challenge.solution || "",
});

const FieldLabel = ({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) => (
  <label className="mb-1 flex items-center gap-1.5 text-xs text-light-400">
    <span>{children}</span>
    {required ? (
      <span className="text-red-400">*</span>
    ) : (
      <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-light-600">
        optional
      </span>
    )}
  </label>
);

const parseJsonField = (label: string, value: string) => {
  try {
    return JSON.parse(value || "null");
  } catch {
    throw new Error(`Invalid ${label} JSON`);
  }
};

const AdminCodeField = ({
  label,
  value,
  language,
  height = 180,
  required = false,
  onChange,
}: {
  label: string;
  value: string;
  language: string;
  height?: number;
  required?: boolean;
  onChange: (value: string) => void;
}) => (
  <div>
    <FieldLabel required={required}>{label}</FieldLabel>
    <div
      className="overflow-hidden rounded-lg border border-white/10"
      style={{ height }}
    >
      <CodeEditor
        value={value}
        language={language}
        onChange={(nextValue) => onChange(nextValue ?? "")}
      />
    </div>
  </div>
);

export default function AdminChallengesClient({
  data,
  skills,
  currentPage,
  currentSearch,
}: AdminChallengesProps) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);
  const [formMode, setFormMode] = useState<ChallengeFormMode | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusConfirm, setStatusConfirm] =
    useState<StatusChallengeConfirm | null>(null);
  const [noticeDialog, setNoticeDialog] =
    useState<ChallengeNoticeDialog | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState(() => emptyCreateForm(skills?.[0]?.id || ""));

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

  const validateChallengeIdentity = (currentChallengeId?: string) => {
    const title = form.title.trim();
    const slug = form.slug.trim();
    const normalizedTitle = title.toLowerCase();
    const normalizedSlug = slug.toLowerCase();

    if (!title || !slug || !form.skillId) {
      return {
        title: "Invalid Challenge",
        description: "Title, slug, and skill are required.",
        warning: "Please fill in all required identity fields before saving.",
      };
    }

    const duplicatedTitle = data?.items?.find(
      (challenge: any) =>
        challenge.skill?.id === form.skillId &&
        challenge.title?.trim().toLowerCase() === normalizedTitle &&
        (!currentChallengeId || challenge.id !== currentChallengeId),
    );

    if (duplicatedTitle) {
      const skillName =
        skills?.find((skill: any) => skill.id === form.skillId)?.name ||
        "this skill";

      return {
        title: "Duplicated Challenge Title",
        description: `"${title}" already exists in ${skillName}.`,
        warning:
          "Challenge titles should be unique inside the same skill to avoid confusing admins and users.",
      };
    }

    const duplicatedSlug = data?.items?.find(
      (challenge: any) =>
        challenge.slug?.trim().toLowerCase() === normalizedSlug &&
        (!currentChallengeId || challenge.id !== currentChallengeId),
    );

    if (duplicatedSlug) {
      return {
        title: "Duplicated Challenge Slug",
        description: `The slug "${slug}" is already used by another challenge.`,
        warning:
          "Please choose a unique slug because it is used as the technical identifier.",
      };
    }

    return null;
  };

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

  const openStatusConfirm = (challenge: any) => {
    setStatusConfirm({
      id: challenge.id,
      title: challenge.title,
      slug: challenge.slug,
      totalSubmissions: challenge.totalSubmissions || 0,
      isActive: challenge.isActive !== false,
    });
  };

  const handleConfirmStatusChange = async () => {
    if (!statusConfirm) return;

    setStatusUpdating(statusConfirm.id);
    try {
      await updateAdminChallenge(statusConfirm.id, {
        isActive: !statusConfirm.isActive,
      });
      setStatusConfirm(null);
      router.refresh();
    } catch (err) {
      setNoticeDialog({
        title: statusConfirm.isActive
          ? "Disable Challenge Failed"
          : "Enable Challenge Failed",
        description: getErrorMessage(
          err,
          statusConfirm.isActive
            ? "Failed to disable challenge"
            : "Failed to enable challenge",
        ),
      });
    }
    setStatusUpdating(null);
  };

  const handleOpenCreate = () => {
    if (formMode === "create") {
      handleCancelForm();
      return;
    }
    setForm(emptyCreateForm(skills?.[0]?.id || ""));
    setEditingId(null);
    setFormMode("create");
  };

  const handleStartEdit = (challenge: any) => {
    setForm(getChallengeFormValues(challenge, skills?.[0]?.id || ""));
    setEditingId(challenge.id);
    setFormMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelForm = () => {
    setFormMode(null);
    setEditingId(null);
    setForm(emptyCreateForm(skills?.[0]?.id || ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateChallengeIdentity(
      formMode === "edit" ? editingId || undefined : undefined,
    );
    if (validationError) {
      setNoticeDialog(validationError);
      return;
    }

    setSaving(true);
    try {
      let templateCode, testCases, examples, constraints, hints, followUps;
      try {
        templateCode = parseJsonField("Template Code", form.templateCode);
        testCases = parseJsonField("Test Cases", form.testCases);
        examples = parseJsonField("Examples", form.examples);
        constraints = parseJsonField("Constraints", form.constraints);
        hints = parseJsonField("Hints", form.hints);
        followUps = parseJsonField("Follow-ups", form.followUps);
      } catch (error) {
        setNoticeDialog({
          title: "Invalid JSON Field",
          description: getErrorMessage(error, "Invalid JSON field"),
          warning:
            "Please fix the JSON value in the code editor before saving.",
        });
        setSaving(false);
        return;
      }
      const payload = {
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim(),
        templateCode,
        testCases,
        examples,
        constraints,
        hints,
        followUps,
        solution: form.solution.trim(),
      };

      if (formMode === "edit" && editingId) {
        await updateAdminChallenge(editingId, payload);
      } else {
        await createAdminChallenge(payload);
      }

      handleCancelForm();
      router.refresh();
    } catch (err) {
      setNoticeDialog({
        title:
          formMode === "edit"
            ? "Update Challenge Failed"
            : "Create Challenge Failed",
        description: getErrorMessage(
          err,
          formMode === "edit"
            ? "Failed to update challenge"
            : "Failed to create challenge",
        ),
        warning:
          "Please check whether the title is unique inside this skill and the slug is unique across all challenges.",
      });
    }
    setSaving(false);
  };

  const handleTitleChange = (title: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      title,
      slug:
        formMode === "create"
          ? title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          : currentForm.slug,
    }));
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
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-200/15 text-primary-200 text-sm font-medium hover:bg-primary-200/25 transition-colors"
        >
          {formMode === "create" ? <X className="size-4" /> : <Plus className="size-4" />}
          {formMode === "create" ? "Cancel" : "New Challenge"}
        </button>
      </div>

      {/* Create/Edit Form */}
      {formMode && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-dark-200/50 p-6 space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white">
                {formMode === "edit" ? "Edit Challenge" : "Create Challenge"}
              </h3>
              <p className="mt-1 text-xs text-light-400">
                Fields marked with <span className="text-red-400">*</span> are required.
                Optional JSON fields can stay as empty arrays.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCancelForm}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-light-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Title</FieldLabel>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-200/50"
              />
            </div>
            <div>
              <FieldLabel required>Slug</FieldLabel>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-200/50"
              />
            </div>
            <div>
              <FieldLabel required>Skill</FieldLabel>
              <select
                required
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
              <FieldLabel required>Difficulty</FieldLabel>
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
            <FieldLabel>Topics (comma separated)</FieldLabel>
            <input
              type="text"
              value={form.topics}
              onChange={(e) => setForm({ ...form, topics: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-200/50"
              placeholder="Array,String,Dynamic Programming"
            />
          </div>
          <div>
            <FieldLabel required>Description</FieldLabel>
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
              <FieldLabel>Examples (JSON)</FieldLabel>
              <textarea
                rows={5}
                value={form.examples}
                onChange={(e) =>
                  setForm({ ...form, examples: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-200/50 resize-none font-mono"
                placeholder='[{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] = 9."}]'
              />
            </div>
            <div>
              <FieldLabel>Constraints (JSON)</FieldLabel>
              <textarea
                rows={5}
                value={form.constraints}
                onChange={(e) =>
                  setForm({ ...form, constraints: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-200/50 resize-none font-mono"
                placeholder='["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"]'
              />
            </div>
            <div>
              <FieldLabel>Hints (JSON)</FieldLabel>
              <textarea
                rows={4}
                value={form.hints}
                onChange={(e) =>
                  setForm({ ...form, hints: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-200/50 resize-none font-mono"
                placeholder='["Try using a hash map.", "Store values you have already seen."]'
              />
            </div>
            <div>
              <FieldLabel>Follow-ups (JSON)</FieldLabel>
              <textarea
                rows={4}
                value={form.followUps}
                onChange={(e) =>
                  setForm({ ...form, followUps: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-200/50 resize-none font-mono"
                placeholder='["Can you solve it in O(n)?", "How would you handle duplicate values?"]'
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AdminCodeField
              label="Template Code (JSON)"
              language="json"
              required
              value={form.templateCode}
              onChange={(value) => setForm({ ...form, templateCode: value })}
            />
            <AdminCodeField
              label="Test Cases (JSON)"
              language="json"
              required
              value={form.testCases}
              onChange={(value) => setForm({ ...form, testCases: value })}
            />
          </div>

          <AdminCodeField
            label="Solution"
            language="javascript"
            height={220}
            value={form.solution}
            onChange={(value) => setForm({ ...form, solution: value })}
          />

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded-xl bg-primary-200 text-dark-100 text-sm font-bold hover:bg-primary-200/80 transition-colors disabled:opacity-50"
          >
            {saving
              ? formMode === "edit"
                ? "Saving..."
                : "Creating..."
              : formMode === "edit"
                ? "Save Changes"
                : "Create Challenge"}
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
              <th className="text-center px-5 py-3.5 text-xs font-medium text-light-400 uppercase tracking-wider">
                Status
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
                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                      challenge.isActive === false
                        ? "bg-red-500/15 text-red-400"
                        : "bg-emerald-500/15 text-emerald-400"
                    }`}
                  >
                    {challenge.isActive === false ? (
                      <Lock className="size-3" />
                    ) : (
                      <CheckCircle2 className="size-3" />
                    )}
                    {challenge.isActive === false ? "Disabled" : "Active"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleStartEdit(challenge)}
                      className="p-1.5 rounded-lg text-light-400 hover:text-primary-200 hover:bg-primary-200/10 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => openStatusConfirm(challenge)}
                      disabled={statusUpdating === challenge.id}
                      className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                        challenge.isActive === false
                          ? "text-emerald-400/70 hover:bg-emerald-500/10 hover:text-emerald-400"
                          : "text-red-400/60 hover:bg-red-500/10 hover:text-red-400"
                      }`}
                      title={
                        challenge.isActive === false
                          ? "Enable challenge"
                          : "Disable challenge"
                      }
                    >
                      {challenge.isActive === false ? (
                        <Unlock className="size-4" />
                      ) : (
                        <Lock className="size-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminPagination
        currentPage={currentPage}
        totalPages={data.totalPages}
        onPageChange={handlePageChange}
      />

      {statusConfirm && (
        <AdminConfirmDialog
          title={statusConfirm.isActive ? "Disable Challenge" : "Enable Challenge"}
          description={
            statusConfirm.isActive
              ? "This challenge will be hidden from users and cannot be run or submitted."
              : "This challenge will be visible to users again."
          }
          itemName={statusConfirm.title}
          itemMeta={`${statusConfirm.slug} • ${statusConfirm.totalSubmissions} submission(s)`}
          warning={
            statusConfirm.isActive
              ? "Existing submissions and bookmarks will be kept for history."
              : undefined
          }
          confirmLabel={statusConfirm.isActive ? "Disable" : "Enable"}
          variant={statusConfirm.isActive ? "danger" : "success"}
          loading={statusUpdating === statusConfirm.id}
          onCancel={() => setStatusConfirm(null)}
          onConfirm={handleConfirmStatusChange}
        />
      )}

      {noticeDialog && (
        <AdminConfirmDialog
          title={noticeDialog.title}
          description={noticeDialog.description}
          warning={noticeDialog.warning}
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
