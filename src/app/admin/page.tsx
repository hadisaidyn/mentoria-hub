"use client";

import { useState } from "react";
import {
  BarChart3,
  Compass,
  Edit3,
  GraduationCap,
  Layers,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Badge, cn } from "@/components/ui";
import type { Course, Direction, Format, Lesson, Opportunity, OppType } from "@/lib/types";

const DIRECTIONS: Direction[] = [
  "STEM",
  "Business",
  "Programming",
  "Science",
  "Humanities",
  "Finance",
  "Social Impact",
];
const TYPES: OppType[] = [
  "Olympiad",
  "Competition",
  "Scholarship",
  "Summer School",
  "Internship",
  "Research",
  "Hackathon",
  "Volunteering",
];
const FORMATS: Format[] = ["Online", "Hybrid", "In-person"];

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) +
  "-" +
  Math.random().toString(36).slice(2, 6);

const MOCK_USERS = [
  { name: "Dana K.", grade: 11, joined: "2026-05-02", xp: 1240 },
  { name: "Arman T.", grade: 10, joined: "2026-05-11", xp: 980 },
  { name: "Madina S.", grade: 11, joined: "2026-05-18", xp: 870 },
  { name: "Bekzat O.", grade: 9, joined: "2026-06-01", xp: 640 },
];

type Tab = "overview" | "opps" | "courses";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const { t } = useT();

  return (
    <div className="container py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge tone="slate">{t("admin.badge")}</Badge>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {t("admin.title")}
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">{t("admin.subtitle")}</p>
        </div>
      </header>

      <div className="mb-6 inline-flex rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        {(
          [
            { k: "overview", label: t("admin.overview"), icon: BarChart3 },
            { k: "opps", label: t("admin.opportunities"), icon: Compass },
            { k: "courses", label: t("admin.courses"), icon: GraduationCap },
          ] as const
        ).map((tb) => (
          <button
            key={tb.k}
            onClick={() => setTab(tb.k)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition",
              tab === tb.k
                ? "bg-brand-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
            )}
          >
            <tb.icon className="h-4 w-4" /> {tb.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <Overview />}
      {tab === "opps" && <OppsAdmin />}
      {tab === "courses" && <CoursesAdmin />}
    </div>
  );
}

