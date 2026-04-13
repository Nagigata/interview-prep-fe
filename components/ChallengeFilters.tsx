"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Check } from "lucide-react";

interface FilterGroupProps {
  title: string;
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (value: string) => void;
}

const FilterGroup = ({ title, options, selectedValues, onChange }: FilterGroupProps) => (
  <div className="flex flex-col gap-4 border-b border-dark-300 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
    <h3 className="text-xs font-bold text-light-400 uppercase tracking-widest">{title}</h3>
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-3 group cursor-pointer">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              className="peer appearance-none size-5 rounded border border-dark-300 bg-dark-200 checked:bg-primary-200 checked:border-primary-200 transition-all cursor-pointer"
              checked={selectedValues.includes(option.value)}
              onChange={() => onChange(option.value)}
            />
            <Check 
              className="absolute size-3.5 left-0.5 text-dark-100 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" 
              strokeWidth={4} 
            />
          </div>
          <span className="text-sm text-light-100 group-hover:text-white transition-colors">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  </div>
);

interface ChallengeFiltersProps {
  subdomains: string[];
  skillLevels: string[];
}

const ChallengeFilters = ({ subdomains, skillLevels }: ChallengeFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentValues = params.getAll(name);
      
      if (currentValues.includes(value)) {
        const newValues = currentValues.filter((v) => v !== value);
        params.delete(name);
        newValues.forEach((v) => params.append(name, v));
      } else {
        params.append(name, value);
      }

      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    const queryString = createQueryString(name, value);
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const getSelectedValues = (name: string) => searchParams.getAll(name);

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-28 bg-dark-200/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
        <FilterGroup
          title="Status"
          options={[
            { label: "Solved", value: "SOLVED" },
            { label: "Unsolved", value: "UNSOLVED" },
          ]}
          selectedValues={getSelectedValues("status")}
          onChange={(val) => handleFilterChange("status", val)}
        />

        <FilterGroup
          title="Difficulty"
          options={[
            { label: "Easy", value: "EASY" },
            { label: "Medium", value: "MEDIUM" },
            { label: "Hard", value: "HARD" },
          ]}
          selectedValues={getSelectedValues("difficulty")}
          onChange={(val) => handleFilterChange("difficulty", val)}
        />

        {subdomains.length > 0 && (
          <FilterGroup
            title="Subdomains"
            options={subdomains.map((s) => ({ label: s, value: s }))}
            selectedValues={getSelectedValues("subdomain")}
            onChange={(val) => handleFilterChange("subdomain", val)}
          />
        )}

        {skillLevels.length > 0 && (
          <FilterGroup
            title="Skill Levels"
            options={skillLevels.map((s) => ({ label: s, value: s }))}
            selectedValues={getSelectedValues("skillLevel")}
            onChange={(val) => handleFilterChange("skillLevel", val)}
          />
        )}
      </div>
    </aside>
  );
};

export default ChallengeFilters;
