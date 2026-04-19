import Image from "next/image";

import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "size-9 text-sm",
  md: "size-12 text-base",
  lg: "size-20 text-2xl",
  xl: "size-28 text-4xl",
};

const UserAvatar = ({
  name,
  avatarUrl,
  size = "md",
  className,
}: UserAvatarProps) => {
  const isLocalAvatar =
    avatarUrl?.startsWith("http://localhost:3001/") ||
    avatarUrl?.startsWith("http://127.0.0.1:3001/");

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-[#28303d] via-[#1b2029] to-[#11151b] shadow-lg",
        sizeClasses[size],
        className,
      )}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          fill
          unoptimized={isLocalAvatar}
          className="object-cover"
          sizes="(max-width: 768px) 96px, 128px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-bold text-primary-100">
          {initials || "U"}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
