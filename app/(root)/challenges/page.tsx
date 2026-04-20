import { getAllChallenges, getTopics } from "@/lib/actions/challenges.action";
import { getDictionary } from "@/lib/i18n";
import { cookies } from "next/headers";
import ChallengeFilters from "@/components/ChallengeFilters";
import ChallengeCard from "@/components/ChallengeCard";
import LoadMoreChallenges from "@/components/LoadMoreChallenges";
import ChallengeSearch from "@/components/ChallengeSearch";
import { CircleAlert, FolderOpenDot, Sparkles, Swords } from "lucide-react";
import Link from "next/link";

interface Props {
  searchParams: Promise<Record<string, string | string[]>>;
}

const ChallengesLibraryPage = async ({ searchParams }: Props) => {
  const filters = await searchParams;

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const t = getDictionary(locale);

  const topics = await getTopics();

  // Fetch only the first 100 items (Page 1)
  const result = await getAllChallenges({ ...filters, page: 1, limit: 100 });
  const challenges = result?.data || [];
  const totalCount = result?.total || 0;

  return (
    <div className="flex flex-col gap-10">
      <header className="relative animate-fadeIn overflow-hidden rounded-[34px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(202,197,254,0.2),_transparent_28%),linear-gradient(155deg,_rgba(18,22,30,0.98),_rgba(8,10,14,0.98))] px-7 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:px-10 sm:py-10">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary-200/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.4fr_0.8fr] xl:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/15 bg-primary-200/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-100">
              <Sparkles size={14} />
              Challenge library
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FolderOpenDot className="text-primary-100" size={30} />
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {t.common.challenges}
                </h1>
              </div>
              <p className="max-w-2xl text-base leading-7 text-light-100 sm:text-lg">
                Explore curated coding problems, filter by difficulty or topic,
                and jump straight into the challenges that match your current focus.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/8 bg-white/[0.04] px-5 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
              <div className="mb-5 flex items-start justify-between gap-4">
                <span className="text-sm font-medium text-light-100/90">
                  Available challenges
                </span>
                <Swords size={18} className="shrink-0 text-primary-100" />
              </div>
              <div className="text-3xl font-bold text-white">{totalCount}</div>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-white/[0.04] px-5 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-medium text-light-100/90">
                  Focus
                </span>
                <Sparkles size={18} className="text-cyan-300" />
              </div>
              <div className="text-lg font-semibold text-white">
                Algorithms and interview-ready practice
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="animate-fadeIn flex flex-col gap-10 lg:flex-row" style={{ animationDelay: "0.08s", animationFillMode: "both" }}>
        {/* Challenges List (Left) */}
        <section className="flex-1 flex flex-col gap-6">
          <div className="w-full">
            <ChallengeSearch />
          </div>

          <div className="flex flex-col gap-4">
            {challenges && challenges.length > 0 ? (
              <>
                {challenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    skillSlug={(challenge as any).skillSlug || "algorithms"}
                    dictionary={t}
                  />
                ))}

                {/* Infinite Scroll Listener */}
                {challenges.length === 100 && (
                  <LoadMoreChallenges initialFilters={filters} dictionary={t} />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-16 bg-dark-200/20 rounded-[2.5rem] border border-dashed border-dark-300">
                <div className="bg-dark-300/30 p-4 rounded-full mb-4">
                  <CircleAlert size={32} className="text-light-400" />
                </div>
                <p className="text-light-100 font-medium">No challenges found</p>
                <p className="text-sm text-light-400 mt-1">Try adjusting your filters to find what you're looking for.</p>
                <Link href="/challenges" className="mt-6 text-primary-200 hover:text-primary-100 font-bold text-sm">
                  Clear all filters
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Filter Sidebar (Right) */}
        <ChallengeFilters topics={topics} />
      </div>
    </div>
  );
};

export default ChallengesLibraryPage;
