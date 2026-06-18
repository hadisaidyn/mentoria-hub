import type { Opportunity } from "./types";

/** Build an all-day VEVENT .ics for an opportunity's deadline and trigger a download. */
export function downloadIcs(o: Opportunity) {
  const date = o.deadline.replace(/-/g, ""); // YYYYMMDD
  const next = new Date(o.deadline + "T00:00:00");
  next.setDate(next.getDate() + 1);
  const dtEnd = next.toISOString().slice(0, 10).replace(/-/g, "");
  const uid = `${o.id}-${date}@mentoria-hub`;
  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mentoria Hub//Deadlines//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART;VALUE=DATE:${date}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${esc("⏰ Deadline: " + o.title)}`,
    `DESCRIPTION:${esc(`${o.type} · ${o.direction}\nOrganizer: ${o.organizer}\nApply: ${o.applyUrl}`)}`,
    `URL:${esc(o.applyUrl)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P3D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc("Deadline in 3 days: " + o.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${o.id}-deadline.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
