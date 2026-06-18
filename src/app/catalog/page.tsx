"use client";

import { useMemo, useState } from "react";
import { Bookmark, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { OpportunityCard } from "@/components/OpportunityCard";
import { daysUntil, scoreOpportunity } from "@/lib/recommend";
import type { Direction, Format } from "@/lib/types";
import { cn } from "@/components/ui";

const DIRECTIONS: (Direction | "All")[] = [
  "All",
  "STEM",
  "Business",
  "Programming",
  "Science",
  "Humanities",
  "Finance",
  "Social Impact",
];
const FORMATS: (Format | "All")[] = ["All", "Online", "Hybrid", "In-person"];
const GRADES: ("All" | number)[] = ["All", 8, 9, 10, 11];

export default function CatalogPage() {
  const { opportunities, profile, saved } = useStore();
  const { t } = useT();
  const [q, setQ] = useState("");
  const [dir, setDir] = useState<Direction | "All">("All");
  const [fmt, setFmt] = useState<Format | "All">("All");
  const [grade, setGrade] = useState<"All" | number>("All");
  const [savedOnly, setSavedOnly] = useState(false);
  const [sort, setSort] = useState<"match" | "deadline">(profile ? "match" : "deadline");

  const filtered = useMemo(() => {
    let list = opportunities.filter((o) => {
      if (dir !== "All" && o.direction !== dir) return false;
      if (fmt !== "All" && o.format !== fmt) return false;
      if (grade !== "All" && !o.grades.includes(grade)) return false;
      if (savedOnly && !saved.includes(o.id)) return false;
      if (q.trim()) {
        const hay = (o.title + o.organizer + o.description + o.tags.join(" ")).toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
    if (sort === "deadline")
      list = [...list].sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline));
    else
      list = [...list].sort(
        (a, b) => scoreOpportunity(b, profile) - scoreOpportunity(a, profile),
      );
    return list;
  }, [opportunities, dir, fmt, grade, savedOnly, q, sort, saved, profile]);

  const reset = () => {
    setQ("");
    setDir("All");
    setFmt("All");
    setGrade("All");
    setSavedOnly(false);
  };

  return (
    <div className="container py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {t("cat.title")}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          {opportunities.length} {t("cat.subtitle")}
        </p>
      </header>

      {/* Search + sort bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("common.search")}
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none ring-brand-500/30 focus:ring-2 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSavedOnly((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition",
              savedOnly
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-300 dark:border-slate-700",
            )}
          >
            <Bookmark className={cn("h-4 w-4", savedOnly && "fill-current")} /> {t("cat.savedBtn")}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "match" | "deadline")}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="match">{t("cat.sortMatch")}</option>
            <option value="deadline">{t("cat.sortDeadline")}</option>
          </select>
        </div>
      </div>

      {/* Filter chips */}
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
        <SlidersHorizontal className="h-4 w-4" /> {t("cat.filters")}
      </div>
      <div className="space-y-2.5">
        <ChipRow
          value={dir}
          onChange={setDir}
          options={DIRECTIONS}
          render={(o) => (o === "All" ? t("common.all") : t(`dir.${o}`))}
        />
        <div className="flex flex-wrap gap-2">
          {GRADES.map((g) => (
            <Chip key={g} active={grade === g} onClick={() => setGrade(g)}>
              {g === "All" ? t("cat.allGrades") : `${t("dash.grade")} ${g}`}
            </Chip>
          ))}
          <span className="mx-1 self-center text-slate-300 dark:text-slate-700">|</span>
          {FORMATS.map((f) => (
            <Chip key={f} active={fmt === f} onClick={() => setFmt(f)}>
              {f === "All" ? t("common.all") : t(`fmt.${f}`)}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mb-6 mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <Filter className="mr-1 inline h-3.5 w-3.5" />
          {filtered.length} {t("cat.results")}
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600"
        >
          <X className="h-3.5 w-3.5" /> {t("common.clear")}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 py-20 text-center text-slate-500 dark:border-slate-700">
          {t("cat.empty")}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o, i) => (
            <OpportunityCard key={o.id} o={o} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-brand-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
      )}
    >
      {children}
    </button>
  );
}

function ChipRow<T extends string>({
  value,
  onChange,
  options,
  render,
}: {
  value: T;
  onChange: (v: T) => void;
  options: T[];
  render?: (v: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Chip key={o} active={value === o} onClick={() => onChange(o)}>
          {render ? render(o) : o}
        </Chip>
      ))}
    </div>
  );
}
