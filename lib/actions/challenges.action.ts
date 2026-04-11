"use server";

import { apiGet } from "@/lib/api";
import { Skill, Challenge } from "@/types";

export async function getSkills(): Promise<Skill[] | null> {
  try {
    return await apiGet<Skill[]>("/challenges/skills");
  } catch (error) {
    console.error("Error fetching skills:", error);
    return null;
  }
}

export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  try {
    return await apiGet<Skill>(`/challenges/skill/${slug}`);
  } catch (error) {
    console.error("Error fetching skill:", error);
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
