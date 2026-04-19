import { cookies } from "next/headers";
import Link from "next/link";

import BookmarkFilters from "@/components/BookmarkFilters";
import ChallengeCard from "@/components/ChallengeCard";
import { getDictionary } from "@/lib/i18n";
import { getMyStarredChallenges } from "@/lib/actions/user.actions";

interface Props {
  searchParams: Promise<Record<string, string | string[]>>;
}

const BookmarksPage = async ({ searchParams }: Props) => {
  const filters = await searchParams;
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const t = getDictionary(locale);
  const starred = await getMyStarredChallenges(1, 100, filters);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-[30px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(92,114,255,0.16),transparent_38%),linear-gradient(135deg,#1d1f24_0%,#12151b_100%)] p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-light-400">Bookmarks</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Saved Challenges</h1>
        <p className="mt-3 max-w-3xl text-light-100">
          Keep your important problems in one place so you can revisit them whenever you want to practice again.
        </p>
      </section>

      <div className="flex flex-col gap-8 lg:flex-row">
        <section className="flex flex-1 flex-col gap-4">
          {starred?.items.length ? (
            starred.items.map((item) => (
              <ChallengeCard
                key={item.id}
                challenge={{
                  id: item.id,
                  title: item.title,
                  slug: item.slug,
                  description: item.description,
                  difficulty: item.difficulty,
                  topics: item.topics,
                  isSolved: item.isSolved,
                  isStarred: item.isStarred,
                  templateCode: {},
                  testCases: [],
                  skillId: "",
                }}
                skillSlug={item.skillSlug}
                dictionary={t}
              />
            ))
          ) : filters.status || filters.difficulty ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-[#1d1f24] p-10 text-center text-light-400">
                <p>No bookmarked challenges match these filters.</p>
                <Link href="/bookmarks" className="mt-4 inline-flex font-semibold text-primary-200 hover:text-primary-100">
                  Clear all filters
                </Link>
              </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[#1d1f24] p-10 text-center text-light-400">
              You have not bookmarked any challenges yet.
            </div>
          )}
        </section>

        <BookmarkFilters />
      </div>
    </div>
  );
};

export default BookmarksPage;
