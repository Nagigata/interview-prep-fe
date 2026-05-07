"use client";

import type { FormEvent } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
}

const AdminSearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  buttonLabel = "Search",
  className,
}: AdminSearchBarProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex w-full max-w-xl gap-2", className)}
    >
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-light-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-dark-200 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-light-600 transition-colors focus:border-primary-200/50 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-200/30 bg-primary-200/15 px-4 py-2.5 text-sm font-semibold text-primary-100 transition-colors hover:bg-primary-200/25"
      >
        <Search className="size-4" />
        {buttonLabel}
      </button>
    </form>
  );
};

export default AdminSearchBar;
