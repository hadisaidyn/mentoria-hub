"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Flag, MapPin } from "lucide-react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Badge, ProgressBar, cn } from "@/components/ui";

interface Milestone {
  grade: number;
  title: string;
  tone: "brand" | "emerald" | "amber" | "rose";
  items: { id: string; label: string }[];
}

const ROADMAP: Milestone[] = [
  {
    grade: 9,
    title: "Explore & Build Foundations",
    tone: "brand",
    items: [
      { id: "g9-1", label: "Identify 2–3 core interests (STEM, Business, Humanities…)" },
      { id: "g9-2", label: "Join a club or start a passion project" },
      { id: "g9-3", label: "Enter a beginner olympiad or hackathon" },
      { id: "g9-4", label: "Build a daily English reading habit" },
      { id: "g9-5", label: "Take an intro async course on Mentoria Hub" },
    ],
  },
  {
    grade: 10,
    title: "Deepen & Compete",
    tone: "emerald",
    items: [
      { id: "g10-1", label: "Commit to 1 flagship competition in your field" },
      { id: "g10-2", label: "Begin SAT/IELTS diagnostic + study plan" },
      { id: "g10-3", label: "Apply to a summer school or research program" },
      { id: "g10-4", label: "Start a measurable social-impact initiative" },
      { id: "g10-5", label: "Collect achievements into a portfolio doc" },
    ],
  },
  {
    grade: 11,
    title: "Specialize & Lead",
    tone: "amber",
    items: [
      { id: "g11-1", label: "Take the SAT/IELTS officially (first sitting)" },
      { id: "g11-2", label: "Lead a project or hold a leadership role" },
      { id: "g11-3", label: "Win or place in a national/international competition" },
      { id: "g11-4", label: "Request recommendation letters early" },
      { id: "g11-5", label: "Shortlist target universities & scholarships" },
    ],
  },
  {
    grade: 12,
    title: "Apply & Launch",
    tone: "rose",
    items: [
      { id: "g12-1", label: "Finalize personal statement & essays" },
      { id: "g12-2", label: "Retake SAT/IELTS if needed (higher score)" },
      { id: "g12-3", label: "Submit university & scholarship applications" },
      { id: "g12-4", label: "Prepare for interviews" },
      { id: "g12-5", label: "Apply to capstone internships/research" },
    ],
  },
];

function useChecks() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      setChecks(JSON.parse(localStorage.getItem("mentoria-roadmap") || "{}"));
    } catch {}
  }, []);
  const toggle = (id: string) =>
    setChecks((c) => {
      const next = { ...c, [id]: !c[id] };
      localStorage.setItem("mentoria-roadmap", JSON.stringify(next));
      return next;
    });
  return { checks, toggle };
}

export default function RoadmapPage() {
  const { profile } = useStore();
  const { t } = useT();
  const { checks, toggle } = useChecks();

  const total = ROADMAP.reduce((n, m) => n + m.items.length, 0);
  const doneCount = Object.values(checks).filter(Boolean).length;

  return (
    <div className="container py-10">
      <header className="mb-8 max-w-2xl">
        <Badge tone="brand">
          <MapPin className="h-3.5 w-3.5" /> {t("road.badge")}
        </Badge>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{t("road.title")}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{t("road.subtitle")}</p>
        <div className="mt-4 max-w-xs">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-slate-500">{t("road.overall")}</span>
            <span className="font-semibold text-brand-600 dark:text-brand-400">
              {doneCount}/{total}
            </span>
          </div>
          <ProgressBar value={(doneCount / total) * 100} />
        </div>
      </header>

      <div className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 md:before:left-1/2">
        {ROADMAP.map((m, idx) => {
          const here = profile?.grade === m.grade;
          const done = m.items.filter((it) => checks[it.id]).length;
          return (
            <motion.div
              key={m.grade}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                "relative md:grid md:grid-cols-2 md:gap-8",
                idx % 2 === 1 && "md:[direction:rtl]",
              )}
            >
              {/* node */}
              <span
                className={cn(
                  "absolute left-2.5 top-2 z-10 grid h-9 w-9 place-items-center rounded-full border-4 border-white text-sm font-bold text-white dark:border-slate-950 md:left-1/2 md:-translate-x-1/2",
                  toneBg[m.tone],
                )}
              >
                {m.grade}
              </span>

              <div className={cn("pl-14 md:pl-0 [direction:ltr]", idx % 2 === 0 && "md:pr-12 md:text-right", idx % 2 === 1 && "md:col-start-2 md:pl-12")}>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className={cn("flex items-center gap-2", idx % 2 === 0 && "md:justify-end")}>
                    {here && <Badge tone="emerald">{t("road.youAreHere")}</Badge>}
                    <Badge tone={m.tone}>{t("dash.grade")} {m.grade}</Badge>
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                    {t(`road.t${m.grade}`)}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {done}/{m.items.length} {t("road.completed")}
                  </p>
                  <ul className="mt-4 space-y-2 text-left [direction:ltr]">
                    {m.items.map((it) => {
                      const on = checks[it.id];
                      return (
                        <li key={it.id}>
                          <button
                            onClick={() => toggle(it.id)}
                            className="flex w-full items-start gap-2.5 rounded-xl p-2 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            {on ? (
                              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                            ) : (
                              <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600" />
                            )}
                            <span
                              className={cn(
                                on
                                  ? "text-slate-400 line-through"
                                  : "text-slate-700 dark:text-slate-200",
                              )}
                            >
                              {t(`road.${it.id}`)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}

        <div className="relative pl-14 md:grid md:grid-cols-2 md:pl-0">
          <span className="absolute left-2.5 top-2 z-10 grid h-9 w-9 place-items-center rounded-full border-4 border-white bg-slate-900 text-white dark:border-slate-950 dark:bg-white dark:text-slate-900 md:left-1/2 md:-translate-x-1/2">
            <Flag className="h-4 w-4" />
          </span>
          <div className="md:col-start-2 md:pl-12">
            <p className="pt-2 text-lg font-bold text-slate-900 dark:text-white">{t("road.end")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const toneBg: Record<string, string> = {
  brand: "bg-brand-600",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};
