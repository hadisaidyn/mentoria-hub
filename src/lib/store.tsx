"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import confetti from "canvas-confetti";
import { COURSES, OPPORTUNITIES } from "./data";
import { DICTS, I18nContext } from "./i18n";
import { ACHIEVEMENTS, earnedIds, type AchSummary } from "./achievements";
import type { Course, Lang, Lesson, Opportunity, Profile, Theme } from "./types";

export function celebrate() {
  try {
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, zIndex: 9999 });
    setTimeout(
      () => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, zIndex: 9999 }),
      120,
    );
    setTimeout(
      () => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, zIndex: 9999 }),
      240,
    );
  } catch {}
}

const KEY = "mentoria-hub-v1";

export const XP = { apply: 50, lesson: 20, quiz: 30, course: 100 };

interface Toast {
  id: number;
  msg: string;
  kind: "success" | "info";
}

interface Persisted {
  profile: Profile | null;
  onboarded: boolean;
  saved: string[];
  applied: string[];
  completed: Record<string, string[]>; // courseId -> lessonIds
  quiz: Record<string, number>; // lessonId -> score %
  xp: number;
  streak: number;
  lastActive: string;
  lang: Lang;
  theme: Theme;
  telegram: boolean;
  achievements: string[];
  stages: Record<string, string>; // opportunityId -> pipeline stage
  opportunities: Opportunity[];
  courses: Course[];
}

export type Stage = "interested" | "applying" | "submitted" | "accepted";
export const STAGES: Stage[] = ["interested", "applying", "submitted", "accepted"];

const todayStr = () => new Date().toISOString().slice(0, 10);

const initial: Persisted = {
  profile: null,
  onboarded: false,
  saved: [],
  applied: [],
  completed: {},
  quiz: {},
  xp: 0,
  streak: 0,
  lastActive: "",
  lang: "en",
  theme: "light",
  telegram: false,
  achievements: [],
  stages: {},
  opportunities: OPPORTUNITIES,
  courses: COURSES,
};

interface Store extends Persisted {
  hydrated: boolean;
  toasts: Toast[];
  // profile
  setProfile: (p: Profile) => void;
  completeOnboarding: (p: Profile) => void;
  resetAll: () => void;
  // opportunities
  toggleSave: (id: string) => void;
  toggleApplied: (id: string) => void;
  setStage: (id: string, stage: string | null) => void;
  // learning
  completeLesson: (courseId: string, lessonId: string) => void;
  recordQuiz: (lessonId: string, scorePct: number) => void;
  // prefs
  setLang: (l: Lang) => void;
  toggleTheme: () => void;
  linkTelegram: () => void;
  // toast
  toast: (msg: string, kind?: "success" | "info") => void;
  dismissToast: (id: number) => void;
  // admin
  upsertOpportunity: (o: Opportunity) => void;
  deleteOpportunity: (id: string) => void;
  upsertCourse: (c: Course) => void;
  deleteCourse: (id: string) => void;
  addLesson: (courseId: string, lesson: Lesson) => void;
}

const StoreContext = createContext<Store | null>(null);

