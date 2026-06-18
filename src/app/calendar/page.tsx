"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, CalendarPlus, ExternalLink } from "lucide-react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Badge, cn } from "@/components/ui";
import { daysUntil } from "@/lib/recommend";
import { downloadIcs } from "@/lib/ics";
import type { Opportunity } from "@/lib/types";

const LOCALES: Record<string, string> = { en: "en-GB", ru: "ru-RU", kk: "kk-KZ" };
// A reference week starting Monday (2024-01-01 was a Monday) for weekday labels.
const DOW_REF = [1, 2, 3, 4, 5, 6, 7];

export default function CalendarPage() {
  const { opportunities, saved } = useStore();
  const { t, lang } = useT();
  const locale = LOCALES[lang] || "en-GB";
  const DOW = DOW_REF.map((d) =>
    new Date(2024, 0, d).toLocaleDateString(locale, { weekday: "short" }),
  );
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<string | null>(null);
  const [savedOnly, setSavedOnly] = useState(false);

  const list = savedOnly ? opportunities.filter((o) => saved.includes(o.id)) : opportunities;

  // map "YYYY-MM-DD" -> opportunities
  const byDay = useMemo(() => {
    const m: Record<string, Opportunity[]> = {};
    list.forEach((o) => {
      (m[o.deadline] ||= []).push(o);
    });
    return m;
  }, [list]);

  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const key = (d: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const shift = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
    setSelected(null);
  };

  const selectedOpps = selected ? byDay[selected] || [] : [];

  return (
    <div className="container py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge tone="brand">
            <CalendarDays className="h-3.5 w-3.5" /> {t("cal.badge")}
          </Badge>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{t("cal.title")}</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">{t("cal.subtitle")}</p>
        </div>
        <button
          onClick={() => setSavedOnly((v) => !v)}
          className={cn(
            "rounded-xl border px-4 py-2 text-sm font-medium transition",
            savedOnly ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 dark:border-slate-700",
          )}
        >
          {savedOnly ? t("cal.savedOnly") : t("cal.showAll")}
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Calendar */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold capitalize text-slate-900 dark:text-white">
              {new Date(year, month, 1).toLocaleDateString(locale, {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex gap-1">
              <button onClick={() => shift(-1)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => shift(1)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400">
            {DOW.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const k = key(d);
              const opps = byDay[k] || [];
              const isToday = k === todayKey;
              const isSel = k === selected;
              const urgent = opps.some((o) => daysUntil(o.deadline) <= 14 && daysUntil(o.deadline) >= 0);
              return (
                <button
                  key={i}
                  onClick={() => setSelected(opps.length ? k : null)}
                  className={cn(
                    "relative grid aspect-square place-items-center rounded-xl text-sm transition",
                    isSel
                      ? "bg-brand-600 text-white"
                      : opps.length
                        ? "bg-brand-50 font-semibold text-brand-700 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-300"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                    isToday && !isSel && "ring-2 ring-inset ring-slate-300 dark:ring-slate-600",
                  )}
                >
                  {d}
                  {opps.length > 0 && (
                    <span
                      className={cn(
                        "absolute bottom-1 h-1.5 w-1.5 rounded-full",
                        isSel ? "bg-white" : urgent ? "bg-rose-500" : "bg-brand-500",
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-bold capitalize text-slate-900 dark:text-white">
            {selected
              ? new Date(selected + "T00:00:00").toLocaleDateString(locale, { day: "numeric", month: "long" })
              : t("cal.selectDate")}
          </h3>
          {selectedOpps.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              {selected ? t("cal.nothingDue") : t("cal.clickDate")}
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {selectedOpps.map((o) => (
                <div key={o.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <Badge>{t(`dir.${o.direction}`)}</Badge>
                  <p className="mt-1.5 font-semibold text-slate-900 dark:text-white">{o.title}</p>
                  <p className="text-xs text-slate-500">{o.organizer}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <a
                      href={o.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400"
                    >
                      {t("common.apply")} <ExternalLink className="h-3 w-3" />
                    </a>
                    <button
                      onClick={() => downloadIcs(o)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400"
                    >
                      <CalendarPlus className="h-3.5 w-3.5" /> {t("common.addToCalendar")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link
            href="/catalog"
            className="mt-4 block text-center text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            {t("cal.browseCatalog")}
          </Link>
        </div>
      </div>
    </div>
  );
}
