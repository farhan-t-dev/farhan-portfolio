"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The site's single motion client island.
 *
 * Everything that moves is authored as CSS on ordinary server-rendered
 * markup. This component only flips switches:
 *
 *   - reveals `[data-reveal]` and `[data-reveal-group]` children as they
 *     enter the viewport,
 *   - writes the document scroll position to `--scroll-progress` for the
 *     header rule,
 *   - gives `[data-magnetic]` elements a few pixels of pointer-follow.
 *
 * The initial `data-motion` attribute is set by a tiny inline script in
 * the document head. That matters: the hidden-until-revealed styles are
 * gated on it, so a broken/blocked script leaves a fully visible page
 * rather than a blank one. It is also not set when reduced motion is
 * requested, which means the static page is the reduced-motion page.
 *
 * The effect re-runs on pathname so client-side route changes observe the
 * new page's elements. The header and footer live in the layout and are
 * never re-observed.
 */
export function MotionDirector() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    // Client-side navigation keeps data-motion. A cold load that skipped
    // the inline script (e.g. an extension blocked it) gets one more
    // chance here, but only when motion is welcome.
    if (root.dataset.motion !== "on") {
      const allowed =
        window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
        "IntersectionObserver" in window;

      if (!allowed) return;
      root.dataset.motion = "on";
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealEverything = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-group]")
        .forEach((element) => element.classList.add("is-revealed"));
    };

    if (reduce.matches) {
      revealEverything();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -9% 0px", threshold: 0.06 },
    );

    const prepare = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-group]")
        .forEach((element) => {
          // Stagger direct children of a group, capped so a long list
          // never turns into a queue.
          if (element.hasAttribute("data-reveal-group")) {
            element
              .querySelectorAll<HTMLElement>(":scope > [data-reveal]")
              .forEach((child, index) => {
                child.style.setProperty(
                  "--reveal-delay",
                  `${Math.min(index, 8) * 58}ms`,
                );
              });
          }

          observer.observe(element);
        });
    };

    prepare();

    // Scroll progress. One rAF per frame at most, and the value is read by
    // CSS rather than React state so scrolling never re-renders the tree.
    let frame = 0;
    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;

      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Magnetic links: a handful of pixels, not a floating button. The
    // pointer must be a real mouse; touch and pen keep the resting state.
    const cleanups: Array<() => void> = [];

    document
      .querySelectorAll<HTMLElement>("[data-magnetic]")
      .forEach((element) => {
        const reset = () => {
          element.style.setProperty("--mag-x", "0px");
          element.style.setProperty("--mag-y", "0px");
        };

        const move = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;

          const rect = element.getBoundingClientRect();
          const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
          const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;

          element.style.setProperty("--mag-x", `${(x * 6).toFixed(2)}px`);
          element.style.setProperty("--mag-y", `${(y * 4).toFixed(2)}px`);
        };

        element.addEventListener("pointermove", move);
        element.addEventListener("pointerleave", reset);
        element.addEventListener("blur", reset);

        cleanups.push(() => {
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", reset);
          element.removeEventListener("blur", reset);
        });
      });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [pathname]);

  return null;
}
