import { getSkillBySlug } from "@/lib/actions/challenges.action";
import { getDictionary } from "@/lib/i18n";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Difficulty } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ skillSlug: string }>;
}

const SkillPage = async ({ params }: Props) => {
  const { skillSlug } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const t = getDictionary(locale);

  const skill = await getSkillBySlug(skillSlug);

  if (!skill) {
    notFound();
  }

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "EASY": return "text-success-100 bg-success-100/10 border-success-100/20";
      case "MEDIUM": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "HARD": return "text-destructive-100 bg-destructive-100/10 border-destructive-100/20";
      default: return "text-light-400 bg-light-400/10 border-light-400/20";
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col gap-6">
        <Link
          href="/preparation"
          className="text-sm text-light-400 hover:text-primary-100 flex items-center gap-2 transition-colors w-fit"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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

      {/* Challenges List */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-primary-100">{t.preparation.challenges}</h2>

        <div className="flex flex-col gap-4">
          {skill.challenges && skill.challenges.length > 0 ? (
            skill.challenges.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/preparation/${skill.slug}/${challenge.id}`}
                className="card-border group hover:scale-[1.01] transition-all duration-200"
              >
                <div className="card-interview flex flex-row items-center justify-between p-6 min-h-fit gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-100 transition-colors">
                      {challenge.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                        getDifficultyColor(challenge.difficulty)
                      )}>
                        {challenge.difficulty}
                      </span>
                      <div className="flex gap-2">
                        {challenge.tags.map(tag => (
                          <span key={tag} className="text-[10px] text-light-400 bg-dark-200/50 px-2 py-0.5 rounded border border-white/5">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-primary-200/10 flex items-center justify-center text-primary-200 group-hover:bg-primary-200 group-hover:text-dark-100 transition-all">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-dark-200/30 rounded-2xl border border-dashed border-dark-300">
              <p className="text-light-400 italic">No challenges found for this skill.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SkillPage;
