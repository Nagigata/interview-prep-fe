import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LogoutButton from "@/components/LogoutButton";
import UserAvatar from "@/components/UserAvatar";
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
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-light-100/10 bg-dark-100/80 backdrop-blur-md">
      <nav className="flex justify-between items-center h-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-all">
            <Image src="/logo.svg" alt="MockMate Logo" width={32} height={28} />
            <h2 className="text-primary-100 font-bold text-xl uppercase tracking-wider">PrepWise</h2>
          </Link>

          <Link
            href="/"
            className="text-light-400 hover:text-primary-100 font-medium text-sm transition-all"
          >
            Dashboard
          </Link>

          <Link
            href="/preparation"
            className="text-light-400 hover:text-primary-100 font-medium text-sm transition-all"
          >
            {t.common.preparation}
          </Link>

          <Link
            href="/challenges"
            className="text-light-400 hover:text-primary-100 font-medium text-sm transition-all"
          >
            {t.common.challenges}
          </Link>

          <Link
            href="/interview"
            className="text-light-400 hover:text-primary-100 font-medium text-sm transition-all"
          >
            Interview
          </Link>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLocale={locale} />
          <div className="h-4 w-px bg-light-100/20" /> {/* Divider */}
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-dark-200 px-2.5 py-1.5 transition hover:bg-dark-300"
          >
            <UserAvatar
              name={user?.name || "User"}
              avatarUrl={user?.avatarUrl}
              size="sm"
            />
            <span className="hidden text-sm font-medium text-light-100 lg:inline">
              {user?.name || "Profile"}
            </span>
          </Link>
          <LogoutButton label={t.common.logout} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
