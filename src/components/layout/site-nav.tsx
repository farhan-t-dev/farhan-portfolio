"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { navLinks } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Primary section links, with the current area marked.
 *
 * Two different kinds of current state share one look:
 *   - a route: /work and /projects/<slug> light Work;
 *   - a position on the homepage: Services, Process and About light as
 *     the section crosses the middle of the viewport.
 *
 * The scroll-spy is deliberately a middle-band observer rather than a
 * scroll listener. It answers "which part of the document am I in?" and
 * never guesses from a pixel offset.
 *
 * Below md the anchor links are hidden — they only point at spans of the
 * homepage, which a thumb reaches anyway. Work is the exception: /work
 * is a separate route with no other way in, so it stays visible on the
 * same row as Contact.
 */
export function SiteNav() {
  const pathname = usePathname();
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
  const workActive =
    pathname === "/work" || pathname.startsWith("/projects/");
  const workLink = navLinks.find((item) => item.href === "/work");

  useEffect(() => {
    if (pathname !== "/") {
      setActiveAnchor(null);
      return;
    }

    const ids = ["services", "process", "about"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    // Measure how much of each section lies inside the middle band, not
    // what fraction of the section that is. Ratio favours the shortest
    // section: while Process (227px tall) first touched the band it beat
    // Services (675px tall), so the header named the section the reader
    // had not reached yet.
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(
            `#${entry.target.id}`,
            entry.isIntersecting ? entry.intersectionRect.height : 0,
          );
        }

        const current = [...visible.entries()]
          .filter(([, overlap]) => overlap > 0)
          .sort((a, b) => b[1] - a[1])[0];

        // Clear as well as set. Keeping the last match left "Services"
        // underlined in the header while the reader was back in the hero
        // or the Work index — a current-state cue pointing at the wrong
        // part of the document.
        setActiveAnchor(current ? current[0] : null);
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.15, 0.4, 0.75] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex min-h-11 items-center text-sm",
      active
        ? "text-ink underline decoration-signal decoration-1 underline-offset-8"
        : "text-slate transition-colors hover:text-ink",
    );

  return (
    <>
      {workLink && (
        <Link
          href={workLink.href}
          aria-current={workActive ? "page" : undefined}
          transitionTypes={["nav-forward"]}
          className={cn("md:hidden", linkClass(workActive))}
        >
          {workLink.label}
        </Link>
      )}

      <ul className="hidden items-center gap-6 md:flex">
        {navLinks.map((item) => {
          const isRoute = item.href === "/work";
          const active = isRoute
            ? workActive
            : pathname === "/" && activeAnchor === item.href.replace("/#", "#");

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={
                  active ? (isRoute ? "page" : "location") : undefined
                }
                transitionTypes={isRoute ? ["nav-forward"] : undefined}
                className={linkClass(active)}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
