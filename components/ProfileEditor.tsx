"use client";

import { ChangeEvent, useMemo, useState, useTransition } from "react";
import dayjs from "dayjs";
import { Camera, Loader2, PencilLine } from "lucide-react";

import { updateMyProfile } from "@/lib/actions/user.actions";
import { UserProfile } from "@/types";
import UserAvatar from "@/components/UserAvatar";

interface ProfileEditorProps {
  profile: UserProfile;
}

const ProfileEditor = ({ profile }: ProfileEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [isPending, startTransition] = useTransition();

  const avatarUrl = useMemo(() => previewUrl || currentProfile.avatarUrl, [previewUrl, currentProfile.avatarUrl]);
  const joinedDate = useMemo(
    () =>
      currentProfile.createdAt
        ? dayjs(currentProfile.createdAt).format("DD/MM/YYYY")
        : "",
    [currentProfile.createdAt],
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setMessage(null);

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name);
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    startTransition(async () => {
      const result = await updateMyProfile(formData);

      if (!result.success || !result.data) {
        setMessage(result.message || "Failed to update profile.");
        return;
      }

      setCurrentProfile(result.data);
      setMessage("Profile updated successfully.");
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsEditing(false);
    });
  };

  return (
    <section className="rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(92,114,255,0.12),_transparent_36%),linear-gradient(135deg,#1d1f24_0%,#12151b_100%)] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.28)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <UserAvatar
              name={currentProfile.name}
              avatarUrl={avatarUrl}
              size="xl"
            />
            {isEditing && (
              <label className="absolute bottom-1 right-1 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-dark-100 text-primary-100 shadow-lg">
                <Camera className="size-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-light-400">Profile</p>
            {isEditing ? (
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#252932] px-4 py-3 text-2xl font-bold text-white outline-none"
              />
            ) : (
              <h1 className="mt-2 text-4xl font-bold text-white">{currentProfile.name}</h1>
            )}
            <p className="mt-2 text-light-100">{currentProfile.email}</p>
            <p className="mt-1 text-sm text-light-400">
              Joined {joinedDate}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setName(currentProfile.name);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setMessage(null);
                }}
                className="rounded-xl border border-white/10 bg-[#252932] px-5 py-3 font-semibold text-light-100 transition hover:bg-[#2c313b]"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-200 px-5 py-3 font-bold text-dark-100 transition hover:bg-primary-100 disabled:opacity-60"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#252932] px-5 py-3 font-semibold text-white transition hover:bg-[#2c313b]"
            >
              <PencilLine className="size-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {message && (
        <p className="mt-4 text-sm text-primary-100">{message}</p>
      )}
    </section>
  );
};

export default ProfileEditor;
