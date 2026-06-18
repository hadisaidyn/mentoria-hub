"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Compass,
  GraduationCap,
  LayoutDashboard,
  Map,
  Menu,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
  Trophy,
  X,
  Flame,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useT, LANGS } from "@/lib/i18n";
import { Badge, cn } from "./ui";
import { OnboardingModal } from "./OnboardingModal";

export function openOnboarding() {
  window.dispatchEvent(new Event("open-onboarding"));
}

const links = [
  { href: "/catalog", key: "nav.catalog", icon: Compass },
  { href: "/courses", key: "nav.courses", icon: GraduationCap },
  { href: "/dashboard", key: "nav.dashboard", icon: LayoutDashboard },
  { href: "/calendar", key: "nav.calendar", icon: CalendarDays },
  { href: "/roadmap", key: "nav.roadmap", icon: Map },
  { href: "/leaderboard", key: "nav.leaderboard", icon: Trophy },
  { href: "/admin", key: "nav.admin", icon: Settings },
];

export function Navbar() {
  const { theme, toggleTheme, lang, setLang, xp, streak, profile, hydrated } = useStore();
  const { t } = useT();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/80">
        <nav className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30">
              M
            </span>
            <span className="text-lg tracking-tight text-slate-900 dark:text-white">
              Mentoria<span className="text-brand-600 dark:text-brand-400">Hub</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                  )}
                >
                  <l.icon className="h-4 w-4" />
                  {t(l.key)}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {hydrated && profile && (
              <div className="hidden items-center gap-2 sm:flex">
                <Badge tone="amber" className="font-semibold">
                  <Sparkles className="h-3.5 w-3.5" /> {xp} XP
                </Badge>
                {streak > 0 && (
                  <Badge tone="rose" className="font-semibold">
                    <Flame className="h-3.5 w-3.5" /> {streak}
                  </Badge>
                )}
              </div>
            )}

            {/* command palette */}
            <button
              onClick={() => window.dispatchEvent(new Event("open-command"))}
              className="hidden items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-400 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 md:flex"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" />
              <kbd className="font-sans">⌘K</kbd>
            </button>

            {/* language */}
            <div className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                onBlur={() => setTimeout(() => setLangOpen(false), 150)}
                className="grid h-9 w-9 place-items-center rounded-lg text-base hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Language"
              >
                {LANGS.find((l) => l.code === lang)?.flag}
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onMouseDown={() => setLang(l.code)}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800",
                        lang === l.code && "font-semibold text-brand-600 dark:text-brand-400",
                      )}
                    >
                      <span>{l.flag}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={openOnboarding}
              className="hidden items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 sm:flex"
            >
              <Sparkles className="h-4 w-4" />
              {profile ? profile.name.split(" ")[0] : t("nav.personalize")}
            </button>

            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 xl:hidden"
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 xl:hidden">
            <div className="grid gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <l.icon className="h-4 w-4" /> {t(l.key)}
                </Link>
              ))}
              <button
                onClick={openOnboarding}
                className="mt-1 flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-semibold text-white"
              >
                <Sparkles className="h-4 w-4" /> {profile ? t("nav.editProfile") : t("nav.personalize")}
              </button>
            </div>
          </div>
        )}
      </header>
      <OnboardingModal />
    </>
  );
}
