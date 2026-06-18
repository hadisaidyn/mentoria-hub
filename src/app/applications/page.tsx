"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Layers, X } from "lucide-react";
import { useStore, STAGES, type Stage } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Badge, cn } from "@/components/ui";
import { daysUntil, formatDeadline } from "@/lib/recommend";
import type { Opportunity } from "@/lib/types";

const COL_TONE: Record<Stage, string> = {
  interested: "border-slate-300 dark:border-slate-700",
  applying: "border-amber-300 dark:border-amber-500/40",
  submitted: "border-brand-300 dark:border-brand-500/40",
  accepted: "border-emerald-300 dark:border-emerald-500/40",
};
const DOT: Record<Stage, string> = {
  interested: "bg-slate-400",
  applying: "bg-amber-500",
  submitted: "bg-brand-500",
  accepted: "bg-emerald-500",
};

export default function ApplicationsPage() {
  const { opportunities, saved, stages, setStage, toggleSave } = useStore();
  const { t } = useT();
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<Stage | null>(null);

  const tracked = useMemo(
    () => opportunities.filter((o) => saved.includes(o.id) || stages[o.id]),
    [opportunities, saved, stages],
  );
  const stageOf = (id: string): Stage => (stages[id] as Stage) || "interested";

  const move = (id: string, dir: -1 | 1) => {
    const i = STAGES.indexOf(stageOf(id));
    const next = STAGES[Math.min(STAGES.length - 1, Math.max(0, i + dir))];
    setStage(id, next);
  };
  const remove = (id: string) => {
    if (saved.includes(id)) toggleSave(id);
    setStage(id, null);
  };

  return (
    <div className="container py-10">
      <header className="mb-6">
        <Badge tone="brand">
          <Layers className="h-3.5 w-3.5" /> Kanban
        </Badge>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{t("app.title")}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{t("app.subtitle")}</p>
      </header>

      {tracked.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
          <p className="text-slate-500">{t("app.empty")}</p>
          <Link href="/catalog" className="mt-3 inline-block font-semibold text-brand-600 dark:text-brand-400">
            {t("app.browse")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STAGES.map((col) => {
            const items = tracked.filter((o) => stageOf(o.id) === col);
            return (
              <div
                key={col}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(col);
                }}
                onDragLeave={() => setOver((c) => (c === col ? null : c))}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragId) setStage(dragId, col);
                  setDragId(null);
                  setOver(null);
                }}
                className={cn(
                  "rounded-3xl border-2 bg-slate-50/60 p-3 transition dark:bg-slate-900/40",
                  COL_TONE[col],
                  over === col && "ring-2 ring-brand-400",
                )}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <span className={cn("h-2 w-2 rounded-full", DOT[col])} />
                    {t(`app.col.${col}`)}
                  </span>
                  <span className="rounded-full bg-white px-2 text-xs font-medium text-slate-500 dark:bg-slate-800">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {items.map((o) => (
                    <Card
                      key={o.id}
                      o={o}
                      col={col}
                      onDragStart={() => setDragId(o.id)}
                      onMove={move}
                      onRemove={remove}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Card({
  o,
  col,
  onDragStart,
  onMove,
  onRemove,
  t,
}: {
  o: Opportunity;
  col: Stage;
  onDragStart: () => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onRemove: (id: string) => void;
  t: (k: string) => string;
}) {
  const d = daysUntil(o.deadline);
  const idx = STAGES.indexOf(col);
  return (
    <article
      draggable
      onDragStart={onDragStart}
      className="group cursor-grab rounded-2xl border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-2">
        <Badge tone="slate">{t(`dir.${o.direction}`)}</Badge>
        <button
          onClick={() => onRemove(o.id)}
          className="text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-rose-500"
          aria-label="Remove"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-1.5 text-sm font-semibold leading-snug text-slate-900 dark:text-white">{o.title}</p>
      <p className="mt-1 text-xs text-slate-500">
        {formatDeadline(o.deadline)}
        {d >= 0 && (
          <span className={cn("ml-1 font-medium", d <= 14 ? "text-rose-500" : "text-emerald-600")}>
            · {d} {t("card.daysLeft")}
          </span>
        )}
      </p>
      <div className="mt-2.5 flex justify-between">
        <button
          onClick={() => onMove(o.id, -1)}
          disabled={idx === 0}
          className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-brand-400 disabled:opacity-30 dark:border-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onMove(o.id, 1)}
          disabled={idx === STAGES.length - 1}
          className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-brand-400 disabled:opacity-30 dark:border-slate-700"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
