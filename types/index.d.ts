export interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  language: string;
  finalized: boolean;
}

export interface CreateFeedbackParams {
  interviewId: string;
  transcript: { role: string; content: string }[];
}

export interface User {
  name: string;
  email: string;
  id: string;
}

interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
  language?: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  type: "generate" | "interview";
  language?: string;
  questions?: string[];
  dictionary?: any;
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  password: string;
}

interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface Skill {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  challenges?: Challenge[];
  _count?: {
    challenges: number;
  };
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  subdomain: string;
  skillLevel: string;
  isSolved: boolean;
  isStarred: boolean;
  templateCode: Record<string, string>;
  testCases: Array<{ input: string; output: string }>;
  skillId: string;
  skill?: Skill;
}
