"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface AdminSelectOption {
  value: string;
  label: string;
}

interface AdminSelectFilterProps {
  label: string;
  value: string;
  options: AdminSelectOption[];
  onChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
  hideLabel?: boolean;
}

const AdminSelectFilter = ({
  label,
  value,
  options,
  onChange,
  className,
  triggerClassName,
  hideLabel = false,
}: AdminSelectFilterProps) => {
  return (
    <div className={cn("min-w-[150px]", className)}>
      {!hideLabel && (
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.22em] text-light-500">
          {label}
        </span>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onChange}>
        <SelectPrimitive.Trigger
          aria-label={label}
          className={cn(
            "group flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-dark-200 px-3 py-2.5 text-left text-sm text-white outline-none transition-colors hover:border-white/20 focus:border-primary-200/50 data-[state=open]:border-primary-200/50",
            triggerClassName,
          )}
        >
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="size-4 text-light-400 transition-transform group-data-[state=open]:rotate-180" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={8}
            className="z-[120] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-white/10 bg-[#171a20] p-1 shadow-2xl shadow-black/40 animate-in fade-in zoom-in-95"
          >
            <SelectPrimitive.Viewport>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm text-light-100 outline-none transition-colors data-[highlighted]:bg-primary-200/15 data-[highlighted]:text-white"
                >
                  <SelectPrimitive.ItemIndicator className="absolute left-2.5 inline-flex items-center">
                    <Check className="size-3.5 text-primary-100" />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
};

export default AdminSelectFilter;
