"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Check,
  Code2,
  FlaskConical,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Microscope,
  Rocket,
  Target,
  Trophy,
  Wand2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import type { Direction, Goal, Profile } from "@/lib/types";
import { cn } from "./ui";

const INTERESTS: { key: Direction; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "STEM", icon: Rocket },
  { key: "Business", icon: Briefcase },
  { key: "Programming", icon: Code2 },
  { key: "Science", icon: Microscope },
  { key: "Humanities", icon: GraduationCap },
  { key: "Finance", icon: Landmark },
  { key: "Social Impact", icon: HeartHandshake },
];

const GOALS: { key: Goal; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "University Admission", icon: GraduationCap },
  { key: "Skill Building", icon: Wand2 },
  { key: "Competitions", icon: Trophy },
  { key: "Scholarships", icon: FlaskConical },
];

export function OnboardingModal() {
  const { profile, completeOnboarding, onboarded, hydrated } = useStore();
  const { t } = useT();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Profile>({
    name: "",
    grade: 10,
    country: "Kazakhstan",
    interests: [],
    goals: [],
  });

  // open via global event / auto-open for new users
  useEffect(() => {
    const handler = () => {
      if (profile) setDraft(profile);
      setStep(0);
      setOpen(true);
    };
    window.addEventListener("open-onboarding", handler);
    return () => window.removeEventListener("open-onboarding", handler);
  }, [profile]);

  useEffect(() => {
    if (hydrated && !onboarded) {
      const id = setTimeout(() => setOpen(true), 700);
      return () => clearTimeout(id);
    }
  }, [hydrated, onboarded]);

  const toggle = <T,>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const canNext =
    (step === 0 && draft.name.trim().length > 1) ||
    (step === 1 && draft.interests.length > 0) ||
    step === 2;

  const finish = () => {
    completeOnboarding(draft);
    setOpen(false);
    // Send the student straight to their personalized dashboard.
    if (pathname !== "/dashboard") router.push("/dashboard");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            initial={{ scale: 0.95, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grad-mesh px-6 pb-4 pt-6">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-white/60 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                <Wand2 className="h-5 w-5" />
                <span className="text-sm font-semibold">{t("onb.title")}</span>
              </div>
              <div className="mt-3 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      i <= step ? "bg-brand-600" : "bg-slate-200 dark:bg-slate-700",
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="px-6 py-6">
              {step === 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl">{t("onb.basics")}</h3>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      {t("onb.name")}
                    </label>
                    <input
                      autoFocus
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      placeholder={t("onb.namePh")}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none ring-brand-500/30 focus:ring-2 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        {t("onb.grade")}
                      </label>
                      <div className="flex gap-2">
                        {[8, 9, 10, 11].map((g) => (
                          <button
                            key={g}
                            onClick={() => setDraft({ ...draft, grade: g })}
                            className={cn(
                              "h-10 flex-1 rounded-xl border text-sm font-semibold transition",
                              draft.grade === g
                                ? "border-brand-600 bg-brand-600 text-white"
                                : "border-slate-300 hover:border-brand-400 dark:border-slate-700",
                            )}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        {t("onb.country")}
                      </label>
                      <select
                        value={draft.country}
                        onChange={(e) => setDraft({ ...draft, country: e.target.value })}
                        className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
                      >
                        {["Kazakhstan", "Uzbekistan", "Kyrgyzstan", "Russia", "Other"].map(
                          (c) => (
                            <option key={c} value={c}>
                              {t(`country.${c}`)}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl">{t("onb.interestsTitle")}</h3>
                  <p className="-mt-2 text-sm text-slate-500">{t("onb.interestsHint")}</p>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {INTERESTS.map((it) => {
                      const on = draft.interests.includes(it.key);
                      return (
                        <button
                          key={it.key}
                          onClick={() =>
                            setDraft({ ...draft, interests: toggle(draft.interests, it.key) })
                          }
                          className={cn(
                            "flex flex-col items-start gap-2 rounded-2xl border p-3 text-left text-sm font-medium transition",
                            on
                              ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                              : "border-slate-200 hover:border-brand-300 dark:border-slate-700",
                          )}
                        >
                          <it.icon className="h-5 w-5" />
                          {t(`dir.${it.key}`)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xl">{t("onb.goalsTitle")}</h3>
                  <div className="grid gap-2.5">
                    {GOALS.map((g) => {
                      const on = draft.goals.includes(g.key);
                      return (
                        <button
                          key={g.key}
                          onClick={() => setDraft({ ...draft, goals: toggle(draft.goals, g.key) })}
                          className={cn(
                            "flex items-center gap-3 rounded-2xl border p-3.5 text-left text-sm font-medium transition",
                            on
                              ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                              : "border-slate-200 hover:border-brand-300 dark:border-slate-700",
                          )}
                        >
                          <span
                            className={cn(
                              "grid h-9 w-9 place-items-center rounded-xl",
                              on ? "bg-brand-600 text-white" : "bg-slate-100 dark:bg-slate-800",
                            )}
                          >
                            <g.icon className="h-5 w-5" />
                          </span>
                          <span className="flex-1">{t(`goal.${g.key}`)}</span>
                          {on && <Check className="h-5 w-5 text-brand-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
              <button
                onClick={() => (step === 0 ? setOpen(false) : setStep(step - 1))}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {step === 0 ? t("common.cancel") : t("common.back")}
              </button>
              {step < 2 ? (
                <button
                  disabled={!canNext}
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("common.next")}
                </button>
              ) : (
                <button
                  onClick={finish}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
                >
                  <Target className="h-4 w-4" /> {t("onb.finish")}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
