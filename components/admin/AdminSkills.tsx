"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Code2 } from "lucide-react";
import {
  createAdminSkill,
  updateAdminSkill,
} from "@/lib/actions/admin.actions";

interface AdminSkillsProps {
  skills: any[] | null;
}

export default function AdminSkillsClient({ skills }: AdminSkillsProps) {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", icon: "" });
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createAdminSkill(form);
      setShowCreateForm(false);
      setForm({ name: "", slug: "", description: "", icon: "" });
      router.refresh();
    } catch {
      alert("Failed to create skill");
    }
    setCreating(false);
  };

  const handleNameChange = (name: string) => {
    setForm({
      ...form,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    });
  };

  const handleStartEdit = (skill: any) => {
    setEditingId(skill.id);
    setEditForm({
      name: skill.name,
      description: skill.description || "",
      icon: skill.icon || "",
    });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateAdminSkill(id, editForm);
      setEditingId(null);
      router.refresh();
    } catch {
      alert("Failed to update skill");
    }
  };

  if (!skills) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-light-400">Failed to load skills.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Skill Management</h1>
          <p className="text-light-400 text-sm mt-1">
            {skills.length} total skills
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-200/15 text-primary-200 text-sm font-medium hover:bg-primary-200/25 transition-colors"
        >
          {showCreateForm ? (
            <X className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
          {showCreateForm ? "Cancel" : "New Skill"}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-white/10 bg-dark-200/50 p-6 space-y-4"
        >
          <h3 className="text-base font-semibold text-white">Create Skill</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-light-400 mb-1">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
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
          </div>
          <div>
            <label className="block text-xs text-light-400 mb-1">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-200/50"
            />
          </div>
          <div>
            <label className="block text-xs text-light-400 mb-1">
              Icon URL
            </label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-200/50"
              placeholder="https://cdn.jsdelivr.net/..."
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="px-6 py-2 rounded-xl bg-primary-200 text-dark-100 text-sm font-bold hover:bg-primary-200/80 transition-colors disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Skill"}
          </button>
        </form>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill: any) => (
          <div
            key={skill.id}
            className="rounded-2xl border border-white/5 bg-dark-200/50 p-5 hover:border-white/10 transition-all"
          >
            {editingId === skill.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-1.5 text-sm text-white focus:outline-none"
                />
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-1.5 text-sm text-white focus:outline-none"
                  placeholder="Description"
                />
                <input
                  type="text"
                  value={editForm.icon}
                  onChange={(e) =>
                    setEditForm({ ...editForm, icon: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-dark-100 px-3 py-1.5 text-sm text-white focus:outline-none"
                  placeholder="Icon URL"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(skill.id)}
                    className="px-3 py-1 text-xs rounded-lg bg-primary-200 text-dark-100 font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 text-xs rounded-lg border border-white/10 text-light-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-3">
                  {skill.icon ? (
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="size-8 object-contain"
                    />
                  ) : (
                    <div className="size-8 rounded-lg bg-primary-200/10 flex items-center justify-center">
                      <Code2 className="size-4 text-primary-200" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-light-400">{skill.slug}</p>
                  </div>
                </div>
                <p className="text-xs text-light-400 mb-3 line-clamp-2">
                  {skill.description || "No description"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-light-400">
                    {skill._count?.challenges || 0} challenges
                  </span>
                  <button
                    onClick={() => handleStartEdit(skill)}
                    className="text-xs px-3 py-1 rounded-lg border border-white/10 text-light-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
