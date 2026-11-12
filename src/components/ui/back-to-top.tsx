"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { ArrowUp } from "./icons";
import { cn } from "@/lib/utils";

/**
 * Back to top — appears once the visitor has scrolled past the first
 * viewport, and fades out again near the top. Links to #top (the header),
 * so it works without JavaScript if the click handler never attaches.
 *
 * Fixed-position UI element: no reveal animation, no `data-reveal`.
 * Reduced motion is handled by the global rule in globals.css.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Fire once the visitor has scrolled past Work and into Services —
      // there's something worth returning to before the button appears.
      setVisible(window.scrollY > 1000);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Link
      href="#top"
      aria-label="Back to top"
      className={cn(
        "fixed right-6 bottom-6 z-40 min-h-11 min-w-11 rounded-none border border-line bg-paper/95 backdrop-blur supports-backdrop-filter:bg-paper/90",
        visible
          ? "opacity-100 pointer-events-auto transition-opacity duration-500 ease-[var(--ease-out-expo)]"
          : "opacity-0 pointer-events-none transition-opacity duration-300",
      )}
    >
      <ArrowUp className="size-5 text-ink" />
    </Link>
  );
}
