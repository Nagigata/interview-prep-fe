"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  ChevronDown,
  Globe2,
  LogOut,
  ReceiptText,
  Shield,
  UserCircle2,
} from "lucide-react";

import { signOut } from "@/lib/actions/auth.action";
import UserAvatar from "@/components/UserAvatar";
import { UserProfile } from "@/types";

interface UserMenuProps {
  currentLocale: string;
  user?: UserProfile | null;
}

const languages = [
  {
    code: "en",
    label: "English",
    short: "EN",
    flag: "https://flagcdn.com/gb.svg",
  },
  {
    code: "vi",
    label: "Tiếng Việt",
    short: "VI",
    flag: "https://flagcdn.com/vn.svg",
  },
];

const menuItems = [
  {
    href: "/profile",
    label: "Profile",
    icon: UserCircle2,
  },
  {
    href: "/bookmarks",
    label: "Bookmarks",
    icon: Bookmark,
  },
  {
    href: "/submissions",
    label: "Submissions",
    icon: ReceiptText,
  },
] as const;

const UserMenu = ({ currentLocale, user }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const currentLanguage =
    languages.find((language) => language.code === currentLocale) ||
    languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    setIsOpen(false);
    router.refresh();
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-xl border border-white/10 bg-dark-200 px-2.5 py-1.5 transition hover:bg-dark-300"
      >
        <UserAvatar
          name={user?.name || "User"}
          avatarUrl={user?.avatarUrl}
          size="sm"
        />
        <span className="hidden text-sm font-medium text-light-100 lg:inline">
          {user?.name || "Account"}
        </span>
        <ChevronDown
          className={`size-4 text-light-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-70 overflow-hidden rounded-2xl border border-white/10 bg-[#1c1f26] shadow-[0_20px_60px_rgba(0,0,0,0.45)] animate-in fade-in zoom-in-95 duration-200">
          <div className="border-b border-white/8 px-4 py-4">
            <div className="flex items-center gap-3">
              <UserAvatar
                name={user?.name || "User"}
                avatarUrl={user?.avatarUrl}
                size="md"
              />
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-sm text-light-400">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-light-100 transition hover:bg-white/[0.05]"
                >
                  <Icon className="size-4 text-light-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-amber-400 transition hover:bg-amber-500/10"
              >
                <Shield className="size-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          <div className="border-t border-white/8 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-light-400">
              <Globe2 className="size-3.5" />
              <span>Language</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                    currentLocale === language.code
                      ? "border-primary-100/40 bg-primary-100/10 text-primary-100"
                      : "border-white/8 bg-white/3 text-light-100 hover:bg-white/6"
                  }`}
                >
                  <Image
                    src={language.flag}
                    alt={language.label}
                    width={18}
                    height={12}
                  />
                  <span>{language.short}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/8 p-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#f29a9a] transition hover:bg-[#ff6b6b]/10"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
