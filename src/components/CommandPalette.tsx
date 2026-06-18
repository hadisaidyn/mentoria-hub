"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Compass,
  CornerDownLeft,
  FileText,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Map,
  Search,
  Trophy,
  CalendarDays,
  Settings,
} from "lucide-react";
import { useStore } from "@/lib/store";

interface Item {
  id: string;
  label: string;
  hint: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
}

const PAGES: Item[] = [
  { id: "p-catalog", label: "Opportunities", hint: "Browse the catalog", href: "/catalog", icon: Compass, group: "Pages" },
  { id: "p-courses", label: "Courses", hint: "Async learning", href: "/courses", icon: GraduationCap, group: "Pages" },
  { id: "p-dash", label: "Dashboard", hint: "Your cabinet", href: "/dashboard", icon: LayoutDashboard, group: "Pages" },
  { id: "p-apps", label: "Applications", hint: "Track your pipeline", href: "/applications", icon: Layers, group: "Pages" },
  { id: "p-cal", label: "Calendar", hint: "Deadlines", href: "/calendar", icon: CalendarDays, group: "Pages" },
  { id: "p-essay", label: "Essay Reviewer", hint: "AI feedback on your essay", href: "/essay-review", icon: FileText, group: "Pages" },
  { id: "p-road", label: "Roadmap", hint: "Grade 9–12 plan", href: "/roadmap", icon: Map, group: "Pages" },
  { id: "p-lead", label: "Leaderboard", hint: "Rankings", href: "/leaderboard", icon: Trophy, group: "Pages" },
  { id: "p-admin", label: "Admin", hint: "Manage content", href: "/admin", icon: Settings, group: "Pages" },
];

export function CommandPalette() {
  const router = useRouter();
  const { opportunities, courses } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);

  const items: Item[] = useMemo(() => {
    const opps: Item[] = opportunities.map((o) => ({
      id: "o-" + o.id,
      label: o.title,
      hint: `${o.direction} · ${o.type}`,
      href: "/catalog",
      icon: Compass,
      group: "Opportunities",
    }));
    const crs: Item[] = courses.map((c) => ({
      id: "c-" + c.id,
      label: c.title,
      hint: `${c.level} · ${c.subject}`,
      href: `/courses/${c.id}`,
      icon: GraduationCap,
      group: "Courses",
    }));
    return [...PAGES, ...crs, ...opps];
  }, [opportunities, courses]);

  const filtered = useMemo(() => {
    if (!q.trim()) return items.slice(0, 9);
    const t = q.toLowerCase();
    return items.filter((i) => (i.label + i.hint).toLowerCase().includes(t)).slice(0, 12);
  }, [q, items]);

  useEffect(() => setCursor(0), [q, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const openEvt = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command", openEvt);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command", openEvt);
    };
  }, []);

  const go = (item: Item) => {
    setOpen(false);
    setQ("");
    router.push(item.href);
  };

  // group filtered for display
  const groups = filtered.reduce<Record<string, Item[]>>((acc, it) => {
    (acc[it.group] ||= []).push(it);
    return acc;
  }, {});
  const ordered = Object.values(groups).flat();

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, ordered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter" && ordered[cursor]) {
      go(ordered[cursor]);
    }
  };

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-900/50 p-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.97, y: -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onListKey}
                placeholder="Search opportunities, courses, pages…"
                className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-slate-400"
              />
              <kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 dark:border-slate-700">
                ESC
              </kbd>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-slate-400">No results.</p>
              )}
              {Object.entries(groups).map(([group, list]) => (
                <div key={group} className="mb-1">
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {group}
                  </p>
                  {list.map((it) => {
                    flatIndex++;
                    const active = flatIndex === cursor;
                    return (
                      <button
                        key={it.id}
                        onMouseEnter={() => setCursor(ordered.indexOf(it))}
                        onClick={() => go(it)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${
                          active ? "bg-brand-50 dark:bg-brand-500/10" : ""
                        }`}
                      >
                        <it.icon className={`h-4 w-4 ${active ? "text-brand-600" : "text-slate-400"}`} />
                        <span className="flex-1 truncate font-medium text-slate-800 dark:text-slate-100">
                          {it.label}
                        </span>
                        <span className="truncate text-xs text-slate-400">{it.hint}</span>
                        {active && <CornerDownLeft className="h-3.5 w-3.5 text-brand-500" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
