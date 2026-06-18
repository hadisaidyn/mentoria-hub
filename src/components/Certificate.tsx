"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Award, Download, X } from "lucide-react";
import { useStore, celebrate } from "@/lib/store";
import { useT } from "@/lib/i18n";
import type { Course } from "@/lib/types";

export function CertificateButton({ course }: { course: Course }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          celebrate();
        }}
        className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600"
      >
        <Award className="h-4 w-4" /> {t("player.certBtn")}
      </button>
      {open && <CertificateModal course={course} onClose={() => setOpen(false)} />}
    </>
  );
}

function CertificateModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const { profile } = useStore();
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const name = profile?.name || "Mentoria Student";
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const download = async () => {
    if (!ref.current) return;
    setBusy(true);
    try {
      const url = await toPng(ref.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.href = url;
      a.download = `Mentoria-Certificate-${course.id}.png`;
      a.click();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[55] grid place-items-center overflow-y-auto bg-slate-900/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Certificate canvas */}
        <div
          ref={ref}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white p-10 text-center shadow-2xl ring-1 ring-slate-200"
        >
          <div className="pointer-events-none absolute inset-0 grad-mesh opacity-60" />
          <div className="absolute inset-3 rounded-xl border-2 border-brand-200" />
          <div className="relative">
            <div className="flex items-center justify-center gap-2 text-brand-700">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-bold text-white">
                M
              </span>
              <span className="text-lg font-bold tracking-tight">Mentoria Hub</span>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {t("player.certTitle")}
            </p>
            <p className="mt-5 text-sm text-slate-500">{t("cert.certifies")}</p>
            <p className="mt-1 font-serif text-4xl font-bold text-slate-900">{name}</p>
            <p className="mt-4 text-sm text-slate-500">{t("cert.completedCourse")}</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-brand-700">{course.title}</p>
            <p className="mx-auto mt-2 max-w-md text-xs text-slate-400">
              {course.lessons.length} {t("card.lessons")} · {t(`level.${course.level}`)} ·{" "}
              {t("cert.instructedBy")} {course.instructor}
            </p>
            <div className="mt-8 flex items-end justify-between px-6">
              <div className="text-left">
                <div className="h-px w-32 bg-slate-300" />
                <p className="mt-1 text-xs text-slate-500">{t("cert.date")} · {date}</p>
              </div>
              <Award className="h-12 w-12 text-amber-400" />
              <div className="text-right">
                <p className="font-serif text-lg italic text-slate-700">Mentoria</p>
                <div className="h-px w-32 bg-slate-300" />
                <p className="mt-1 text-xs text-slate-500">{t("cert.director")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={download}
            disabled={busy}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg hover:bg-slate-100 disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> {busy ? t("player.generating") : t("player.download")}
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/20"
          >
            <X className="h-4 w-4" /> {t("player.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
