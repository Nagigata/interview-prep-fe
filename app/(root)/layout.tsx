import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) redirect("/sign-in");

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

  return (
    <div className="root-layout">
      <nav className="flex justify-between items-center w-full">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>

        {/* Right side controls */}
        <LanguageSwitcher currentLocale={locale} />
      </nav>
      {/* Main Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default RootLayout;
