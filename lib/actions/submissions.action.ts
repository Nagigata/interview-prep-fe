"use server";

import { apiPost } from "@/lib/api";

export const runCode = async (data: {
  challengeId: string;
  code: string;
  language: string;
}) => {
  try {
    const res = await apiPost<any>("/submissions/run", data);
    return { success: true, data: res };
  } catch (error: any) {
    console.error("Run Code Error:", error.message);
    return {
      success: false,
      error: error.message || "Failed to run code",
    };
  }
};

export const submitChallenge = async (data: {
  challengeId: string;
  code: string;
  language: string;
}) => {
  try {
    const res = await apiPost<any>("/submissions/submit", data);
    return { success: true, data: res };
  } catch (error: any) {
    console.error("Submit Challenge Error:", error.message);
    return {
      success: false,
      error: error.message || "Failed to submit challenge",
    };
  }
};
