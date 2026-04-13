import { getSkillBySlug } from "@/lib/actions/challenges.action";
import { getDictionary } from "@/lib/i18n";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ChallengeFilters from "@/components/ChallengeFilters";
import ChallengeCard from "@/components/ChallengeCard";

import { ChevronLeft, CircleAlert } from "lucide-react";

interface Props {
  params: Promise<{ skillSlug: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}

const SkillPage = async ({ params, searchParams }: Props) => {
  const { skillSlug } = await params;
  const filters = await searchParams;
  
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const t = getDictionary(locale);

  const skill = await getSkillBySlug(skillSlug, filters);

  if (!skill) {
    notFound();
  }

  // Extract unique subdomains and levels from the currently fetched challenges (or we could fetch all)
  const subdomains = Array.from(new Set(skill.challenges?.map(c => c.subdomain).filter(Boolean) as string[]));
  const skillLevels = Array.from(new Set(skill.challenges?.map(c => c.skillLevel).filter(Boolean) as string[]));

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col gap-6">
        <Link
          href="/preparation"
          className="text-sm text-light-400 hover:text-primary-100 flex items-center gap-2 transition-colors w-fit"
        >
          <ChevronLeft size={16} />
          {t.common.backHome}
        </Link>

        <div className="flex items-center gap-6">
          {skill.icon && (
            <div className="size-20 rounded-3xl bg-dark-200/50 p-4 border border-white/5 flex items-center justify-center">
              <Image src={skill.icon} alt={skill.name} width={56} height={56} />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-white">{skill.name}</h1>
            <p className="text-light-100 max-w-2xl">{skill.description}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Challenges List (Left) */}
        <section className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary-100">{t.preparation.challenges}</h2>
            <span className="text-sm text-light-400">
              Showing {skill.challenges?.length || 0} challenges
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {skill.challenges && skill.challenges.length > 0 ? (
              skill.challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  skillSlug={skill.slug}
                  dictionary={t}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-16 bg-dark-200/20 rounded-[2.5rem] border border-dashed border-dark-300">
                <div className="bg-dark-300/30 p-4 rounded-full mb-4">
                  <CircleAlert size={32} className="text-light-400" />
                </div>
                <p className="text-light-100 font-medium">No challenges found</p>
                <p className="text-sm text-light-400 mt-1">Try adjusting your filters to find what you're looking for.</p>
                <Link href={`/preparation/${skill.slug}`} className="mt-6 text-primary-200 hover:text-primary-100 font-bold text-sm">
                  Clear all filters
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Filter Sidebar (Right) */}
        <ChallengeFilters subdomains={subdomains} skillLevels={skillLevels} />
      </div>
    </div>
  );
};

export default SkillPage;
