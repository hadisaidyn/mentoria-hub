"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlarmClock,
  Bookmark,
  Flame,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { openOnboarding } from "@/components/Navbar";
import { Badge, ProgressBar, Stat, cn, useCourseProgress } from "@/components/ui";
import { Achievements } from "@/components/Achievements";
import { SkillsRadar } from "@/components/SkillsRadar";
import { daysUntil, formatDeadline, recommendedOpportunities } from "@/lib/recommend";
import type { Course } from "@/lib/types";

export default function Dashboard() {
  const store = useStore();
  const { profile, courses, opportunities, saved, applied, xp, streak, telegram, completed } =
    store;
  const { t } = useT();

  if (!profile) {
    return (
      <div className="container py-24 text-center">
        <Sparkles className="mx-auto h-10 w-10 text-brand-500" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          {t("dash.gateTitle")}
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-slate-500">{t("dash.gateSub")}</p>
        <button
          onClick={openOnboarding}
          className="mt-6 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          {t("dash.getStarted")}
        </button>
      </div>
    );
  }

  const level = Math.floor(xp / 200) + 1;
  const levelProgress = ((xp % 200) / 200) * 100;

  const enrolled = courses.filter((c) => (completed[c.id]?.length ?? 0) > 0);
  const savedOpps = opportunities.filter((o) => saved.includes(o.id));
  const upcoming = [...opportunities]
    .filter((o) => daysUntil(o.deadline) >= 0 && (saved.includes(o.id) || o.grades.includes(profile.grade)))
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
    .slice(0, 5);
  const recs = recommendedOpportunities(opportunities, profile)
    .filter((o) => !saved.includes(o.id) && daysUntil(o.deadline) >= 0)
    .slice(0, 3);

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            {t("dash.greeting")}, {profile.name.split(" ")[0]} 👋
          </p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t("dash.grade")} {profile.grade} · {t(`country.${profile.country}`)}
          </h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.interests.map((i) => (
              <Badge key={i}>{t(`dir.${i}`)}</Badge>
            ))}
          </div>
        </div>
        <button
          onClick={openOnboarding}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-brand-400 dark:border-slate-700 dark:text-slate-300"
        >
          {t("nav.editProfile")}
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white">
          <div className="flex items-center gap-2 text-white/80">
            <Trophy className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              {t("dash.level")} {level}
            </span>
          </div>
          <div className="mt-1 text-2xl font-bold">{xp} XP</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white" style={{ width: `${levelProgress}%` }} />
          </div>
          <p className="mt-1 text-xs text-white/70">
            {200 - (xp % 200)} {t("dash.xpToNext")} {level + 1}
          </p>
        </div>
        <Stat label={t("dash.streak")} value={`${streak} 🔥`} icon={<Flame className="h-4 w-4" />} />
        <Stat label={t("dash.applied")} value={applied.length} icon={<Target className="h-4 w-4" />} />
        <Stat label={t("dash.savedStat")} value={saved.length} icon={<Bookmark className="h-4 w-4" />} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          {/* Continue learning */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
              {t("dash.continue")}
            </h2>
            {enrolled.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                <p className="text-slate-500">{t("dash.noCourse")}</p>
                <Link
                  href="/courses"
                  className="mt-3 inline-block font-semibold text-brand-600 dark:text-brand-400"
                >
                  {t("dash.browseCourses")}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {enrolled.map((c) => (
                  <ContinueRow key={c.id} c={c} />
                ))}
              </div>
            )}
          </section>

          {/* Saved opportunities */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
              {t("dash.savedTitle")}
            </h2>
            {savedOpps.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                <p className="text-slate-500">{t("dash.nothingSaved")}</p>
                <Link
                  href="/catalog"
                  className="mt-3 inline-block font-semibold text-brand-600 dark:text-brand-400"
                >
                  {t("dash.explore")}
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {savedOpps.map((o) => (
                  <div
                    key={o.id}
                    className="group relative rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <button
                      onClick={() => store.toggleSave(o.id)}
                      className="absolute right-3 top-3 text-slate-300 hover:text-rose-500"
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <Badge>{t(`dir.${o.direction}`)}</Badge>
                    <p className="mt-2 pr-5 font-semibold text-slate-900 dark:text-white">
                      {o.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDeadline(o.deadline)} · {daysUntil(o.deadline)} {t("card.daysLeft")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recommended */}
          {recs.length > 0 && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                <Sparkles className="h-5 w-5 text-brand-500" /> {t("common.recommended")}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {recs.map((o) => (
                  <Link
                    key={o.id}
                    href="/catalog"
                    className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-400 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex justify-between">
                      <Badge tone="emerald">{t(`type.${o.type}`)}</Badge>
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">{o.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{t("dash.matches")}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <SkillsRadar />
          <Achievements />
          {/* Urgent deadlines */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <AlarmClock className="h-5 w-5 text-rose-500" /> {t("dash.deadlines")}
            </h3>
            <div className="mt-4 space-y-3">
              {upcoming.map((o) => {
                const d = daysUntil(o.deadline);
                return (
                  <div key={o.id} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-bold",
                        d <= 14
                          ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800",
                      )}
                    >
                      {d}d
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                        {o.title}
                      </p>
                      <p className="text-xs text-slate-400">{formatDeadline(o.deadline)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Telegram link */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Send className="h-5 w-5 text-sky-500" /> {t("dash.telegramTitle")}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("dash.telegramDesc")}</p>
            <button
              onClick={store.linkTelegram}
              className={cn(
                "mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition",
                telegram
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : "bg-sky-500 text-white hover:bg-sky-600",
              )}
            >
              <Send className="h-4 w-4" />
              {telegram ? t("dash.telegramLinked") : t("dash.telegramLink")}
            </button>
          </section>

          <Link
            href="/essay-review"
            className="flex items-center gap-3 rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-4 transition hover:border-brand-400 dark:border-brand-800 dark:from-brand-500/10 dark:to-slate-900"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
              ✍️
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{t("essay.title")}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("essay.subtitle")}</p>
            </div>
          </Link>

          <button
            onClick={store.resetAll}
            className="w-full rounded-xl border border-slate-200 py-2.5 text-xs font-medium text-slate-400 hover:text-rose-500 dark:border-slate-800"
          >
            {t("dash.reset")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContinueRow({ c }: { c: Course }) {
  const { pct, done, total } = useCourseProgress(c);
  const { t } = useT();
  return (
    <Link
      href={`/courses/${c.id}`}
      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-400 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${c.accent} text-lg font-bold text-white`}>
        {pct}%
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900 dark:text-white">{c.title}</p>
        <p className="mb-1.5 text-xs text-slate-500">
          {done}/{total} {t("dash.lessons")} · {pct === 100 ? t("card.completed") : t("dash.inProgress")}
        </p>
        <ProgressBar value={pct} />
      </div>
    </Link>
  );
}
