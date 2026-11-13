"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ArrowLeft } from "@/components/ui/icons";

/**
 * Client-side error boundary for one project note.
 *
 * A thrown render in this segment (a bad image, a transition misfire)
 * replaces just this note instead of taking down the whole site: the
 * header, shell and the route back to the index stay reachable.
 *
 * The copy names the problem and the recovery, per the craft floor, and
 * the retry button resets the boundary so a transient failure heals
 * without a full page reload.
 */
export default function ProjectError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage(
      error.message?.trim().length > 0
        ? error.message
        : "This project note could not be rendered.",
    );
  }, [error.message]);

  return (
    <article className="shell gutter py-14 md:py-20 lg:py-24">
      <div className="grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-2">
          <p className="flex items-center gap-2.5 text-sm font-medium text-slate">
            <span
              aria-hidden="true"
              className="section-marker size-1.5 shrink-0 bg-signal"
            />
            Project note
          </p>
        </div>

        <div className="min-w-0 md:col-span-10">
          <h1 className="mt-8 font-display text-[clamp(2.5rem,7vw,5.5rem)]">
            Note unavailable
          </h1>

          <p className="mt-6 max-w-[58ch] font-serif text-xl leading-relaxed text-pretty text-ink">
            {message}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={reset}
              className="min-h-11 inline-flex items-center gap-2 rounded-sm border border-line bg-paper px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-mist focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-2"
            >
              Try again
            </button>
            <Link
              href="/work"
              className="min-h-11 inline-flex items-center gap-2 text-sm text-slate underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              <ArrowLeft className="size-4" />
              Back to all work
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
