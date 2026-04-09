import { en } from "@/constants/dictionaries/en";
import { vi } from "@/constants/dictionaries/vi";

export type Locale = "en" | "vi";

export const getDictionary = (locale: string | undefined | null) => {
  if (locale === "vi") return vi;
  return en;
};
