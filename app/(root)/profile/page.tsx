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
      language: item.language,
      status: "ACCEPTED",
      submittedAt: item.solvedAt,
    })) || [];

  return (
    <div className="flex flex-col gap-8">
      <ProfileEditor profile={profile} />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/8 bg-[#1d1f24] p-5">
          <p className="text-sm text-light-400">Solved Challenges</p>
          <p className="mt-3 text-4xl font-bold text-white">
            {profile.stats.totalSolvedChallenges}
          </p>
        </div>
        <div className="rounded-[24px] border border-white/8 bg-[#1d1f24] p-5">
          <p className="text-sm text-light-400">Current Streak</p>
          <p className="mt-3 text-4xl font-bold text-white">
            {profile.stats.currentStreak}
          </p>
        </div>
        <div className="rounded-[24px] border border-white/8 bg-[#1d1f24] p-5">
          <p className="text-sm text-light-400">Interviews</p>
          <p className="mt-3 text-4xl font-bold text-white">
            {profile.stats.totalInterviews}
          </p>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <AcceptanceOverview stats={profile.stats} />

        <section className="rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(92,114,255,0.12),_transparent_36%),linear-gradient(135deg,#1d1f24_0%,#12151b_100%)] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.28)]">
          <p className="text-sm uppercase tracking-[0.35em] text-light-400">
            Progress
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">
            Personal Coding Overview
          </h2>
          <p className="mt-3 max-w-2xl text-light-100">
            Follow your solved count, submission rhythm, and long-term
            consistency from one place.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
              <p className="text-sm text-light-400">Accepted Submissions</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {profile.stats.acceptedSubmissions}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
              <p className="text-sm text-light-400">Attempting</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {profile.stats.attemptingChallenges}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
              <p className="text-sm text-light-400">Active Days</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {profile.stats.activeDays}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
              <p className="text-sm text-light-400">Longest Streak</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {profile.stats.maxStreak}
              </p>
            </div>
          </div>
        </section>
      </div>

      <ActivityHeatmap
        activity={profile.activityCalendar}
        activeDays={profile.stats.activeDays}
        maxStreak={profile.stats.maxStreak}
      />

      <RecentActivityTable items={recentAccepted} title="Recent AC" />
    </div>
  );
};

export default ProfilePage;
