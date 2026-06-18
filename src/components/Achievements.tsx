"use client";

import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { cn } from "./ui";

export function Achievements() {
  const { achievements } = useStore();
  const { t } = useT();
  const earned = achievements.length;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white">{t("ach.title")}</h3>
        <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
          {earned}/{ACHIEVEMENTS.length}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = achievements.includes(a.id);
          const title = t(`ach.${a.id}.t`);
          const desc = t(`ach.${a.id}.d`);
          return (
            <div
              key={a.id}
              title={`${title} — ${desc}`}
              className={cn(
                "group relative grid aspect-square place-items-center rounded-2xl border text-2xl transition",
                unlocked
                  ? "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10"
                  : "border-slate-200 bg-slate-50 opacity-40 grayscale dark:border-slate-800 dark:bg-slate-800/40",
              )}
            >
              {a.emoji}
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden w-32 -translate-x-1/2 rounded-lg bg-slate-900 px-2 py-1 text-center text-[10px] font-medium text-white group-hover:block">
                {title}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
