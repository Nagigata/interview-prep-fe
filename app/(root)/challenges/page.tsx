import { getAllChallenges, getTopics } from "@/lib/actions/challenges.action";
import { getDictionary } from "@/lib/i18n";
import { cookies } from "next/headers";
import ChallengeFilters from "@/components/ChallengeFilters";
import ChallengeCard from "@/components/ChallengeCard";
import LoadMoreChallenges from "@/components/LoadMoreChallenges";
import ChallengeSearch from "@/components/ChallengeSearch";
import { CircleAlert, Layers } from "lucide-react";
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
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-4 text-primary-100">
          <Layers size={32} />
          <h1 className="text-4xl font-bold text-white">{t.common.challenges}</h1>
        </div>
        <p className="text-light-100 max-w-2xl">
          {t.preparation.subtitle}
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Challenges List (Left) */}
        <section className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary-100">{t.preparation.challenges}</h2>
            <span className="text-sm text-light-400">
              Showing <span className="font-bold text-primary-100">{totalCount}</span> challenges
            </span>
          </div>

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
