"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";
import UserMenu from "@/components/UserMenu";
import { UserProfile } from "@/types";

interface NavbarProps {
  locale: string;
  t: {
    common: {
      preparation: string;
      challenges: string;
      logout: string;
    };
  };
  user?: UserProfile | null;
}

const Navbar = ({ locale, t, user }: NavbarProps) => {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/preparation",
      label: t.common.preparation,
      isActive: pathname === "/preparation" || pathname.startsWith("/preparation/"),
    },
    {
      href: "/challenges",
      label: t.common.challenges,
      isActive: pathname === "/challenges" || pathname.startsWith("/challenges/"),
    },
    {
      href: "/interview",
      label: "Interview",
      isActive: pathname === "/interview" || pathname.startsWith("/interview/"),
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-light-100/10 bg-dark-100/80 backdrop-blur-md">
      <nav className="flex justify-between items-center h-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/preparation" className="flex items-center gap-2 hover:opacity-80 transition-all">
            <Image src="/logo.svg" alt="MockMate Logo" width={32} height={28} />
            <h2 className="text-primary-100 font-bold text-xl uppercase tracking-wider">PrepWise</h2>
          </Link>

          <div className="flex items-center gap-7">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative pb-1 text-sm font-medium transition-all",
                  item.isActive
                    ? "text-white"
                    : "text-light-400 hover:text-primary-100"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary-100 transition-opacity",
                    item.isActive ? "opacity-100" : "opacity-0"
                  )}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <div className="group relative hidden md:block">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-dark-200 px-3 py-2">
              <Flame className="size-4 text-[#f59e0b]" />
              <span className="text-sm font-semibold text-white">
                {user?.stats.currentStreak ?? 0}
              </span>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-[#171a20] px-3 py-1.5 text-xs font-medium text-light-100 opacity-0 shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
              {user?.stats.currentStreak ?? 0} Streaks
            </div>
          </div>
          <UserMenu currentLocale={locale} user={user} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
