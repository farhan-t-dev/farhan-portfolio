"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Client-side error boundary for the work index.
 *
 * Keeps a failure in one section of the index from blanking the page:
 * the failure names itself and offers a retry plus a way out to the
 * homepage.
 */
export default function WorkError({
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
        : "The work index could not be rendered.",
    );
  }, [error.message]);

  return (
    <div className="shell gutter py-14 md:py-20 lg:py-24">
      <header className="max-w-[70ch]">
        <p className="flex items-center gap-2.5 text-sm font-medium text-slate">
          <span
            aria-hidden="true"
            className="section-marker size-1.5 shrink-0 bg-signal"
          />
          Work index
        </p>

        <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,4.5rem)]">
          Work index unavailable
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
            href="/"
            className="min-h-11 inline-flex items-center gap-2 text-sm text-slate underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Back to home
          </Link>
        </div>
      </header>
    </div>
  );
}
