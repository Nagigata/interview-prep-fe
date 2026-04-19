import { getMyRecentActivity } from "@/lib/actions/user.actions";
import RecentActivityTable from "@/components/RecentActivityTable";

const SubmissionsPage = async () => {
  const activity = await getMyRecentActivity(1, 50);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-[30px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(92,114,255,0.16),transparent_38%),linear-gradient(135deg,#1d1f24_0%,#12151b_100%)] p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-light-400">Submissions</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Submission History</h1>
        <p className="mt-3 max-w-3xl text-light-100">
          Review your latest attempts, track your accepted solutions, and revisit problems you want to improve.
        </p>
      </section>

      <RecentActivityTable
        items={activity?.items || []}
        title="All Recent Submissions"
      />
    </div>
  );
};

export default SubmissionsPage;
