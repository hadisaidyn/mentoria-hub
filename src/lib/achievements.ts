export interface AchSummary {
  saved: number;
  applied: number;
  quizzesPassed: number;
  coursesCompleted: number;
  streak: number;
  xp: number;
  lessonsDone: number;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  test: (s: AchSummary) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-save", title: "Curator", desc: "Save your first opportunity", emoji: "🔖", test: (s) => s.saved >= 1 },
  { id: "first-apply", title: "Go-getter", desc: "Apply to an opportunity", emoji: "🎯", test: (s) => s.applied >= 1 },
  { id: "triple-apply", title: "On a Mission", desc: "Apply to 3 opportunities", emoji: "🚀", test: (s) => s.applied >= 3 },
  { id: "first-lesson", title: "First Steps", desc: "Complete a lesson", emoji: "📘", test: (s) => s.lessonsDone >= 1 },
  { id: "quiz-master", title: "Quiz Master", desc: "Pass 3 quizzes", emoji: "🧠", test: (s) => s.quizzesPassed >= 3 },
  { id: "course-complete", title: "Graduate", desc: "Finish an entire course", emoji: "🎓", test: (s) => s.coursesCompleted >= 1 },
  { id: "streak-3", title: "Consistent", desc: "Reach a 3-day streak", emoji: "🔥", test: (s) => s.streak >= 3 },
  { id: "streak-7", title: "Unstoppable", desc: "Reach a 7-day streak", emoji: "⚡", test: (s) => s.streak >= 7 },
  { id: "xp-300", title: "Rising Star", desc: "Earn 300 XP", emoji: "⭐", test: (s) => s.xp >= 300 },
  { id: "xp-700", title: "Scholar Elite", desc: "Earn 700 XP", emoji: "👑", test: (s) => s.xp >= 700 },
];

export function earnedIds(s: AchSummary): string[] {
  return ACHIEVEMENTS.filter((a) => a.test(s)).map((a) => a.id);
}
