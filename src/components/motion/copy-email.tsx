"use client";

import { useEffect, useRef, useState } from "react";

import { Check, Copy } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type CopyEmailProps = {
  email: string;
  className?: string;
};

/**
 * Copy-to-clipboard is an enhancement beside the real action, never a
 * replacement for it: the address remains a `mailto:` link. The button is
 * small, keyboard-sized, and announces its result through a polite live
 * region rather than a toast that disappears before it is read.
 */
export function CopyEmail({ email, className }: CopyEmailProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }

    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 2200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "group inline-flex min-h-9 items-center gap-2 whitespace-nowrap border border-line px-3 text-xs text-slate transition-colors hover:border-ink hover:text-ink focus-visible:border-ink",
        className,
      )}
    >
      {status === "copied" ? (
        <Check className="size-3.5 text-available" />
      ) : (
        <Copy className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px" />
      )}
      <span aria-live="polite">
        {status === "copied"
          ? "Copied"
          : status === "failed"
            ? "Couldn't copy"
            : "Copy email"}
      </span>
    </button>
  );
}
