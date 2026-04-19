import Link from "next/link";

import { getMyRecentActivity } from "@/lib/actions/user.actions";
import RecentActivityTable from "@/components/RecentActivityTable";

interface Props {
  searchParams: Promise<Record<string, string | string[]>>;
}

const SubmissionsPage = async ({ searchParams }: Props) => {
  const filters = await searchParams;
  const rawPage = Array.isArray(filters.page) ? filters.page[0] : filters.page;
  const currentPage = Math.max(Number(rawPage || 1) || 1, 1);
  const activity = await getMyRecentActivity(currentPage, 10);

  const totalPages = activity?.totalPages || 1;
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const createPageHref = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    return `/submissions?${params.toString()}`;
  };

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

      {totalPages > 1 && (
        <section className="flex items-center justify-between rounded-[24px] border border-white/8 bg-[#1d1f24] px-5 py-4">
          <Link
            href={hasPreviousPage ? createPageHref(currentPage - 1) : "#"}
            aria-disabled={!hasPreviousPage}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              hasPreviousPage
                ? "bg-dark-200 text-white hover:bg-dark-100"
                : "pointer-events-none bg-dark-200/40 text-light-400"
            }`}
          >
            Previous
          </Link>

          <div className="flex items-center gap-2">
            {pageNumbers.map((pageNumber) => {
              const isActive = pageNumber === currentPage;

              return (
                <Link
                  key={pageNumber}
                  href={createPageHref(pageNumber)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${
                    isActive
                      ? "border-primary-200 bg-primary-200 text-dark-100"
                      : "border-white/8 bg-dark-200 text-light-100 hover:bg-dark-100 hover:text-white"
                  }`}
                >
                  {pageNumber}
                </Link>
              );
            })}
          </div>

          <Link
            href={hasNextPage ? createPageHref(currentPage + 1) : "#"}
            aria-disabled={!hasNextPage}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              hasNextPage
                ? "bg-primary-200 text-dark-100 hover:bg-primary-100"
                : "pointer-events-none bg-dark-200/40 text-light-400"
            }`}
          >
            Next
          </Link>
        </section>
      )}
    </div>
  );
};

export default SubmissionsPage;
