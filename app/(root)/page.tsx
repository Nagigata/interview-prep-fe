import Link from "next/link";
import { BrainCircuit, PencilLine } from "lucide-react";

import AcceptanceOverview from "@/components/AcceptanceOverview";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import RecentActivityTable from "@/components/RecentActivityTable";
import UserAvatar from "@/components/UserAvatar";

import { getCurrentUser } from "@/lib/actions/auth.action";
import { getMyProfile } from "@/lib/actions/user.actions";

async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const profile = await getMyProfile();

      if (!profile) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 xl:grid-cols-2">
        <section className="rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(92,114,255,0.18),_transparent_38%),linear-gradient(135deg,#1d1f24_0%,#12151b_60%,#0c0f14_100%)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
          <p className="text-sm uppercase tracking-[0.35em] text-light-400">
            Dashboard
          </p>

          <div className="mt-6 flex items-center gap-5">
            <UserAvatar
              name={profile.name}
              avatarUrl={profile.avatarUrl}
              size="xl"
            />

            <div className="min-w-0 flex-1">
              <h1 className="text-4xl font-bold text-white">{profile.name}</h1>
              <p className="mt-3 text-light-100">{profile.email}</p>
              <p className="mt-1 text-sm text-light-400">
                Joined {new Date(profile.createdAt || "").toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
              <p className="text-sm text-light-400">Solved Challenges</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {profile.stats.totalSolvedChallenges}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
              <p className="text-sm text-light-400">Current Streak</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {profile.stats.currentStreak}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
              <p className="text-sm text-light-400">Interviews</p>
              <p className="mt-2 flex items-center gap-2 text-3xl font-bold text-white">
                {profile.stats.totalInterviews}
                <BrainCircuit className="size-5 text-primary-100" />
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/profile"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-200 px-5 py-4 text-base font-bold text-dark-100 transition hover:bg-primary-100"
            >
              <PencilLine className="size-4" />
              Edit Profile
            </Link>
          </div>
        </section>

        <AcceptanceOverview stats={profile.stats} />
      </div>

      <ActivityHeatmap
        activity={profile.activityCalendar}
        activeDays={profile.stats.activeDays}
        maxStreak={profile.stats.maxStreak}
      />

      <RecentActivityTable items={profile.recentActivity} compact />
    </div>
  );
}

export default Home;
