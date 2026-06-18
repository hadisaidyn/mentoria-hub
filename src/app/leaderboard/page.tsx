"use client";

import { useMemo } from "react";
import { Crown, Flame, Medal, Trophy } from "lucide-react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Badge, cn } from "@/components/ui";

const MOCK = [
  { name: "Dana K.", grade: 11, xp: 1240, streak: 22, country: "🇰🇿" },
  { name: "Arman T.", grade: 10, xp: 980, streak: 14, country: "🇰🇿" },
  { name: "Madina S.", grade: 11, xp: 870, streak: 9, country: "🇰🇿" },
  { name: "Bekzat O.", grade: 9, xp: 640, streak: 7, country: "🇰🇿" },
  { name: "Aigerim N.", grade: 10, xp: 520, streak: 5, country: "🇺🇿" },
  { name: "Yerlan M.", grade: 11, xp: 410, streak: 4, country: "🇰🇿" },
  { name: "Sofia R.", grade: 9, xp: 300, streak: 3, country: "🇰🇬" },
  { name: "Timur A.", grade: 10, xp: 180, streak: 2, country: "🇰🇿" },
];

export default function Leaderboard() {
  const { profile, xp, streak } = useStore();
  const { t } = useT();

  const rows = useMemo(() => {
    const me = profile
      ? [{ name: profile.name, grade: profile.grade, xp, streak, country: "⭐", me: true }]
      : [];
    return [...MOCK, ...me].sort((a, b) => b.xp - a.xp);
  }, [profile, xp, streak]);

  const myRank = rows.findIndex((r) => (r as { me?: boolean }).me) + 1;

  return (
    <div className="container py-10">
      <header className="mb-8 text-center">
        <Badge tone="amber">
          <Trophy className="h-3.5 w-3.5" /> {t("lead.badge")}
        </Badge>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{t("lead.title")}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{t("lead.subtitle")}</p>
        {profile && myRank > 0 && (
          <p className="mt-3 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
            {t("lead.rankedPre")} #{myRank} · {xp} XP
          </p>
        )}
      </header>

      {/* Podium */}
      <div className="mb-8 grid grid-cols-3 items-end gap-3">
        {[1, 0, 2].map((order) => {
          const r = rows[order];
          if (!r) return <div key={order} />;
          const isMe = (r as { me?: boolean }).me;
          const heights = ["h-28", "h-36", "h-24"];
          const place = order;
          return (
            <div key={order} className="flex flex-col items-center">
              <div
                className={cn(
                  "mb-2 grid h-14 w-14 place-items-center rounded-full text-lg font-bold",
                  place === 0 && "bg-amber-100 text-amber-700 ring-4 ring-amber-300",
                  place === 1 && "bg-slate-100 text-slate-700 ring-4 ring-slate-300",
                  place === 2 && "bg-orange-100 text-orange-700 ring-4 ring-orange-300",
                )}
              >
                {place === 0 ? <Crown className="h-6 w-6" /> : place + 1}
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {r.name.split(" ")[0]} {isMe && `(${t("lead.you")})`}
              </p>
              <p className="text-xs text-slate-500">{r.xp} XP</p>
              <div
                className={cn(
                  "mt-2 w-full rounded-t-2xl bg-gradient-to-b",
                  heights[place],
                  place === 0 && "from-amber-400 to-amber-500",
                  place === 1 && "from-slate-300 to-slate-400",
                  place === 2 && "from-orange-300 to-orange-400",
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {rows.map((r, i) => {
          const isMe = (r as { me?: boolean }).me;
          return (
            <div
              key={i}
              className={cn(
                "flex items-center gap-4 border-b border-slate-100 px-5 py-3.5 last:border-0 dark:border-slate-800",
                isMe && "bg-brand-50 dark:bg-brand-500/10",
              )}
            >
              <span className="w-6 text-center text-sm font-bold text-slate-400">{i + 1}</span>
              <span className="text-xl">{r.country}</span>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {r.name} {isMe && <span className="text-brand-600">· {t("lead.you")}</span>}
                </p>
                <p className="text-xs text-slate-500">{t("dash.grade")} {r.grade}</p>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-rose-500">
                <Flame className="h-4 w-4" /> {r.streak}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                {i < 3 && <Medal className="h-4 w-4 text-amber-500" />}
                {r.xp} XP
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
