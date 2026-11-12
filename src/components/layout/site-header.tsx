import Link from "next/link";

import { site } from "@/data/site";
import { HeaderScrollBorder } from "./header-scroll-border";
import { SiteNav } from "./site-nav";

/**
 * Site header: identity + primary navigation.
 *
 * Sticky at the top of the viewport: 64px on desktop, 56px on mobile.
 * The surface is translucent white with a light blur where supported
 * (solid white fallback otherwise), and it has no bottom border at the
 * top of the page — HeaderScrollBorder paints the hairline once the
 * page scrolls.
 *
 * Responsive decision (first-class, not an afterthought):
 * - One row at every width — no wrapping, no hamburger, no menu state.
 * - Mobile keeps name left, then Work and the Contact button right. The
 *   homepage anchor links hide below 768px; Work stays because /work is
 *   a separate route with no other entry point.
 * Server component: the only client JS is the scroll listener, kept in
 * its own small component.
 */
export function SiteHeader() {
  return (
    <header
      id="top"
      className="sticky top-0 z-40 touch-manipulation bg-paper backdrop-blur [view-transition-name:site-header] supports-backdrop-filter:bg-paper/95"
    >
      <div className="shell gutter flex h-14 items-center justify-between gap-4 md:h-16 md:gap-8">
        <Link
          href="/"
          className="group inline-flex min-h-11 items-center text-lg font-semibold tracking-tight text-ink"
        >
          {site.name}
          <span
            aria-hidden="true"
            className="ml-2 h-px w-0 bg-signal transition-[width] duration-300 group-hover:w-5"
          />
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-6">
          <SiteNav />

          {/* Filled button, but an anchor to the #contact section. */}
          <a
            href="/#contact"
            className="inline-flex min-h-11 items-center bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-signal"
          >
            Contact
          </a>
        </nav>
      </div>

      <HeaderScrollBorder />
    </header>
  );
}
