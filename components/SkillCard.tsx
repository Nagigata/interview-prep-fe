"use client";

import Link from "next/link";
import Image from "next/image";
import { Skill } from "@/types";
import { motion } from "framer-motion";
import { ChevronRight, BookOpen } from "lucide-react";

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
      whileHover={{ y: -4 }}
      className="w-full"
    >
      <Link
        href={`/preparation/${skill.slug}`}
        className="group block h-full w-full"
      >
        <div className="relative h-full min-h-[220px] flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#1a1d25] to-[#12141a] p-6 transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col gap-4">
            {/* Top row: icon + challenge count */}
            <div className="flex items-start justify-between">
              {skill.icon ? (
                <div className="size-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3 flex items-center justify-center group-hover:bg-primary-200/10 group-hover:border-primary-200/20 transition-colors">
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="size-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3 flex items-center justify-center group-hover:bg-primary-200/10 group-hover:border-primary-200/20 transition-colors">
                  <BookOpen size={24} className="text-light-400" />
                </div>
              )}

              <span className="inline-flex items-center gap-1 rounded-lg border border-primary-200/20 bg-primary-200/10 px-2.5 py-1 text-[11px] font-semibold text-primary-100">
                {skill._count?.challenges || 0} {t.preparation.challenges}
              </span>
            </div>

            {/* Skill info */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white group-hover:text-primary-100 transition-colors leading-tight">
                {skill.name}
              </h3>
              <p className="text-sm text-light-400 line-clamp-2 leading-relaxed">
                {skill.description}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-1.5 text-sm font-bold text-primary-200 mt-5 group-hover:translate-x-1 transition-transform">
            <span>{t.preparation.startBtn}</span>
            <ChevronRight size={15} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SkillCard;