export function useStore() {
  const s = useContext(StoreContext);
  if (!s) throw new Error("useStore must be used inside <Providers>");
  return s;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<Persisted>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS({ ...initial, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  // persist
  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(s));
  }, [s, hydrated]);

  // theme class
  useEffect(() => {
    const root = document.documentElement;
    if (s.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [s.theme]);

  // achievement unlock detection
  useEffect(() => {
    if (!hydrated) return;
    const summary: AchSummary = {
      saved: s.saved.length,
      applied: s.applied.length,
      quizzesPassed: Object.values(s.quiz).filter((v) => v >= 50).length,
      coursesCompleted: s.courses.filter(
        (c) => c.lessons.length > 0 && (s.completed[c.id]?.length ?? 0) === c.lessons.length,
      ).length,
      streak: s.streak,
      xp: s.xp,
      lessonsDone: Object.values(s.completed).reduce((n, a) => n + a.length, 0),
    };
    const earned = earnedIds(summary);
    const fresh = earned.filter((id) => !s.achievements.includes(id));
    if (fresh.length) {
      celebrate();
      fresh.forEach((id, i) => {
        const a = ACHIEVEMENTS.find((x) => x.id === id);
        if (!a) return;
        const tid = Math.floor(Date.now() + Math.random() * 100000) + i;
        setToasts((t) => [...t, { id: tid, msg: `${a.emoji} Achievement unlocked: ${a.title}`, kind: "success" }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== tid)), 5000);
      });
      setS((p) => ({
        ...p,
        achievements: Array.from(new Set(p.achievements.concat(fresh))),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.saved, s.applied, s.quiz, s.completed, s.streak, s.xp, hydrated]);

  const toast = useCallback((msg: string, kind: "success" | "info" = "success") => {
    const id = Date.now() + Math.floor(performance.now());
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);
  const dismissToast = useCallback(
    (id: number) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  );

  // streak bump on activity
  const bumpStreak = useCallback((p: Persisted): Persisted => {
    const today = todayStr();
    if (p.lastActive === today) return p;
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    const streak = p.lastActive === yesterday ? p.streak + 1 : 1;
    return { ...p, streak, lastActive: today };
  }, []);

  const addXp = useCallback((p: Persisted, n: number): Persisted => ({ ...p, xp: p.xp + n }), []);

  const api: Store = useMemo(() => {
    return {
      ...s,
      hydrated,
      toasts,
      toast,
      dismissToast,
      setProfile: (profile) => setS((p) => ({ ...p, profile })),
      completeOnboarding: (profile) =>
        setS((p) => ({ ...p, profile, onboarded: true })),
      resetAll: () => {
        setS(initial);
        toast("Demo data reset", "info");
      },
      toggleSave: (id) =>
        setS((p) => {
          const has = p.saved.includes(id);
          if (!has) toast("Saved to your list");
          return { ...p, saved: has ? p.saved.filter((x) => x !== id) : [...p.saved, id] };
        }),
      toggleApplied: (id) =>
        setS((p) => {
          const has = p.applied.includes(id);
          if (has) return { ...p, applied: p.applied.filter((x) => x !== id) };
          toast(`+${XP.apply} XP · Marked as applied 🎯`);
          return bumpStreak(addXp({ ...p, applied: [...p.applied, id] }, XP.apply));
        }),
      setStage: (id, stage) =>
        setS((p) => {
          const stages = { ...p.stages };
          if (stage === null) delete stages[id];
          else stages[id] = stage;
          if (stage === "accepted" && p.stages[id] !== "accepted") celebrate();
          // Reaching "submitted" or beyond counts as applied (keeps XP/achievements in sync).
          const applied =
            (stage === "submitted" || stage === "accepted") && !p.applied.includes(id)
              ? [...p.applied, id]
              : p.applied;
          return { ...p, stages, applied };
        }),
      completeLesson: (courseId, lessonId) =>
        setS((p) => {
          const done = p.completed[courseId] || [];
          if (done.includes(lessonId)) return p;
          const completed = { ...p.completed, [courseId]: [...done, lessonId] };
          const course = p.courses.find((c) => c.id === courseId);
          const finishedCourse =
            course && completed[courseId].length === course.lessons.length;
          if (finishedCourse) {
            toast(`🎓 Course complete! +${XP.course} XP & certificate unlocked`);
            celebrate();
          }
          else toast(`+${XP.lesson} XP · Lesson complete`);
          let next = bumpStreak(addXp({ ...p, completed }, XP.lesson));
          if (finishedCourse) next = addXp(next, XP.course);
          return next;
        }),
      recordQuiz: (lessonId, scorePct) =>
        setS((p) => {
          const prev = p.quiz[lessonId] ?? -1;
          const quiz = { ...p.quiz, [lessonId]: Math.max(prev, scorePct) };
          if (scorePct >= 50 && prev < 50) {
            toast(`+${XP.quiz} XP · Quiz passed (${scorePct}%) 🧠`);
            return bumpStreak(addXp({ ...p, quiz }, XP.quiz));
          }
          return { ...p, quiz };
        }),
      setLang: (lang) => setS((p) => ({ ...p, lang })),
      toggleTheme: () =>
        setS((p) => ({ ...p, theme: p.theme === "dark" ? "light" : "dark" })),
      linkTelegram: () =>
        setS((p) => {
          const now = !p.telegram;
          toast(
            now
              ? "✈️ Telegram linked — deadline alerts will arrive automatically"
              : "Telegram unlinked",
            "info",
          );
          return { ...p, telegram: now };
        }),
      upsertOpportunity: (o) =>
        setS((p) => {
          const exists = p.opportunities.some((x) => x.id === o.id);
          toast(exists ? "Opportunity updated" : "Opportunity published", "info");
          return {
            ...p,
            opportunities: exists
              ? p.opportunities.map((x) => (x.id === o.id ? o : x))
              : [o, ...p.opportunities],
          };
        }),
      deleteOpportunity: (id) =>
        setS((p) => {
          toast("Opportunity removed", "info");
          return {
            ...p,
            opportunities: p.opportunities.filter((x) => x.id !== id),
            saved: p.saved.filter((x) => x !== id),
          };
        }),
      upsertCourse: (c) =>
        setS((p) => {
          const exists = p.courses.some((x) => x.id === c.id);
          toast(exists ? "Course updated" : "Course published", "info");
          return {
            ...p,
            courses: exists
              ? p.courses.map((x) => (x.id === c.id ? c : x))
              : [c, ...p.courses],
          };
        }),
      deleteCourse: (id) =>
        setS((p) => {
          toast("Course removed", "info");
          return { ...p, courses: p.courses.filter((x) => x.id !== id) };
        }),
      addLesson: (courseId, lesson) =>
        setS((p) => {
          toast("Lesson added", "info");
          return {
            ...p,
            courses: p.courses.map((c) =>
              c.id === courseId ? { ...c, lessons: [...c.lessons, lesson] } : c,
            ),
          };
        }),
    };
  }, [s, hydrated, toasts, toast, dismissToast, bumpStreak, addXp]);

  const i18n = useMemo(
    () => ({ lang: s.lang, t: (k: string) => DICTS[s.lang][k] ?? DICTS.en[k] ?? k }),
    [s.lang],
  );

  return (
    <StoreContext.Provider value={api}>
      <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>
    </StoreContext.Provider>
  );
}
