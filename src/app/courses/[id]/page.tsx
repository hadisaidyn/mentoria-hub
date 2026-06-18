"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookText,
  CheckCircle2,
  ChevronRight,
  Circle,
  FileText,
  Award,
  Lock,
  PlayCircle,
  RotateCcw,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Badge, ProgressBar, cn, useCourseProgress } from "@/components/ui";
import { CertificateButton } from "@/components/Certificate";
import type { Lesson } from "@/lib/types";

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>();
  const { courses, completed } = useStore();
  const { t } = useT();
  const course = courses.find((c) => c.id === id);
  const done = completed[id] || [];

  const [activeId, setActiveId] = useState<string>(() => {
    const first = course?.lessons.find((l) => !((completed[id] || []).includes(l.id)));
    return first?.id || course?.lessons[0]?.id || "";
  });

  const prog = useCourseProgress(course || ({ id, lessons: [] } as never));

  if (!course) {
    return (
      <div className="container py-20 text-center">
        <p className="text-slate-500">404</p>
        <Link href="/courses" className="mt-4 inline-block font-semibold text-brand-600">
          ← {t("player.allCourses")}
        </Link>
      </div>
    );
  }

  const active = course.lessons.find((l) => l.id === activeId) || course.lessons[0];
  const activeIndex = course.lessons.findIndex((l) => l.id === active.id);

  return (
    <div className="container py-8">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> {t("player.allCourses")}
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* SYLLABUS */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className={`rounded-3xl bg-gradient-to-br ${course.accent} p-5 text-white`}>
            <Badge tone="slate" className="bg-white/90 text-slate-700">
              {t(`level.${course.level}`)}
            </Badge>
            <h1 className="mt-3 text-2xl font-bold leading-tight">{course.title}</h1>
            <p className="mt-1 text-sm text-white/80">{course.instructor}</p>
            <div className="mt-4 rounded-2xl bg-white/15 p-3 backdrop-blur">
              <div className="mb-1.5 flex justify-between text-xs font-medium">
                <span>{t("player.courseProgress")}</span>
                <span>{prog.pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/30">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${prog.pct}%` }}
                />
              </div>
            </div>
          </div>

          <nav className="mt-4 space-y-1.5">
            {course.lessons.map((l, i) => {
              const isDone = done.includes(l.id);
              const isActive = l.id === active.id;
              return (
                <button
                  key={l.id}
                  onClick={() => setActiveId(l.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition",
                    isActive
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                      : "border-slate-200 bg-white hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900",
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate text-sm font-medium",
                        isActive ? "text-brand-700 dark:text-brand-300" : "text-slate-800 dark:text-slate-200",
                      )}
                    >
                      {i + 1}. {l.title}
                    </p>
                    <p className="text-xs text-slate-400">{l.duration}</p>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 text-brand-500" />}
                </button>
              );
            })}

            {/* certificate node */}
            <div
              className={cn(
                "rounded-2xl border border-dashed p-3",
                prog.pct === 100
                  ? "border-amber-400 bg-amber-50 dark:bg-amber-500/10"
                  : "border-slate-200 dark:border-slate-800",
              )}
            >
              <div className="flex items-center gap-3">
                {prog.pct === 100 ? (
                  <Award className="h-5 w-5 text-amber-500" />
                ) : (
                  <Lock className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                )}
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {prog.pct === 100 ? t("player.certEarned") : t("player.certTitle")}
                </p>
              </div>
              {prog.pct === 100 && (
                <div className="mt-3">
                  <CertificateButton course={course} />
                </div>
              )}
            </div>
          </nav>
        </aside>

        {/* MAIN PANEL */}
        <section>
          <LessonPanel
            key={active.id}
            courseId={course.id}
            lesson={active}
            index={activeIndex}
            total={course.lessons.length}
            isDone={done.includes(active.id)}
            onNext={() => {
              const next = course.lessons[activeIndex + 1];
              if (next) setActiveId(next.id);
            }}
            hasNext={activeIndex < course.lessons.length - 1}
          />
        </section>
      </div>
    </div>
  );
}

