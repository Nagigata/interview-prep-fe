"use client";

import Link from "next/link";
import Image from "next/image";
import { Skill } from "@/types";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface SkillCardProps {
  skill: Skill;
  dictionary: any;
  index: number;
}

const SkillCard = ({ skill, dictionary, index }: SkillCardProps) => {
  const t = dictionary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="w-full"
    >
      <Link
        href={`/preparation/${skill.slug}`}
        className="card-border group block h-full w-full"
      >
        <div className="card-interview h-full min-h-[220px] p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              {skill.icon && (
                <div className="size-16 rounded-2xl bg-dark-200/50 p-3 border border-white/5 flex items-center justify-center group-hover:bg-primary-200/20 transition-colors">
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              )}

              <div className="px-3 py-1 bg-primary-200/10 border border-primary-200/20 rounded-full">
                <span className="text-primary-100 text-xs font-bold uppercase tracking-wider">
                  {skill._count?.challenges || 0} {t.preparation.challenges}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white group-hover:text-primary-100 transition-colors">
                {skill.name}
              </h3>
              <p className="text-sm text-light-100 line-clamp-2">
                {skill.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-primary-200 font-bold text-sm mt-4 group-hover:translate-x-1 transition-transform">
            <span>{t.preparation.startBtn}</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SkillCard;
