import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { LearningState, QuizResult, Stats } from "../types";
import { chapters, lessons } from "../data/curriculum";
const KEY = "ssd-lab-learning-v1";
const initial: LearningState = {
  completed: [],
  bookmarks: [],
  checkIns: [],
  quizResults: [],
  lastLesson: null,
  name: "探索者",
};
export function localDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function read(): LearningState {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!s || typeof s !== "object") return initial;
    const ids = new Set(lessons.map((l) => l.id));
    return {
      completed: Array.isArray(s.completed)
        ? [
            ...new Set<string>(
              s.completed.filter(
                (x: unknown) => typeof x === "string" && ids.has(x),
              ),
            ),
          ]
        : [],
      bookmarks: Array.isArray(s.bookmarks)
        ? s.bookmarks.filter(
            (x: unknown) => typeof x === "string" && ids.has(x),
          )
        : [],
      checkIns: Array.isArray(s.checkIns)
        ? s.checkIns.filter(
            (x: unknown) =>
              typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x),
          )
        : [],
      quizResults: Array.isArray(s.quizResults)
        ? s.quizResults.filter(
            (x: QuizResult) =>
              x &&
              typeof x.id === "string" &&
              Number.isInteger(x.total) &&
              x.total > 0 &&
              Number.isInteger(x.correct) &&
              x.correct >= 0 &&
              x.correct <= x.total &&
              typeof x.date === "string" &&
              chapters.some((c) => c.id === x.chapterId),
          )
        : [],
      lastLesson: ids.has(s.lastLesson) ? s.lastLesson : null,
      name: typeof s.name === "string" ? s.name.slice(0, 24) : initial.name,
    };
  } catch {
    return initial;
  }
}
interface Context {
  state: LearningState;
  stats: Stats;
  storageError: boolean;
  complete: (id: string) => void;
  bookmark: (id: string) => void;
  visit: (id: string) => void;
  checkIn: () => void;
  saveQuiz: (r: Omit<QuizResult, "id" | "date">) => void;
  rename: (name: string) => void;
}
const LearningContext = createContext<Context | null>(null);
export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, set] = useState<LearningState>(read);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [state]);
  const correct = state.quizResults.reduce((n, r) => n + r.correct, 0),
    total = state.quizResults.reduce((n, r) => n + r.total, 0);
  const stats: Stats = {
    totalChapters: chapters.length,
    totalLessons: lessons.length,
    completedLessons: state.completed.length,
    accuracyRate: total ? Math.round((correct / total) * 100) : 0,
    remainingStudyDays: Math.ceil(
      (lessons.length - state.completed.length) / 2,
    ),
    progress: Math.round((state.completed.length / lessons.length) * 100),
  };
  const value: Context = {
    state,
    stats,
    storageError,
    complete: (id) =>
      set((s) => ({
        ...s,
        completed: s.completed.includes(id)
          ? s.completed
          : [...s.completed, id],
      })),
    bookmark: (id) =>
      set((s) => ({
        ...s,
        bookmarks: s.bookmarks.includes(id)
          ? s.bookmarks.filter((x) => x !== id)
          : [...s.bookmarks, id],
      })),
    visit: (id) =>
      set((s) => (s.lastLesson === id ? s : { ...s, lastLesson: id })),
    checkIn: () =>
      set((s) => ({
        ...s,
        checkIns: s.checkIns.includes(localDate())
          ? s.checkIns
          : [...s.checkIns, localDate()],
      })),
    saveQuiz: (r) =>
      set((s) => ({
        ...s,
        quizResults: [
          ...s.quizResults,
          { ...r, id: crypto.randomUUID(), date: new Date().toISOString() },
        ],
      })),
    rename: (name) =>
      set((s) => ({ ...s, name: name.trim().slice(0, 24) || "探索者" })),
  };
  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}
export function useLearning() {
  const c = useContext(LearningContext);
  if (!c) throw new Error("LearningProvider missing");
  return c;
}
export function useChapters() {
  const { state } = useLearning();
  return chapters.map((c) => {
    const ls = lessons.filter((l) => l.chapterId === c.id),
      count = ls.filter((l) => state.completed.includes(l.id)).length;
    return {
      ...c,
      progress: Math.round((count / ls.length) * 100),
      status:
        count === ls.length
          ? ("已完成" as const)
          : count
            ? ("进行中" as const)
            : ("未开始" as const),
    };
  });
}
