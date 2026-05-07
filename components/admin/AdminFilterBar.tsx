import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AdminFilterBarProps {
  children: ReactNode;
  className?: string;
}

const AdminFilterBar = ({ children, className }: AdminFilterBarProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default AdminFilterBar;
