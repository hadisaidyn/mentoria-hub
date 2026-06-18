"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Info, Sparkles, Wand2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Badge, cn } from "@/components/ui";
import { Markdown } from "@/components/Markdown";

const CLICHES = [
  "passion",
  "since i was a child",
  "from a young age",
  "always been",
  "in conclusion",
  "i believe",
  "hardworking",
  "outside the box",
  "make a difference",
  "responsible for",
];

export default function EssayReviewPage() {
  const { t, lang } = useT();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [offline, setOffline] = useState<null | {
    overall: string;
    improve: string[];
  }>(null);

  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);

  function buildOffline() {
    const lower = text.toLowerCase();
    const found = CLICHES.filter((c) => lower.includes(c));
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
    const improve: string[] = [];
    if (words < 250) improve.push(t("essay.tipShort"));
    else if (words > 650) improve.push(t("essay.tipLong"));
    if (found.length) improve.push(`${t("essay.tipCliche")} "${found.slice(0, 4).join('", "')}".`);
    if (paragraphs < 2) improve.push(t("essay.tipParagraph"));
    if (/responsible for/i.test(text)) improve.push(t("essay.tipActive"));
    improve.push(t("essay.tipShow"));
    const overall =
      words >= 250 && words <= 650 ? t("essay.good") : words < 250 ? t("essay.tipShort") : t("essay.tipLong");
    setOffline({ overall, improve: Array.from(new Set(improve)).slice(0, 4) });
  }

  const review = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    setAiFeedback(null);
    setOffline(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "essay", lang, messages: [{ role: "user", content: text }] }),
      });
      const data = await res.json();
      if (res.ok && data.configured && data.reply) setAiFeedback(data.reply);
      else buildOffline();
    } catch {
      buildOffline();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container py-10">
      <header className="mb-6 max-w-2xl">
        <Badge tone="brand">
          <Wand2 className="h-3.5 w-3.5" /> AI
        </Badge>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{t("essay.title")}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{t("essay.subtitle")}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("essay.placeholder")}
              className="h-72 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed outline-none ring-brand-500/30 focus:ring-2 dark:border-slate-700 dark:bg-slate-800"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {words} {t("essay.words")}
              </span>
              <div className="flex gap-2">
                {text && (
                  <button
                    onClick={() => {
                      setText("");
                      setAiFeedback(null);
                      setOffline(null);
                    }}
                    className="rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {t("essay.clear")}
                  </button>
                )}
                <button
                  onClick={review}
                  disabled={!text.trim() || busy}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:opacity-40"
                >
                  <Sparkles className="h-4 w-4" />
                  {busy ? t("essay.reviewing") : t("essay.review")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <FileText className="h-5 w-5 text-brand-500" /> {t("essay.feedback")}
          </h3>

          {!aiFeedback && !offline && !busy && (
            <p className="mt-6 text-center text-sm text-slate-400">{t("essay.placeholder")}</p>
          )}

          {busy && (
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
              {t("essay.reviewing")}
            </div>
          )}

          {aiFeedback && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Markdown
                text={aiFeedback}
                className="mt-4 space-y-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
              />
            </motion.div>
          )}

          {offline && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-4 text-sm"
            >
              <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {t("essay.offlineNote")}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{t("essay.overall")}</p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{offline.overall}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{t("essay.improve")}</p>
                <ul className="mt-1 space-y-1.5">
                  {offline.improve.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-slate-600 dark:text-slate-400">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
