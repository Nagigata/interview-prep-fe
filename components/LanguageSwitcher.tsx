"use client";

import { useRouter } from "next/navigation";

interface LanguageSwitcherProps {
  currentLocale: string;
}

const LanguageSwitcher = ({ currentLocale }: LanguageSwitcherProps) => {
  const router = useRouter();

  const handleLanguageChange = (locale: string) => {
    // Set cookie
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    // Refresh to apply new language in server components
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 relative z-50">
      <select
        value={currentLocale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-dark-200 border border-dark-300 rounded-md px-2 py-1 text-sm outline-none cursor-pointer focus:ring hover:border-user-primary text-white transition-all shadow-md group relative z-50"
        style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', paddingRight: '25px', backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white"><path d="M4 6l4 4 4-4"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
      >
        <option value="en" className="bg-dark-200">🇺🇸 EN</option>
        <option value="vi" className="bg-dark-200">🇻🇳 VI</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
