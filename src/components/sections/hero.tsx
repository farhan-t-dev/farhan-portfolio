import type { CSSProperties } from "react";

import { site } from "@/data/site";
import { Availability } from "@/components/ui/availability";
import { ArrowDown } from "@/components/ui/icons";

/**
 * Hero — the poster moment, and the one orchestrated entrance on the site.
 *
 * The headline is split into words on the server so the CSS can stagger
 * them without a client component. The words rise into place; the red
 * rule beside the introduction draws down; the meta row follows. All of
 * it is inert until the document's `data-motion` flag is set, so the
 * reduced-motion and no-script versions are simply the finished page.
 *
 * Positioning covers both new development and existing-app work; the
 * headline is distinctive without being rescue-only.
 *
 * The clamp floor is 2.25rem, not 2.75rem: "applications," is the widest
 * unbreakable word in the headline, and at 2.75rem it painted about 37px
 * past the 265px content column at a 320px viewport. 2.25rem lets the
 * word sit inside the column down to 320 without hyphenating a display
 * line.
 */
export function Hero() {
  const words = site.tagline.split(" ");

  return (
    <section className="shell gutter pt-14 pb-16 md:pt-20 md:pb-20 lg:pt-28 lg:pb-24">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-12">
        <h1 className="font-display text-[clamp(2.25rem,7.5vw,6.25rem)] text-balance md:col-span-11">
          {words.map((word, index) => (
            <span key={`${word}-${index}`}>
              <span className="inline-block">
                <span
                  className="hero-word inline-block"
                  style={{ "--word-index": index } as CSSProperties}
                >
                  {word}
                </span>
              </span>
              {index < words.length - 1 ? " " : null}
            </span>
          ))}
        </h1>

        {/* The measure lives on the paragraph, in the serif it is set in.
            It used to sit on this wrapper, where `ch` resolved against the
            inherited sans — so a 62ch cap meant a much narrower serif
            column, and "system." orphaned on a fifth line at every desktop
            width. Eight columns with a 58ch serif measure sets the same
            copy in four full lines. */}
        <div className="relative pl-5 md:col-span-8 md:pl-6">
          <span
            aria-hidden="true"
            className="hero-rule-y absolute left-0 top-0 h-full w-px bg-signal"
          />
          <p className="hero-copy max-w-[58ch] font-serif text-lg leading-relaxed text-pretty text-slate md:text-xl">
            Full-stack development, AI, server setup, and migrations for
            founders, agencies, and teams: new features, integrations,
            debugging, and deployment — whether we&apos;re starting from an empty
            repository, an existing codebase, or a live production system.
          </p>
        </div>
      </div>
    </section>
  );
}