function Overview() {
  const { opportunities, courses } = useStore();
  const { t } = useT();
  const lessons = courses.reduce((n, c) => n + c.lessons.length, 0);
  const byDir = DIRECTIONS.map((d) => ({
    d,
    n: opportunities.filter((o) => o.direction === d).length,
  })).filter((x) => x.n > 0);
  const max = Math.max(1, ...byDir.map((x) => x.n));

  const cards = [
    { label: t("admin.opportunities"), value: opportunities.length, icon: Compass, tone: "from-brand-500 to-brand-700" },
    { label: t("admin.courses"), value: courses.length, icon: GraduationCap, tone: "from-emerald-500 to-teal-600" },
    { label: t("admin.statLessons"), value: lessons, icon: Layers, tone: "from-amber-500 to-orange-600" },
    { label: t("admin.statStudents"), value: MOCK_USERS.length + 1, icon: Users, tone: "from-rose-500 to-pink-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-3xl bg-gradient-to-br ${c.tone} p-5 text-white`}
          >
            <c.icon className="h-6 w-6 opacity-80" />
            <div className="mt-3 text-3xl font-bold">{c.value}</div>
            <div className="text-sm text-white/80">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-bold text-slate-900 dark:text-white">{t("admin.byDirection")}</h3>
          <div className="mt-4 space-y-3">
            {byDir.map((x) => (
              <div key={x.d}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{t(`dir.${x.d}`)}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{x.n}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${(x.n / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-bold text-slate-900 dark:text-white">{t("admin.recentStudents")}</h3>
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {MOCK_USERS.map((u) => (
              <div key={u.name} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{u.name}</p>
                  <p className="text-xs text-slate-500">
                    {t("dash.grade")} {u.grade} · {t("admin.joined")} {u.joined}
                  </p>
                </div>
                <Badge tone="amber">{u.xp} XP</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const EMPTY_OPP: Opportunity = {
  id: "",
  title: "",
  organizer: "",
  type: "Competition",
  direction: "STEM",
  format: "Online",
  location: "",
  deadline: "2026-12-31",
  grades: [10, 11],
  description: "",
  eligibility: "",
  prize: "",
  tags: [],
  applyUrl: "#",
};

function OppsAdmin() {
  const { opportunities, upsertOpportunity, deleteOpportunity } = useStore();
  const { t } = useT();
  const [editing, setEditing] = useState<Opportunity | null>(null);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setEditing({ ...EMPTY_OPP })}
          className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> {t("admin.newOpp")}
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {opportunities.map((o) => (
          <div
            key={o.id}
            className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0 dark:border-slate-800"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-900 dark:text-white">{o.title}</p>
              <p className="text-xs text-slate-500">
                {t(`dir.${o.direction}`)} · {t(`type.${o.type}`)} · {o.deadline}
              </p>
            </div>
            <Badge tone="slate">{t(`fmt.${o.format}`)}</Badge>
            <button
              onClick={() => setEditing(o)}
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => deleteOpportunity(o.id)}
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <OppForm
          value={editing}
          onClose={() => setEditing(null)}
          onSave={(o) => {
            upsertOpportunity({ ...o, id: o.id || slug(o.title) });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function OppForm({
  value,
  onSave,
  onClose,
}: {
  value: Opportunity;
  onSave: (o: Opportunity) => void;
  onClose: () => void;
}) {
  const [f, setF] = useState<Opportunity>(value);
  const { t } = useT();
  const set = (patch: Partial<Opportunity>) => setF((p) => ({ ...p, ...patch }));

  return (
    <Modal onClose={onClose} title={value.id ? t("admin.editOpp") : t("admin.newOpp")}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t("admin.fTitle")} className="sm:col-span-2">
          <input className={inp} value={f.title} onChange={(e) => set({ title: e.target.value })} />
        </Field>
        <Field label={t("admin.fOrganizer")}>
          <input className={inp} value={f.organizer} onChange={(e) => set({ organizer: e.target.value })} />
        </Field>
        <Field label={t("admin.fLocation")}>
          <input className={inp} value={f.location} onChange={(e) => set({ location: e.target.value })} />
        </Field>
        <Field label={t("admin.fType")}>
          <select className={inp} value={f.type} onChange={(e) => set({ type: e.target.value as OppType })}>
            {TYPES.map((x) => <option key={x} value={x}>{t(`type.${x}`)}</option>)}
          </select>
        </Field>
        <Field label={t("admin.fDirection")}>
          <select className={inp} value={f.direction} onChange={(e) => set({ direction: e.target.value as Direction })}>
            {DIRECTIONS.map((d) => <option key={d} value={d}>{t(`dir.${d}`)}</option>)}
          </select>
        </Field>
        <Field label={t("admin.fFormat")}>
          <select className={inp} value={f.format} onChange={(e) => set({ format: e.target.value as Format })}>
            {FORMATS.map((x) => <option key={x} value={x}>{t(`fmt.${x}`)}</option>)}
          </select>
        </Field>
        <Field label={t("admin.fDeadline")}>
          <input type="date" className={inp} value={f.deadline} onChange={(e) => set({ deadline: e.target.value })} />
        </Field>
        <Field label={t("admin.fGrades")} className="sm:col-span-2">
          <div className="flex gap-2">
            {[8, 9, 10, 11].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() =>
                  set({
                    grades: f.grades.includes(g)
                      ? f.grades.filter((x) => x !== g)
                      : [...f.grades, g].sort(),
                  })
                }
                className={cn(
                  "h-10 flex-1 rounded-xl border text-sm font-semibold",
                  f.grades.includes(g)
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-300 dark:border-slate-700",
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </Field>
        <Field label={t("admin.fDescription")} className="sm:col-span-2">
          <textarea className={inp} rows={3} value={f.description} onChange={(e) => set({ description: e.target.value })} />
        </Field>
        <Field label={t("admin.fEligibility")}>
          <input className={inp} value={f.eligibility} onChange={(e) => set({ eligibility: e.target.value })} />
        </Field>
        <Field label={t("admin.fPrize")}>
          <input className={inp} value={f.prize} onChange={(e) => set({ prize: e.target.value })} />
        </Field>
        <Field label={t("admin.fTags")} className="sm:col-span-2">
          <input
            className={inp}
            value={f.tags.join(", ")}
            onChange={(e) => set({ tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
          />
        </Field>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className={btnGhost}>{t("common.cancel")}</button>
        <button onClick={() => onSave(f)} disabled={!f.title.trim()} className={btnPrimary}>
          {value.id ? t("admin.saveChanges") : t("admin.publish")}
        </button>
      </div>
    </Modal>
  );
}

const EMPTY_COURSE: Omit<Course, "id" | "lessons"> = {
  title: "",
  subject: "",
  level: "Beginner",
  direction: "STEM",
  description: "",
  instructor: "",
  hours: 4,
  accent: "from-indigo-500 to-violet-600",
  tags: [],
};

function CoursesAdmin() {
  const { courses, upsertCourse, deleteCourse, addLesson } = useStore();
  const { t } = useT();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [lessonFor, setLessonFor] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> {t("admin.newCourse")}
        </button>
      </div>

      <div className="space-y-3">
        {courses.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${c.accent}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900 dark:text-white">{c.title}</p>
                <p className="text-xs text-slate-500">
                  {t(`level.${c.level}`)} · {c.lessons.length} {t("card.lessons")} · {c.subject}
                </p>
              </div>
              <button
                onClick={() => setLessonFor(c.id)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-400 dark:border-slate-700 dark:text-slate-300"
              >
                <Plus className="h-3.5 w-3.5" /> {t("admin.lessonBtn")}
              </button>
              <button
                onClick={() => setEditing(c)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => deleteCourse(c.id)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {lessonFor === c.id && (
              <LessonForm
                onClose={() => setLessonFor(null)}
                onSave={(l) => {
                  addLesson(c.id, l);
                  setLessonFor(null);
                }}
              />
            )}
          </div>
        ))}
      </div>

      {(adding || editing) && (
        <CourseForm
          value={editing}
          onClose={() => {
            setAdding(false);
            setEditing(null);
          }}
          onSave={(c) => {
            upsertCourse(c);
            setAdding(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function CourseForm({
  value,
  onSave,
  onClose,
}: {
  value?: Course | null;
  onSave: (c: Course) => void;
  onClose: () => void;
}) {
  const [f, setF] = useState(value ? { ...value } : { ...EMPTY_COURSE });
  const { t } = useT();
  const set = (p: Partial<typeof f>) => setF((s) => ({ ...s, ...p }));
  const accents = [
    "from-indigo-500 to-violet-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-orange-500",
    "from-sky-500 to-blue-600",
    "from-amber-500 to-orange-600",
  ];

  return (
    <Modal onClose={onClose} title={value ? t("admin.editCourse") : t("admin.newCourse")}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t("admin.fTitle")} className="sm:col-span-2">
          <input className={inp} value={f.title} onChange={(e) => set({ title: e.target.value })} />
        </Field>
        <Field label={t("admin.fSubject")}>
          <input className={inp} value={f.subject} onChange={(e) => set({ subject: e.target.value })} />
        </Field>
        <Field label={t("admin.fInstructor")}>
          <input className={inp} value={f.instructor} onChange={(e) => set({ instructor: e.target.value })} />
        </Field>
        <Field label={t("admin.fLevel")}>
          <select className={inp} value={f.level} onChange={(e) => set({ level: e.target.value as Course["level"] })}>
            {["Beginner", "Intermediate", "Advanced"].map((l) => (
              <option key={l} value={l}>{t(`level.${l}`)}</option>
            ))}
          </select>
        </Field>
        <Field label={t("admin.fDirection")}>
          <select className={inp} value={f.direction} onChange={(e) => set({ direction: e.target.value as Direction })}>
            {DIRECTIONS.map((d) => <option key={d} value={d}>{t(`dir.${d}`)}</option>)}
          </select>
        </Field>
        <Field label={t("admin.fHours")}>
          <input type="number" className={inp} value={f.hours} onChange={(e) => set({ hours: Number(e.target.value) })} />
        </Field>
        <Field label={t("admin.fAccent")}>
          <div className="flex gap-2">
            {accents.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => set({ accent: a })}
                className={cn(
                  "h-9 w-9 rounded-lg bg-gradient-to-br",
                  a,
                  f.accent === a && "ring-2 ring-offset-2 ring-brand-600 dark:ring-offset-slate-900",
                )}
              />
            ))}
          </div>
        </Field>
        <Field label={t("admin.fDescription")} className="sm:col-span-2">
          <textarea className={inp} rows={3} value={f.description} onChange={(e) => set({ description: e.target.value })} />
        </Field>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className={btnGhost}>{t("common.cancel")}</button>
        <button
          onClick={() =>
            onSave(
              value
                ? ({ ...value, ...f } as Course)
                : ({ ...f, id: slug(f.title), lessons: [] } as Course),
            )
          }
          disabled={!f.title.trim()}
          className={btnPrimary}
        >
          {value ? t("admin.saveChanges") : t("admin.publishCourse")}
        </button>
      </div>
    </Modal>
  );
}

function LessonForm({ onSave, onClose }: { onSave: (l: Lesson) => void; onClose: () => void }) {
  const { t } = useT();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("10 min");
  const [notes, setNotes] = useState("");

  return (
    <div className="mt-3 rounded-2xl border border-dashed border-brand-300 bg-brand-50/50 p-4 dark:border-brand-700 dark:bg-brand-500/5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t("admin.fLessonTitle")}>
          <input className={inp} value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label={t("admin.fDuration")}>
          <input className={inp} value={duration} onChange={(e) => setDuration(e.target.value)} />
        </Field>
        <Field label={t("admin.fNotes")} className="sm:col-span-2">
          <textarea className={inp} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button onClick={onClose} className={btnGhost}>{t("common.cancel")}</button>
        <button
          disabled={!title.trim()}
          onClick={() =>
            onSave({
              id: slug(title),
              title,
              duration,
              videoLabel: title,
              notes: notes.split("\n").map((n) => n.trim()).filter(Boolean),
              resources: [],
              quiz: [
                {
                  q: `Quick check: did you finish "${title}"?`,
                  options: ["Yes, completed", "Not yet"],
                  answer: 0,
                },
              ],
            })
          }
          className={btnPrimary}
        >
          {t("admin.addLesson")}
        </button>
      </div>
    </div>
  );
}

/* ---------- shared form primitives ---------- */
const inp =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-brand-500/30 focus:ring-2 dark:border-slate-700 dark:bg-slate-800";
const btnPrimary =
  "rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40";
const btnGhost =
  "rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-start overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm sm:place-items-center"
      onClick={onClose}
    >
      <div
        className="my-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
