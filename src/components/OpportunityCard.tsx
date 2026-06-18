"use client";

import { motion } from "framer-motion";
import { Bookmark, Clock, ExternalLink, MapPin, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { daysUntil, formatDeadline, scoreOpportunity } from "@/lib/recommend";
import type { Opportunity } from "@/lib/types";
import { Badge, cn } from "./ui";

function MatchRing({ value, label }: { value: number; label: string }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const tone = value >= 70 ? "#10b981" : value >= 40 ? "#f59e0b" : "#94a3b8";
  return (
    <div className="relative grid h-9 w-9 shrink-0 place-items-center" title={label}>
      <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (value / 100) * c}
        />
      </svg>
      <span className="absolute text-[9px] font-bold text-slate-700 dark:text-slate-200">
        {value}
      </span>
    </div>
  );
}

const dirTone: Record<string, "brand" | "emerald" | "amber" | "rose" | "slate"> = {
  STEM: "brand",
  Business: "amber",
  Programming: "brand",
  Science: "emerald",
  Humanities: "rose",
  Finance: "emerald",
  "Social Impact": "rose",
};

export function OpportunityCard({ o, index = 0 }: { o: Opportunity; index?: number }) {
  const { saved, applied, toggleSave, toggleApplied, profile } = useStore();
  const { t } = useT();
  const isSaved = saved.includes(o.id);
  const isApplied = applied.includes(o.id);
  const match = profile ? scoreOpportunity(o, profile) : null;
  const days = daysUntil(o.deadline);
  const closed = days < 0;
  const urgent = days >= 0 && days <= 14;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-600/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge tone={dirTone[o.direction] || "brand"}>{t(`dir.${o.direction}`)}</Badge>
          <Badge tone="slate">{t(`type.${o.type}`)}</Badge>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {match !== null && match > 0 && (
            <MatchRing value={match} label={`${match}% ${t("card.match")}`} />
          )}
          <button
            onClick={() => toggleSave(o.id)}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-xl border transition",
              isSaved
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-200 text-slate-400 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700",
            )}
            aria-label="Save"
          >
            <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
          </button>
        </div>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-900 dark:text-white">
        {o.title}
      </h3>
      <p className="text-sm font-medium text-brand-600 dark:text-brand-400">{o.organizer}</p>

      <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600 dark:text-slate-400">
        {o.description}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" /> {t(`fmt.${o.format}`)}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> {t("card.grades")} {Math.min(...o.grades)}–
          {Math.max(...o.grades)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
        <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Clock className="h-3.5 w-3.5" /> {formatDeadline(o.deadline)}
        </span>
        <span
          className={cn(
            "text-xs font-semibold",
            closed
              ? "text-slate-400"
              : urgent
                ? "text-rose-600 dark:text-rose-400"
                : "text-emerald-600 dark:text-emerald-400",
          )}
        >
          {closed ? t("card.closed") : days === 0 ? t("card.lastDay") : `${days} ${t("card.daysLeft")}`}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => toggleApplied(o.id)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
            isApplied
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "bg-brand-600 text-white hover:bg-brand-700",
          )}
        >
          {isApplied ? t("common.applied") : t("common.apply")}
        </button>
        <a
          href={o.applyUrl}
          target="_blank"
          rel="noreferrer"
          className="grid h-[42px] w-[42px] place-items-center rounded-xl border border-slate-200 text-slate-500 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700"
          aria-label="Open external link"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </motion.article>
  );
}
