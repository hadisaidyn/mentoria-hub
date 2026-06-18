"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { aiCounselorReply } from "@/lib/recommend";

interface Msg {
  role: "ai" | "user";
  text: string;
}

/** Tiny markdown: **bold** + line breaks. */
function render(text: string) {
  return text.split("\n").map((line, i) => (
    <p key={i} className={line.trim() === "" ? "h-2" : "mb-1"}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
        seg.startsWith("**") && seg.endsWith("**") ? (
          <strong key={j} className="font-semibold text-slate-900 dark:text-white">
            {seg.slice(2, -2)}
          </strong>
        ) : (
          <span key={j}>{seg}</span>
        ),
      )}
    </p>
  ));
}

export function AICounselor() {
  const { profile, opportunities } = useStore();
  const { t, lang } = useT();
  const CHIPS = [t("ai.chip1"), t("ai.chip2"), t("ai.chip3")];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "ai", text: t("ai.greeting") }]);
  const endRef = useRef<HTMLDivElement>(null);

  // keep the opening message in sync with the selected language (only if untouched)
  useEffect(() => {
    setMsgs((m) => (m.length === 1 && m[0].role === "ai" ? [{ role: "ai", text: t("ai.greeting") }] : m));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open, thinking]);

  const ask = async (q: string) => {
    if (!q.trim() || thinking) return;
    const history = msgs.map((m) => ({
      role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
      content: m.text,
    }));
    const payloadMsgs = [...history, { role: "user" as const, content: q }];
    while (payloadMsgs.length && payloadMsgs[0].role === "assistant") payloadMsgs.shift();

    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);

    const fallback = () => aiCounselorReply(q, profile, opportunities, lang);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMsgs,
          profile,
          lang,
          opportunities: opportunities.map((o) => ({
            title: o.title,
            direction: o.direction,
            type: o.type,
            deadline: o.deadline,
            grades: o.grades,
          })),
        }),
      });
      const data = await res.json();
      const reply = res.ok && data.configured && data.reply ? data.reply : fallback();
      setMsgs((m) => [...m, { role: "ai", text: reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "ai", text: fallback() }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-3 font-semibold text-white shadow-xl shadow-brand-600/40 transition hover:scale-105"
        aria-label="Open AI counselor"
      >
        <Bot className="h-5 w-5" />
        <span className="hidden sm:inline">Ask AI</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
            >
              <header className="grad-mesh flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{t("ai.title")}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      ● {t("ai.online")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-white/60 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {msgs.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "rounded-br-md bg-brand-600 text-white"
                          : "rounded-bl-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {render(m.text)}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex justify-start">
                    <div className="flex gap-1 rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 dark:bg-slate-800">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-2 w-2 rounded-full bg-slate-400"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {!profile && (
                  <button
                    onClick={() => window.dispatchEvent(new Event("open-onboarding"))}
                    className="w-full rounded-xl border border-dashed border-brand-300 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700 dark:border-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                  >
                    {t("ai.completeProfile")}
                  </button>
                )}
                <div ref={endRef} />
              </div>

              <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {CHIPS.map((c) => (
                    <button
                      key={c}
                      onClick={() => ask(c)}
                      className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300"
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    ask(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("ai.placeholder")}
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none ring-brand-500/30 focus:ring-2 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <button
                    type="submit"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white hover:bg-brand-700"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
