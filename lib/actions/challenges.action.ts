"use server";

import { apiGet, apiPost } from "@/lib/api";
import { Skill, Challenge } from "@/types";

export async function getSkills(): Promise<Skill[] | null> {
  try {
    return await apiGet<Skill[]>("/challenges/skills");
  } catch (error) {
    console.error("Error fetching skills:", error);
    return null;
  }
}

export async function getSkillBySlug(
  slug: string,
  searchParams?: Record<string, string | string[]>
): Promise<Skill | null> {
  try {
    const query = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => query.append(key, v));
        } else if (value) {
          query.append(key, value);
        }
      });
    }
    const queryString = query.toString();
    const endpoint = `/challenges/skill/${slug}${queryString ? `?${queryString}` : ""}`;
    return await apiGet<Skill>(endpoint);
  } catch (error) {
    console.error("Error fetching skill:", error);
    return null;
  }
}

export async function toggleChallengeStar(
  id: string
): Promise<{ starred: boolean } | null> {
  try {
    return await apiPost<{ starred: boolean }>(`/challenges/${id}/star`);
  } catch (error) {
    console.error("Error toggling star:", error);
    return null;
  }
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
  try {
    return await apiGet<Challenge>(`/challenges/${id}`);
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return null;
  }
}
