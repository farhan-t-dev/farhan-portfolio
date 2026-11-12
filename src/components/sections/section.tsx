import { cn } from "@/lib/utils";

type SectionProps = {
  /** Anchor id — required when nav links point here (#process, #contact). */
  id?: string;
  /** The section's heading. Sentence case, small, sitting on the hairline. */
  label: string;
  /**
   * Explicit variant, not a boolean: the approved palette allows three
   * band treatments. `ink` is the single inverted moment (Process);
   * `mist` is the alternate band (About); `paper` is the default.
   */
  tone?: "paper" | "mist" | "ink";
  /**
   * Vertical padding override, merged over the default rhythm. Only
   * Process opts in: it is a deliberately half-height band, so its four
   * steps do not carry the full section padding. Every other section
   * inherits the default and renders exactly as before.
   */
  pad?: string;
  children: React.ReactNode;
};

/**
 * The shared section scaffold for the homepage's sections (and for the
 * closing ask on /work, so the invitation wears the same clothes as the
 * Contact band it mirrors).
 *
 * Asymmetric Swiss grid, per the approved brief:
 *   tablet and desktop — label in cols 1–2, content in cols 3–12
 *   mobile             — label stacks above content
 *
 * The rail is 2 columns from md up, not 4: /work and the project notes
 * already park their labels in 2 columns, and at 768 the 4-column rail
 * pushed homepage content 117px further right than the same content
 * starts on those pages. One rail width keeps the document's content
 * edge continuous across routes, and hands tablet prose the 560px column
 * it was previously denied.
 *
 * Extracted because six sections repeat this identical structure — one
 * clear responsibility (grid placement + band treatment + heading),
 * not a file per section fragment.
 */
export function Section({
  id,
  label,
  tone = "paper",
  pad = "py-14 md:py-20 lg:py-24",
  children,
}: SectionProps) {
  const dark = tone === "ink";

  const heading = (
    <h2
      data-reveal
      className={cn(
        "flex items-center gap-2.5 text-sm font-medium",
        dark ? "text-mist/70" : "text-slate",
      )}
    >
      <span
        aria-hidden="true"
        className="section-marker size-1.5 shrink-0 bg-signal"
      />
      {label}
    </h2>
  );

  return (
    <section
      id={id}
      data-section={id}
      className={cn(
        "relative",
        // Hairline separates bands; the inverted band is separated by
        // colour contrast alone, so no rule is needed there.
        !dark && "border-t border-line",
        tone === "mist" && "bg-mist",
        dark && "bg-ink text-paper",
      )}
    >
      {/* `pad` lands last so tailwind-merge resolves it over the default. */}
      <div
        className={cn(
          "shell gutter grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-12",
          pad,
        )}
      >
        <div className="md:col-span-2">{heading}</div>
        <div className="md:col-span-10">{children}</div>
      </div>
    </section>
  );
}
