import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LogoutButton from "@/components/LogoutButton";

interface NavbarProps {
  locale: string;
  t: any;
}

const Navbar = ({ locale, t }: NavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-light-100/10 bg-dark-100/80 backdrop-blur-md">
      <nav className="flex justify-between items-center h-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-all">
            <Image src="/logo.svg" alt="MockMate Logo" width={32} height={28} />
            <h2 className="text-primary-100 font-bold text-xl uppercase tracking-wider">PrepWise</h2>
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
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLocale={locale} />
          <div className="h-4 w-px bg-light-100/20" /> {/* Divider */}
          <LogoutButton label={t.common.logout} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
