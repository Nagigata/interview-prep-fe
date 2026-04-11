import { getSkills } from "@/lib/actions/challenges.action";
import { getDictionary } from "@/lib/i18n";
import { cookies } from "next/headers";
import SkillCard from "@/components/SkillCard";

const PreparationPage = async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const t = getDictionary(locale);

  const skills = await getSkills();

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          {t.preparation.title}
        </h1>
        <p className="text-lg text-light-100 max-w-2xl">
          {t.preparation.subtitle}
        </p>
      </header>

      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary-100">
            {t.preparation.skillTitle}
          </h2>
        </div>

        {skills && skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                dictionary={t}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 bg-dark-200/30 rounded-3xl border border-dashed border-dark-300">
            <p className="text-light-400 italic">
              {t.preparation.noSkills}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default PreparationPage;
