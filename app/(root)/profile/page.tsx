import Link from "next/link";
import dayjs from "dayjs";

import ProfileEditor from "@/components/ProfileEditor";
import RecentActivityTable from "@/components/RecentActivityTable";
import { getMyProfile, getMyRecentActivity, getMySolvedChallenges, getMyStarredChallenges } from "@/lib/actions/user.actions";

const difficultyClasses: Record<string, string> = {
  EASY: "text-[#49de50]",
  MEDIUM: "text-[#f59e0b]",
  HARD: "text-[#ef4444]",
};

const ProfilePage = async () => {
  const [profile, starred, solved, activity] = await Promise.all([
    getMyProfile(),
    getMyStarredChallenges(1, 8),
    getMySolvedChallenges(1, 8),
    getMyRecentActivity(1, 12),
  ]);

  if (!profile) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <ProfileEditor profile={profile} />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/8 bg-[#1d1f24] p-5">
          <p className="text-sm text-light-400">Starred Challenges</p>
          <p className="mt-3 text-4xl font-bold text-white">{profile.stats.totalStarredChallenges}</p>
        </div>
        <div className="rounded-[24px] border border-white/8 bg-[#1d1f24] p-5">
          <p className="text-sm text-light-400">Solved Challenges</p>
          <p className="mt-3 text-4xl font-bold text-white">{profile.stats.totalSolvedChallenges}</p>
        </div>
        <div className="rounded-[24px] border border-white/8 bg-[#1d1f24] p-5">
          <p className="text-sm text-light-400">Acceptance</p>
          <p className="mt-3 text-4xl font-bold text-white">{profile.stats.acceptanceRate}%</p>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="rounded-[28px] border border-white/8 bg-[#1d1f24] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.28)]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Starred Challenges</h2>
            <Link href="/challenges?status=STARRED" className="text-sm text-primary-100 hover:text-primary-200">
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {starred?.items.length ? (
              starred.items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/8 bg-[#252932] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-sm text-light-400">{item.skillName}</p>
                    </div>
                    <span className={`text-sm font-semibold ${difficultyClasses[item.difficulty] || "text-light-100"}`}>
                      {item.difficulty}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-light-100/80">{item.description}</p>
                  <p className="mt-3 text-xs text-light-400">
                    Starred {dayjs(item.starredAt).format("MMM D, YYYY")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-light-400">You have not starred any challenges yet.</p>
            )}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/8 bg-[#1d1f24] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.28)]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Solved Challenges</h2>
            <Link href="/challenges?status=SOLVED" className="text-sm text-primary-100 hover:text-primary-200">
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {solved?.items.length ? (
              solved.items.map((item) => (
                <div key={item.challengeId} className="rounded-2xl border border-white/8 bg-[#252932] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-sm text-light-400">
                        {item.language} • {item.skillName}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold ${difficultyClasses[item.difficulty] || "text-light-100"}`}>
                      {item.difficulty}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-light-400">
                    Solved {dayjs(item.solvedAt).format("MMM D, YYYY")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-light-400">No accepted challenges yet. Start solving to build your streak.</p>
            )}
          </div>
        </section>
      </div>

      <RecentActivityTable
        items={activity?.items || profile.recentActivity}
        title="Submission History"
      />
    </div>
  );
};

export default ProfilePage;