function LessonPanel({
  courseId,
  lesson,
  index,
  total,
  isDone,
  onNext,
  hasNext,
}: {
  courseId: string;
  lesson: Lesson;
  index: number;
  total: number;
  isDone: boolean;
  onNext: () => void;
  hasNext: boolean;
}) {
  const { completeLesson } = useStore();
  const { t } = useT();
  const [tab, setTab] = useState<"notes" | "resources" | "quiz">("notes");

  return (
    <div>
      {/* Video placeholder */}
      <div className="relative grid aspect-video place-items-center overflow-hidden rounded-3xl bg-slate-900 text-white">
        <div className="grad-mesh absolute inset-0 opacity-40" />
        <div className="relative text-center">
          <button className="grid h-16 w-16 place-items-center rounded-full bg-white/15 backdrop-blur transition hover:scale-110">
            <PlayCircle className="h-10 w-10" />
          </button>
          <p className="mt-3 text-sm text-white/70">{lesson.videoLabel}</p>
          <p className="text-xs text-white/40">{t("player.videoPh")} · {lesson.duration}</p>
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium backdrop-blur">
          {t("player.lesson")} {index + 1} / {total}
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{lesson.title}</h2>
        {isDone && <Badge tone="emerald">{t("player.completed")}</Badge>}
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { k: "notes", label: t("player.tabNotes"), icon: BookText },
          { k: "resources", label: t("player.tabMaterials"), icon: FileText },
          { k: "quiz", label: t("player.tabQuiz"), icon: Award },
        ].map((tb) => (
          <button
            key={tb.k}
            onClick={() => setTab(tb.k as typeof tab)}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition",
              tab === tb.k
                ? "border-brand-600 text-brand-700 dark:text-brand-300"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200",
            )}
          >
            <tb.icon className="h-4 w-4" /> {tb.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "notes" && (
          <ul className="space-y-3">
            {lesson.notes.map((n, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                <span dangerouslySetInnerHTML={{ __html: bold(n) }} />
              </li>
            ))}
          </ul>
        )}

        {tab === "resources" && (
          <div className="space-y-2.5">
            {lesson.resources.map((r, i) => (
              <a
                key={i}
                href={r.href}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 transition hover:border-brand-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <FileText className="h-5 w-5 text-brand-500" />
                {r.label}
                <ChevronRight className="ml-auto h-4 w-4 text-slate-400" />
              </a>
            ))}
          </div>
        )}

        {tab === "quiz" && (
          <Quiz courseId={courseId} lesson={lesson} onComplete={() => completeLesson(courseId, lesson.id)} />
        )}
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
        <button
          onClick={() => completeLesson(courseId, lesson.id)}
          disabled={isDone}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
            isDone
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900",
          )}
        >
          <CheckCircle2 className="h-4 w-4" /> {isDone ? t("player.marked") : t("player.markComplete")}
        </button>
        {hasNext && (
          <button
            onClick={onNext}
            className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {t("player.nextLesson")} <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function Quiz({
  courseId,
  lesson,
  onComplete,
}: {
  courseId: string;
  lesson: Lesson;
  onComplete: () => void;
}) {
  const { recordQuiz } = useStore();
  const { t } = useT();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    const correct = lesson.quiz.filter((q, i) => answers[i] === q.answer).length;
    return Math.round((correct / lesson.quiz.length) * 100);
  }, [answers, lesson.quiz]);

  const allAnswered = Object.keys(answers).length === lesson.quiz.length;

  const submit = () => {
    setSubmitted(true);
    recordQuiz(lesson.id, score);
    if (score >= 50) onComplete();
  };

  const retry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-4">
      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "rounded-2xl p-4 text-center",
            score >= 50
              ? "bg-emerald-50 dark:bg-emerald-500/10"
              : "bg-rose-50 dark:bg-rose-500/10",
          )}
        >
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{score}%</p>
          <p className={score >= 50 ? "text-emerald-600" : "text-rose-600"}>
            {score >= 50 ? t("player.passed") : t("player.failed")}
          </p>
        </motion.div>
      )}

      {lesson.quiz.map((q, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="font-medium text-slate-900 dark:text-white">
            {i + 1}. {q.q}
          </p>
          <div className="mt-3 grid gap-2">
            {q.options.map((opt, j) => {
              const picked = answers[i] === j;
              const correct = j === q.answer;
              let state = "idle";
              if (submitted) {
                if (correct) state = "correct";
                else if (picked) state = "wrong";
              } else if (picked) state = "picked";
              return (
                <button
                  key={j}
                  disabled={submitted}
                  onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm transition",
                    state === "idle" &&
                      "border-slate-200 hover:border-brand-400 dark:border-slate-700",
                    state === "picked" && "border-brand-600 bg-brand-50 dark:bg-brand-500/10",
                    state === "correct" &&
                      "border-emerald-500 bg-emerald-50 font-medium dark:bg-emerald-500/10",
                    state === "wrong" && "border-rose-400 bg-rose-50 dark:bg-rose-500/10",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-xs",
                      state === "correct" && "border-emerald-500 bg-emerald-500 text-white",
                      state === "wrong" && "border-rose-400 bg-rose-400 text-white",
                      (state === "idle" || state === "picked") && "border-slate-300",
                    )}
                  >
                    {String.fromCharCode(65 + j)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && q.explain && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">💡 {q.explain}</p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={submit}
          disabled={!allAnswered}
          className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {allAnswered ? t("player.submit") : t("player.answerAll")}
        </button>
      ) : (
        <button
          onClick={retry}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 hover:border-brand-400 dark:border-slate-700 dark:text-slate-200"
        >
          <RotateCcw className="h-4 w-4" /> {t("player.retake")}
        </button>
      )}
    </div>
  );
}

function bold(s: string) {
  return s.replace(/\*\*([^*]+)\*\*/g, "<strong class='font-semibold text-slate-900 dark:text-white'>$1</strong>");
}
