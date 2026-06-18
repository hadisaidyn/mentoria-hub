import type { Course, Lang, Opportunity, Profile } from "./types";

/** Days between now and a deadline (ISO). Negative = passed. */
export function daysUntil(iso: string, now = new Date()): number {
  const d = new Date(iso + "T23:59:59");
  return Math.ceil((d.getTime() - now.getTime()) / 86_400_000);
}

export function formatDeadline(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Score how well an opportunity matches a profile (0–100). */
export function scoreOpportunity(o: Opportunity, p: Profile | null): number {
  if (!p) return 0;
  let score = 0;
  if (p.interests.includes(o.direction)) score += 45;
  // tag overlap with interest keywords
  const interestWords = p.interests.map((i) => i.toLowerCase());
  if (o.tags.some((t) => interestWords.some((w) => w.includes(t) || t.includes(w))))
    score += 10;
  if (o.grades.includes(p.grade)) score += 25;
  else score -= 15;
  // goal alignment
  if (p.goals.includes("Scholarships") && o.type === "Scholarship") score += 12;
  if (p.goals.includes("Competitions") && ["Olympiad", "Competition", "Hackathon"].includes(o.type))
    score += 12;
  if (p.goals.includes("University Admission") && ["Summer School", "Research"].includes(o.type))
    score += 10;
  if (p.goals.includes("Skill Building") && ["Internship", "Hackathon"].includes(o.type))
    score += 8;
  // deadline urgency nudge
  const d = daysUntil(o.deadline);
  if (d > 0 && d <= 30) score += 6;
  return Math.max(0, Math.min(100, score));
}

export function scoreCourse(c: Course, p: Profile | null): number {
  if (!p) return 0;
  let score = 0;
  if (p.interests.includes(c.direction)) score += 50;
  if (p.goals.includes("University Admission") && c.tags.includes("admission")) score += 20;
  if (p.goals.includes("Skill Building")) score += 10;
  return Math.min(100, score);
}

export function recommendedOpportunities(opps: Opportunity[], p: Profile | null) {
  if (!p) return opps;
  return [...opps]
    .map((o) => ({ o, s: scoreOpportunity(o, p) }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.o);
}

/**
 * Simulated "AI College Counselor". Deterministic, profile-aware response
 * generation — mirrors how an LLM-backed endpoint would format a roadmap.
 */
/** Localized phrases for the simulated counselor. Opportunity titles stay verbatim. */
const AI: Record<Lang, Record<string, string>> = {
  en: {
    noProfile:
      "Hi! Complete your profile first so I can tailor advice to your grade, interests and goals. Tap **Personalize** in the top bar.",
    nothingUrgent: "nothing is closing imminently for grade",
    nothingUrgent2: ". Great moment to start a course!",
    urgentPre: "your most urgent fit is",
    daysLeft: "days left (closes",
    urgentMatch: "It matches your interest in",
    addSaved: "Want me to add it to your saved list?",
    coursePre: "Based on your interests",
    courseBody:
      ", I'd start with a course aligned to your top interest. Pair it with daily 20-min sessions to build a streak — async learning beats cramming. Check the **Courses** tab for your top pick.",
    roadmapPre: "Based on your **grade",
    roadmapMid: "** standing and your interests, here's your personalized priority list:",
    closes: "closes",
    strategy:
      "💡 Strategy: lock in the nearest deadline first, then build depth with a matching course. You've got this!",
    grade: "grade",
  },
  ru: {
    noProfile:
      "Привет! Сначала заполните профиль, чтобы я мог подобрать советы под ваш класс, интересы и цели. Нажмите **Настроить** вверху.",
    nothingUrgent: "ничего срочного для класса",
    nothingUrgent2: " нет. Отличный момент начать курс!",
    urgentPre: "ваш самый срочный вариант —",
    daysLeft: "дн. осталось (закрытие",
    urgentMatch: "Это совпадает с вашим интересом к направлению",
    addSaved: "Добавить это в сохранённые?",
    coursePre: "Исходя из ваших интересов",
    courseBody:
      ", я бы начал с курса по вашему главному интересу. Добавьте ежедневные 20-минутные сессии для серии — асинхронное обучение лучше зубрёжки. Загляните во вкладку **Курсы**.",
    roadmapPre: "Исходя из вашего **класса",
    roadmapMid: "** и интересов, вот ваш персональный список приоритетов:",
    closes: "закрытие",
    strategy:
      "💡 Стратегия: сначала закройте ближайший дедлайн, затем углубляйтесь с подходящим курсом. У вас всё получится!",
    grade: "класс",
  },
  kk: {
    noProfile:
      "Сәлем! Алдымен профиліңізді толтырыңыз, сонда сыныбыңызға, қызығушылықтарыңызға және мақсаттарыңызға кеңес бере аламын. Жоғарыдағы **Жекелендіру** түймесін басыңыз.",
    nothingUrgent: "сыныбы үшін шұғыл ештеңе жоқ:",
    nothingUrgent2: ". Курс бастауға тамаша сәт!",
    urgentPre: "ең шұғыл нұсқаңыз —",
    daysLeft: "күн қалды (жабылуы",
    urgentMatch: "Бұл сіздің қызығушылығыңызға сәйкес:",
    addSaved: "Оны сақталғандарға қосайын ба?",
    coursePre: "Қызығушылықтарыңызға сүйене отырып",
    courseBody:
      ", басты қызығушылығыңызға сай курстан бастаған жөн. Серия жасау үшін күнделікті 20 минуттық сабақ қосыңыз — асинхронды оқу жаттаудан тиімді. **Курстар** қойындысын қараңыз.",
    roadmapPre: "Сіздің **сыныбыңыз",
    roadmapMid: "** мен қызығушылықтарыңызға сүйене отырып, жеке басымдықтар тізімі:",
    closes: "жабылуы",
    strategy:
      "💡 Стратегия: алдымен ең жақын мерзімді жабыңыз, содан кейін сай курспен тереңдетіңіз. Сіз қолдан келеді!",
    grade: "сынып",
  },
};

export function aiCounselorReply(
  message: string,
  p: Profile | null,
  opps: Opportunity[],
  lang: Lang = "en",
): string {
  const L = AI[lang] || AI.en;
  const name = p?.name?.split(" ")[0] || "👋";
  if (!p) return L.noProfile;

  const lower = message.toLowerCase();
  const topMatches = recommendedOpportunities(opps, p)
    .filter((o) => daysUntil(o.deadline) > 0)
    .slice(0, 3);

  const urgent = [...opps]
    .filter((o) => daysUntil(o.deadline) > 0 && o.grades.includes(p.grade))
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))[0];

  const deadlineWords = ["deadline", "urgent", "soon", "дедлайн", "сроч", "мерзім", "шұғыл"];
  const courseWords = ["course", "study", "learn", "курс", "учить", "оқу", "сабақ"];

  if (deadlineWords.some((w) => lower.includes(w))) {
    if (!urgent) return `${name}, ${L.nothingUrgent} ${p.grade}${L.nothingUrgent2}`;
    return `⏰ ${name}, ${L.urgentPre} **${urgent.title}** — ${daysUntil(urgent.deadline)} ${L.daysLeft} ${urgent.deadline}). ${L.urgentMatch} ${urgent.direction}. ${L.addSaved}`;
  }

  if (courseWords.some((w) => lower.includes(w))) {
    return `${L.coursePre} (${p.interests.join(", ")})${L.courseBody}`;
  }

  const lines = topMatches
    .map(
      (o, i) =>
        `${i + 1}. **${o.title}** (${o.direction}) — ${L.closes} ${o.deadline}. ${o.prize ? "🏆 " + o.prize : ""}`,
    )
    .join("\n");

  return `${name}! ${L.roadmapPre} ${p.grade}${L.roadmapMid}\n\n${lines}\n\n${L.strategy}`;
}
