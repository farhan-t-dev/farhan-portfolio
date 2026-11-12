/**
 * The rule under the sticky header, doubled as a reading progress line.
 *
 * The grey hairline fades in as soon as the page moves; the red line
 * grows from the left as a fraction of the document already read. Both
 * are driven by `--scroll-progress`, written once per frame by
 * MotionDirector, so this component has no state and no client bundle.
 *
 * The header is a positioned element, so the wrapper anchors to its
 * bottom edge without an extra `relative` on the header.
 */
export function HeaderScrollBorder() {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px">
      <div
        className="h-px bg-line"
        style={{ opacity: "min(1, calc(var(--scroll-progress, 0) * 60))" }}
      />
      <div
        className="absolute inset-x-0 top-0 h-px origin-left bg-signal"
        style={{ transform: "scaleX(var(--scroll-progress, 0))" }}
      />
    </div>
  );
}
