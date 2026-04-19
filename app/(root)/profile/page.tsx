import ProfileEditor from "@/components/ProfileEditor";
import AcceptanceOverview from "@/components/AcceptanceOverview";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import RecentActivityTable from "@/components/RecentActivityTable";
import {
  getMyProfile,
  getMySolvedChallenges,
} from "@/lib/actions/user.actions";

const ProfilePage = async () => {
  const [profile, solved] = await Promise.all([
    getMyProfile(),
    getMySolvedChallenges(1, 12),
  ]);

  if (!profile) {
    return null;
  }

  const recentAccepted =
    solved?.items.map((item) => ({
      id: item.challengeId,
      challengeId: item.challengeId,
      challengeTitle: item.title,
      difficulty: item.difficulty,
      skillSlug: item.skillSlug,
      language: item.language,
      status: "ACCEPTED",
      submittedAt: item.solvedAt,
    })) || [];

  return (
    <div className="flex flex-col gap-8">
      <ProfileEditor profile={profile} />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-emerald-400/10 bg-[linear-gradient(135deg,rgba(73,222,80,0.12),rgba(29,31,36,0.96)_45%)] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.28)]">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">Solved Challenges</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="text-4xl font-bold text-white">
              {profile.stats.totalSolvedChallenges}
            </p>
            <p className="text-sm text-light-300">
              {profile.stats.acceptedSubmissions} accepted submissions
            </p>
          </div>
          <div className="mt-5 h-2 rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-[#49de50]"
              style={{
                width: `${Math.min(profile.stats.acceptanceRate || 0, 100)}%`,
              }}
            />
          </div>
        </div>
        <div className="rounded-[28px] border border-primary-200/10 bg-[linear-gradient(135deg,rgba(92,114,255,0.16),rgba(29,31,36,0.96)_45%)] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.28)]">
          <p className="text-sm uppercase tracking-[0.28em] text-primary-100/80">Current Streak</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="text-4xl font-bold text-white">
              {profile.stats.currentStreak}
            </p>
            <p className="text-sm text-light-300">
              {profile.stats.maxStreak} longest streak
            </p>
          </div>
          <p className="mt-5 text-sm text-light-200">
            {profile.stats.activeDays} active days in the last year
          </p>
        </div>
        <div className="rounded-[28px] border border-amber-400/10 bg-[linear-gradient(135deg,rgba(245,158,11,0.16),rgba(29,31,36,0.96)_45%)] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.28)]">
          <p className="text-sm uppercase tracking-[0.28em] text-amber-300/80">Interviews</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="text-4xl font-bold text-white">
              {profile.stats.totalInterviews}
            </p>
            <p className="text-sm text-light-300">
              {profile.stats.attemptingChallenges} challenges in progress
            </p>
          </div>
          <p className="mt-5 text-sm text-light-200">
            Build momentum across coding practice and AI mock interview sessions.
          </p>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(92,114,255,0.12),_transparent_36%),linear-gradient(135deg,#1d1f24_0%,#12151b_100%)] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.28)]">
        <p className="text-sm uppercase tracking-[0.35em] text-light-400">
          Progress
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">
          Personal Coding Overview
        </h2>
        <p className="mt-3 max-w-2xl text-light-100">
          Follow your solved count, acceptance trend, and long-term consistency from one place.
        </p>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <AcceptanceOverview stats={profile.stats} className="rounded-[28px] border border-white/8 bg-[#171a20] p-5" />

          <div className="grid gap-4 self-stretch md:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
              <p className="text-sm text-light-400">Accepted Submissions</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {profile.stats.acceptedSubmissions}
              </p>
              <p className="mt-2 text-sm text-light-300">
                {profile.stats.acceptanceRate}% overall acceptance rate
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
              <p className="text-sm text-light-400">Attempting</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {profile.stats.attemptingChallenges}
              </p>
              <p className="mt-2 text-sm text-light-300">
                Problems with work in progress right now
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
              <p className="text-sm text-light-400">Active Days</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {profile.stats.activeDays}
              </p>
              <p className="mt-2 text-sm text-light-300">
                Tracked across the last 12 months
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
              <p className="text-sm text-light-400">Longest Streak</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {profile.stats.maxStreak}
              </p>
              <p className="mt-2 text-sm text-light-300">
                Best uninterrupted run so far
              </p>
            </div>
          </div>
        </div>
      </section>

      <ActivityHeatmap
        activity={profile.activityCalendar}
        activeDays={profile.stats.activeDays}
        maxStreak={profile.stats.maxStreak}
      />

      <RecentActivityTable
        items={recentAccepted}
        title="Recent AC"
        actionHref="/submissions"
        actionLabel="View all submissions >"
      />
    </div>
  );
};

export default ProfilePage;
