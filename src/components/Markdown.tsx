"use client";

/** Minimal markdown: **bold**, `- ` / `* ` bullets, and line breaks. */
export function Markdown({ text, className }: { text: string; className?: string }) {
  const lines = text.split("\n");
  return (
    <div className={className}>
      {lines.map((raw, i) => {
        const line = raw.trimEnd();
        const bullet = /^\s*[-*]\s+/.test(line);
        const content = bullet ? line.replace(/^\s*[-*]\s+/, "") : line;
        const parts = content.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
          seg.startsWith("**") && seg.endsWith("**") ? (
            <strong key={j} className="font-semibold text-slate-900 dark:text-white">
              {seg.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{seg}</span>
          ),
        );
        if (line.trim() === "") return <div key={i} className="h-2" />;
        if (bullet)
          return (
            <div key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              <p className="flex-1">{parts}</p>
            </div>
          );
        return (
          <p key={i} className="mb-1">
            {parts}
          </p>
        );
      })}
    </div>
  );
}
