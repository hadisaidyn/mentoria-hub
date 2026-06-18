"use client";

import { useMemo } from "react";
import { Radar } from "lucide-react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import type { Direction } from "@/lib/types";

const DIRS: Direction[] = [
  "STEM",
  "Business",
  "Programming",
  "Science",
  "Humanities",
  "Finance",
  "Social Impact",
];

export function SkillsRadar() {
  const { profile, saved, applied, opportunities, courses, completed } = useStore();
  const { t } = useT();

  const data = useMemo(() => {
    const raw = DIRS.map((d) => {
      let s = 0;
      if (profile?.interests.includes(d)) s += 3;
      s += opportunities.filter((o) => o.direction === d && saved.includes(o.id)).length;
      s += opportunities.filter((o) => o.direction === d && applied.includes(o.id)).length * 2;
      s += courses.filter((c) => c.direction === d && (completed[c.id]?.length ?? 0) > 0).length * 2;
      return s;
    });
    const max = Math.max(1, ...raw);
    return raw.map((v) => 0.12 + 0.88 * (v / max)); // 0.12 floor so the shape is always visible
  }, [profile, saved, applied, opportunities, courses, completed]);

  const cx = 150;
  const cy = 130;
  const R = 92;
  const angle = (i: number) => (-90 + i * (360 / DIRS.length)) * (Math.PI / 180);
  const pt = (i: number, r: number) => [cx + Math.cos(angle(i)) * r, cy + Math.sin(angle(i)) * r];

  const poly = data.map((v, i) => pt(i, v * R).join(",")).join(" ");

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
        <Radar className="h-5 w-5 text-brand-500" /> {t("radar.title")}
      </h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t("radar.sub")}</p>
      <svg viewBox="0 0 300 250" className="mx-auto mt-2 w-full max-w-[320px]">
        {/* grid rings */}
        {[0.33, 0.66, 1].map((ring) => (
          <polygon
            key={ring}
            points={DIRS.map((_, i) => pt(i, ring * R).join(",")).join(" ")}
            fill="none"
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth="1"
          />
        ))}
        {/* axes */}
        {DIRS.map((_, i) => {
          const [x, y] = pt(i, R);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />;
        })}
        {/* data polygon */}
        <polygon points={poly} fill="rgba(99,102,241,0.25)" className="stroke-brand-500" strokeWidth="2" />
        {data.map((v, i) => {
          const [x, y] = pt(i, v * R);
          return <circle key={i} cx={x} cy={y} r="3" className="fill-brand-600" />;
        })}
        {/* labels */}
        {DIRS.map((d, i) => {
          const [x, y] = pt(i, R + 18);
          return (
            <text
              key={d}
              x={x}
              y={y}
              textAnchor={x > cx + 5 ? "start" : x < cx - 5 ? "end" : "middle"}
              dominantBaseline="middle"
              className="fill-slate-500 text-[9px] font-medium dark:fill-slate-400"
            >
              {t(`dir.${d}`)}
            </text>
          );
        })}
      </svg>
    </section>
  );
}
