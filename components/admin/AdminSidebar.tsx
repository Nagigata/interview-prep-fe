"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Code2,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/interviews", label: "Interviews", icon: MessageSquare },
  { href: "/admin/challenges", label: "Challenges", icon: Code2 },
  { href: "/admin/skills", label: "Skills", icon: Layers },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-60 border-r border-white/10 bg-dark-100/95 backdrop-blur-md z-40 flex flex-col">
      <div className="p-5 border-b border-white/10">
        <h2 className="text-lg font-bold text-primary-200 tracking-wide">
          Admin Panel
        </h2>
        <p className="text-xs text-light-400 mt-0.5">System Management</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive =
            (item.href === "/admin" && pathname === "/admin") ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary-200/15 text-primary-200 shadow-[0_0_12px_rgba(202,197,254,0.08)]"
                  : "text-light-400 hover:text-light-100 hover:bg-white/5"
              )}
            >
              <Icon className={cn("size-[18px]", isActive && "text-primary-200")} />
              {item.label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-200" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <Link
          href="/preparation"
          className="flex items-center gap-2 px-3 py-2.5 text-sm text-light-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
        >
          <ArrowLeft className="size-4" />
          Back to App
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
