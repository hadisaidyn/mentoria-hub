"use client";

import Link from "next/link";
import { Compass, GraduationCap, Send } from "lucide-react";
import { useT } from "@/lib/i18n";

export function Footer() {
  const { t } = useT();
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              M
            </span>
            <span className="text-slate-900 dark:text-white">MentoriaHub</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            {t("footer.tagline")}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t("footer.explore")}
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li>
              <Link href="/catalog" className="hover:text-brand-600">
                {t("nav.catalog")}
              </Link>
            </li>
            <li>
              <Link href="/courses" className="hover:text-brand-600">
                {t("nav.courses")}
              </Link>
            </li>
            <li>
              <Link href="/roadmap" className="hover:text-brand-600">
                {t("footer.gradeRoadmap")}
              </Link>
            </li>
            <li>
              <Link href="/essay-review" className="hover:text-brand-600">
                {t("essay.title")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t("footer.platform")}
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li>
              <Link href="/dashboard" className="hover:text-brand-600">
                {t("footer.studentDashboard")}
              </Link>
            </li>
            <li>
              <Link href="/applications" className="hover:text-brand-600">
                {t("nav.applications")}
              </Link>
            </li>
            <li>
              <Link href="/leaderboard" className="hover:text-brand-600">
                {t("nav.leaderboard")}
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-brand-600">
                {t("footer.adminSuite")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Mentoria</h4>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {t("footer.mentoriaDesc")}
          </p>
          <div className="mt-3 flex gap-2 text-slate-400">
            <Send className="h-5 w-5" />
            <Compass className="h-5 w-5" />
            <GraduationCap className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-400 dark:border-slate-800">
        © 2026 Mentoria Hub · Hackathon MVP · Built for the Working MVP Challenge
      </div>
    </footer>
  );
}
