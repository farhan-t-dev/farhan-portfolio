"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Etc/GMT-6",
});

/**
 * The owner's working clock, rendered from the same UTC+6 claim as the
 * reply-window copy. It is a small courtesy, not a status system: there
 * is deliberately no green dot, because "open for work" is a separate
 * claim made only by `site.availability`.
 *
 * The first paint is a placeholder so server and client never disagree;
 * the client fills it in immediately and refreshes every half minute.
 */
export function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(formatter.format(new Date()));
    update();

    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span className="text-slate">Local time</span>
      <time className="tabular-nums text-ink">{time ?? "—:—"}</time>
      <span className="text-slate">UTC+6</span>
    </span>
  );
}
