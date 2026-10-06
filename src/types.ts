export type LearningStatus = "未开始" | "进行中" | "已完成";
export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  status: LearningStatus;
  difficulty: string;
  progress: number;
  goals: string[];
  terms: string[];
  color: string;
}
export interface LessonContent {
  definition: string;
  purpose: string;
  principle: string;
  example: string;
  caution: string;
}
export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  summary: string;
  content: LessonContent;
  keyPoints: string[];
  duration: number;
  completed: boolean;
}
export interface SmartMetric {
  id: number;
  name: string;
  description: string;
  meaning: string;
  riskLevel: "低" | "中" | "高";
  normalRange: string;
  unit: string;
  category: string;
  value: string;
  risk: string;
}
export interface Quiz {
  id: string;
  chapterId: string;
  type: "choice" | "boolean" | "fill";
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
}
export interface Stats {
  totalChapters: number;
  totalLessons: number;
  completedLessons: number;
  accuracyRate: number;
  remainingStudyDays: number;
  progress: number;
}
export type DashboardStats = Stats;
export interface QuizResult {
  id: string;
  chapterId: string;
  correct: number;
  total: number;
  date: string;
}
export interface LearningState {
  completed: string[];
  bookmarks: string[];
  checkIns: string[];
  quizResults: QuizResult[];
  lastLesson: string | null;
  name: string;
}
