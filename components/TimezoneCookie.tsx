"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const TIMEZONE_COOKIE = "USER_TIMEZONE";

const TimezoneCookie = () => {
  const router = useRouter();

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!timezone) {
      return;
    }

    const currentCookie = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${TIMEZONE_COOKIE}=`))
      ?.split("=")[1];

    if (decodeURIComponent(currentCookie || "") === timezone) {
      return;
    }

    document.cookie = `${TIMEZONE_COOKIE}=${encodeURIComponent(
      timezone,
    )}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }, [router]);

  return null;
};

export default TimezoneCookie;
