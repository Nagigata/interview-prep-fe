"use server";

import { apiGet, apiPatch, apiPost } from "@/lib/api";

export async function getAdminDashboard() {
  try {
    return await apiGet<any>("/admin/dashboard");
  } catch {
    return null;
  }
}

export async function getAdminStats() {
  try {
    return await apiGet<any>("/admin/stats");
  } catch {
    return null;
  }
}

export async function getAdminUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    return await apiGet<any>(`/admin/users?${query.toString()}`);
  } catch {
    return null;
  }
}

export async function getAdminUserDetail(userId: string) {
  try {
    return await apiGet<any>(`/admin/users/${userId}`);
  } catch {
    return null;
  }
}

export async function updateAdminUser(
  userId: string,
  data: { role?: string; isActive?: boolean }
) {
  try {
    return await apiPatch<any>(`/admin/users/${userId}`, data);
  } catch {
    return null;
  }
}

export async function getAdminInterviews(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    return await apiGet<any>(`/admin/interviews?${query.toString()}`);
  } catch {
    return null;
  }
}

export async function getAdminInterviewDetail(interviewId: string) {
  try {
    return await apiGet<any>(`/admin/interviews/${interviewId}`);
  } catch {
    return null;
  }
}

export async function getAdminInterviewAttemptDetail(
  interviewId: string,
  attemptId: string
) {
  try {
    return await apiGet<any>(
      `/admin/interviews/${interviewId}/attempts/${attemptId}`
    );
  } catch {
    return null;
  }
}

export async function archiveAdminInterview(interviewId: string) {
  return apiPatch<any>(`/admin/interviews/${interviewId}/archive`);
}

export async function restoreAdminInterview(interviewId: string) {
  return apiPatch<any>(`/admin/interviews/${interviewId}/restore`);
}

export async function getAdminChallenges(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    return await apiGet<any>(`/admin/challenges?${query.toString()}`);
  } catch {
    return null;
  }
}

export async function createAdminChallenge(data: any) {
  return apiPost<any>("/admin/challenges", data);
}

export async function updateAdminChallenge(id: string, data: any) {
  return apiPatch<any>(`/admin/challenges/${id}`, data);
}

export async function getAdminSkills() {
  try {
    return await apiGet<any>("/admin/skills");
  } catch {
    return null;
  }
}

export async function createAdminSkill(data: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}) {
  return apiPost<any>("/admin/skills", data);
}

export async function updateAdminSkill(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
  }
) {
  return apiPatch<any>(`/admin/skills/${id}`, data);
}
