"use server";

import { apiGet, apiPost } from "@/lib/api";
import { 
  CreateFeedbackParams, 
  Feedback, 
  Interview, 
  GetFeedbackByInterviewIdParams, 
  GetLatestInterviewsParams 
} from "@/types";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, transcript } = params;

  try {
    const feedback = await apiPost<Feedback>("/feedbacks", {
      interviewId,
      transcript,
    });

    return { success: true, feedbackId: feedback.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    return await apiGet<Interview>(`/interviews/${id}`);
  } catch {
    return null;
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams,
): Promise<Feedback | null> {
  const { interviewId } = params;

  try {
    return await apiGet<Feedback>(`/feedbacks/interview/${interviewId}`);
  } catch {
    return null;
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams,
): Promise<Interview[] | null> {
  try {
    return await apiGet<Interview[]>("/interviews/latest");
  } catch {
    return null;
  }
}

export async function getInterviewsByUserId(
  userId: string,
): Promise<Interview[] | null> {
  try {
    // Backend gets userId from JWT token automatically
    return await apiGet<Interview[]>("/interviews");
  } catch {
    return null;
  }
}
