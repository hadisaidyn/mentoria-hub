"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, PlayCircle, Signal } from "lucide-react";
import type { Course } from "@/lib/types";
import { useT } from "@/lib/i18n";
import { Badge, ProgressBar, useCourseProgress } from "./ui";

export function CourseCard({ c, index = 0 }: { c: Course; index?: number }) {
  const { done, total, pct } = useCourseProgress(c);
  const { t } = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        href={`/courses/${c.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-600/5 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className={`relative h-32 bg-gradient-to-br ${c.accent} p-5`}>
          <div className="flex items-center justify-between">
            <Badge tone="slate" className="bg-white/90 text-slate-700 ring-white/50">
              <Signal className="h-3 w-3" /> {t(`level.${c.level}`)}
            </Badge>
            {pct > 0 && (
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-slate-700">
                {pct}%
              </span>
            )}
          </div>
          <PlayCircle className="absolute bottom-4 right-5 h-10 w-10 text-white/80 transition group-hover:scale-110" />
          <p className="absolute bottom-4 left-5 text-xs font-medium uppercase tracking-wide text-white/80">
            {c.subject}
          </p>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{c.title}</h3>
          <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-400">
            {c.description}
          </p>

          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> {c.lessons.length} {t("card.lessons")}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {c.hours}h
            </span>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>
                {done}/{total} {t("card.done")}
              </span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                {pct === 100 ? t("card.completed") : pct > 0 ? t("card.continue") : t("card.start")}
              </span>
            </div>
            <ProgressBar value={pct} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
