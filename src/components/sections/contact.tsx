import { site } from "@/data/site";
import { CopyEmail } from "@/components/motion/copy-email";
import { LocalTime } from "@/components/motion/local-time";
import { CalBookingLink } from "@/components/ui/cal-booking-link";
import { Section } from "./section";

/**
 * Contact — email and a hosted booking link are the primary ways to get in
 * touch, with profile links alongside.
 *
 * Every value comes from src/data/site.ts. Missing values degrade to a
 * clearly marked development placeholder rather than rendering a broken
 * link or hiding the section outright: this section MUST keep its id,
 * because the header links to /#contact and a missing target would leave
 * that nav item pointing at nothing. An empty href renders as text, not
 * an anchor. Profile links with an empty href are filtered out.
 */
export function Contact() {
  const hasEmail = site.email.trim().length > 0;
  const links = site.links.filter((link) => link.href.trim().length > 0);

  return (
    <Section id="contact" label="Contact">
      {/* The close is two groups, not one column: the ask (intro, address,
          copy control) takes the first eight columns, and the terms
          (response time, local time, profiles) sit beside it in the last
          four. Previously everything stacked inside a 64ch column, which
          left the right half of the section empty at every desktop width.
          On the page's one conversion moment, that read as an unfinished
          page rather than as breathing room. Below lg the same two groups
          stack in the same order. */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-8">
          <p
            data-reveal
            className="max-w-[54ch] font-serif text-xl leading-relaxed text-pretty text-ink md:text-2xl"
          >
            The fastest way to start is a link to the repository and a
            description of what you need — a feature, a fix, or a smooth deployment.
          </p>

          {/* The address is the widest unbreakable string on the page. The
              clamp floor is 1.2rem, not 1.5rem: at 320px it rendered 335px
              wide against 280px of available gutter and forced a page-level
              horizontal scrollbar. The floor keeps it inside a 320px
              viewport. The copy control sits below it, not beside it, so the
              address is never squeezed into a mid-word break by its own
              secondary action. */}
          <div data-reveal className="mt-8">
            {hasEmail ? (
              <a
                href={`mailto:${site.email}`}
                data-magnetic
                data-email
                className="inline-flex min-h-11 items-center font-display text-[clamp(1.2rem,4vw,2.5rem)] text-ink underline decoration-slate/70 lg:text-[clamp(1.2rem,3.2vw,2.5rem)]"
              >
                {site.email}
              </a>
            ) : (
              // Clearly marked dev placeholder — not a visitor-facing string.
              <span className="font-display text-[clamp(1.2rem,4vw,2.5rem)] text-slate lg:text-[clamp(1.2rem,3.2vw,2.5rem)]">
                <span className="sr-only">Development placeholder: </span>
                add email in src/data/site.ts
              </span>
            )}

            {hasEmail && (
              <div className="mt-3">
                <CopyEmail email={site.email} />
              </div>
            )}
            {site.bookingUrl.trim().length > 0 && (
              <CalBookingLink href={site.bookingUrl} />
            )}
          </div>
        </div>

        {/* Terms column. It reads directly under the ask on phones, and
            beside it from lg, starting on the same line as the intro. */}
        <div className="mt-6 lg:col-span-4 lg:col-start-9 lg:mt-0">
          {site.contactNote && (
            <p
              data-reveal
              className="max-w-[48ch] text-sm leading-relaxed text-slate"
            >
              {site.contactNote}
            </p>
          )}

          <p data-reveal className="mt-2">
            <LocalTime />
          </p>

          {links.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2" data-reveal>
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-flex min-h-11 items-center text-sm text-slate underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}
