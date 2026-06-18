"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CalendarClock,
  Compass,
  GraduationCap,
  LayoutDashboard,
  Library,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { openOnboarding } from "@/components/Navbar";
import { OpportunityCard } from "@/components/OpportunityCard";
import { CourseCard } from "@/components/CourseCard";
import { recommendedOpportunities } from "@/lib/recommend";
import { Reveal } from "@/components/ui";

export default function Home() {
  const { opportunities, courses, profile } = useStore();
  const { t } = useT();
  const featured = recommendedOpportunities(opportunities, profile).slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="grad-mesh relative overflow-hidden">
        <div className="container grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-sm font-medium text-brand-700 dark:border-brand-800 dark:bg-slate-900/70 dark:text-brand-300"
            >
              <Sparkles className="h-4 w-4" /> {t("hero.badge")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-5 text-4xl font-bold leading-[1.1] text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
            >
              {t("hero.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-300"
            >
              {t("hero.sub")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/catalog"
                className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700"
              >
                <Compass className="h-5 w-5" /> {t("cta.findOpps")}
              </Link>
              <Link
                href="/courses"
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:border-brand-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <GraduationCap className="h-5 w-5" /> {t("cta.startLearning")}
              </Link>
              <button
                onClick={openOnboarding}
                className="flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-brand-700 transition hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-500/10"
              >
                {t("cta.join")} <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
              {[
                { n: "120+", l: t("home.statOpps") },
                { n: "12", l: t("home.statCourses") },
                { n: "3", l: t("home.statLangs") },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.n}</p>
                  <p>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero card stack */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400">
                <Bot className="h-4 w-4" /> AI Counselor
              </div>
              <p className="mt-2 rounded-2xl rounded-tl-sm bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Based on your <strong>Business</strong> interest & grade 11, prioritize the{" "}
                <strong>Wharton Investment Competition</strong> — closes June 29! 🎯
              </p>
              <div className="mt-4 space-y-2.5">
                {[
                  { icon: CalendarClock, t: "NASA Space Apps — 28 Sep", c: "text-emerald-500" },
                  { icon: Trophy, t: "+50 XP · Applied to UNICEF", c: "text-amber-500" },
                  { icon: TrendingUp, t: "SAT Math · 66% complete", c: "text-brand-500" },
                ].map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.12 }}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 dark:border-slate-800"
                  >
                    <r.icon className={`h-5 w-5 ${r.c}`} />
                    <span className="text-sm text-slate-700 dark:text-slate-200">{r.t}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl bg-gradient-to-br from-brand-400 to-brand-700 opacity-20 blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* VALUE / PROBLEM */}
      <section className="container py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t("home.value")}</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">{t("home.valueSub")}</p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: Compass, t: t("home.f1t"), d: t("home.f1d") },
            { icon: Library, t: t("home.f2t"), d: t("home.f2d") },
            { icon: Bot, t: t("home.f3t"), d: t("home.f3d") },
          ].map((f, i) => (
            <Reveal key={f.t} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {f.t}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="container">
          <Reveal>
            <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-white">
              {t("home.howTitle")}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              { icon: Sparkles, t: t("home.s1t"), d: t("home.s1d") },
              { icon: Target, t: t("home.s2t"), d: t("home.s2d") },
              { icon: GraduationCap, t: t("home.s3t"), d: t("home.s3d") },
              { icon: LayoutDashboard, t: t("home.s4t"), d: t("home.s4d") },
            ].map((s, i) => (
              <Reveal key={s.t} delay={i * 0.08}>
                <div className="relative rounded-3xl border border-slate-200 p-6 dark:border-slate-800">
                  <span className="absolute right-5 top-4 text-4xl font-bold text-slate-100 dark:text-slate-800">
                    {i + 1}
                  </span>
                  <s.icon className="h-7 w-7 text-brand-600 dark:text-brand-400" />
                  <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{s.t}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED OPPORTUNITIES */}
      <section className="container py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {profile ? t("common.recommended") : t("home.featured")}
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {profile
                ? `${t("home.featuredSubPre")} ${profile.grade} · ${profile.interests
                    .map((i) => t(`dir.${i}`))
                    .join(", ")}`
                : t("home.featuredSubGuest")}
            </p>
          </div>
          <Link
            href="/catalog"
            className="hidden items-center gap-1 font-semibold text-brand-600 hover:gap-2 dark:text-brand-400 sm:flex"
          >
            {t("common.viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((o, i) => (
            <OpportunityCard key={o.id} o={o} index={i} />
          ))}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="container pb-20">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t("home.popular")}</h2>
          <Link
            href="/courses"
            className="hidden items-center gap-1 font-semibold text-brand-600 hover:gap-2 dark:text-brand-400 sm:flex"
          >
            {t("common.viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((c, i) => (
            <CourseCard key={c.id} c={c} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="grad-mesh relative overflow-hidden rounded-3xl border border-brand-200 px-8 py-12 text-center dark:border-brand-800">
          <Users className="mx-auto h-10 w-10 text-brand-600 dark:text-brand-400" />
          <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
            {t("home.ctaTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-slate-600 dark:text-slate-300">
            {t("home.ctaSub")}
          </p>
          <button
            onClick={openOnboarding}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-700"
          >
            <Sparkles className="h-5 w-5" /> {t("cta.join")}
          </button>
        </div>
      </section>
    </div>
  );
}
