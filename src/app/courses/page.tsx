"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { CourseCard } from "@/components/CourseCard";
import { Chip } from "@/components/Chip";
import type { Level } from "@/lib/types";

const LEVELS: ("All" | Level)[] = ["All", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const { courses } = useStore();
  const { t } = useT();
  const [level, setLevel] = useState<"All" | Level>("All");

  const filtered = useMemo(
    () => (level === "All" ? courses : courses.filter((c) => c.level === level)),
    [courses, level],
  );

  return (
    <div className="container py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t("courses.title")}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{t("courses.subtitle")}</p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
            {l === "All" ? t("common.all") : t(`level.${l}`)}
          </Chip>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c, i) => (
          <CourseCard key={c.id} c={c} index={i} />
        ))}
      </div>
    </div>
  );
}
