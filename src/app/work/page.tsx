import type { Metadata } from "next";
import { ViewTransition } from "react";

import {
  featuredProjects,
  otherProjects,
  rankedProjects,
} from "@/data/projects";
import { site } from "@/data/site";
import { socialMetadata } from "@/lib/social-metadata";
import { ProjectFolio } from "@/components/ui/project-folio";
import { ProjectRow } from "@/components/ui/project-row";

const description =
  "Every project in one index — what each system does, what was built or changed, and the stack it runs on.";

export const metadata: Metadata = {
  title: "Work",
  description,
  ...socialMetadata({
    title: "Work",
    description,
    path: "/work",
  }),
};

const number = (value: number) => String(value).padStart(2, "0");

/**
 * Work index — a register in two tiers.
 *
 * The old page was a contact sheet: six equal cards followed by ruled
 * text. It proved volume and then flattened the work. This version is
 * built like a bound index: each selected project gets a numbered folio
 * with its plate and evidence, and the remaining entries collapse into a
 * compact register that can be scanned like a contents page.
 *
 * The numbers are `project.rank`, the same order that drives the
 * homepage and the "next project" link. They are rendered as a spine,
 * not as a score: they locate an entry in the index and carry through to
 * the project sheet.
 *
 * `featured` and `rank` remain the only inputs. The flag decides the
 * tier; rank decides the sequence inside it. Both lists come from
 * src/data/projects.ts, so this file only composes them.
 *
 * With no entries the page falls back to the honest empty state it had
 * before there was anything to list. Nothing here is invented to fill a
 * page.
 */
export default function WorkPage() {
  if (rankedProjects.length === 0) {
    return (
      <ViewTransition
        enter={{
          "nav-forward": "nav-forward",
          "nav-back": "nav-back",
          default: "none",
        }}
        exit={{
          "nav-forward": "nav-forward",
          "nav-back": "nav-back",
          default: "none",
        }}
        default="none"
      >
        <div className="shell gutter py-14 md:py-20 lg:py-24">
          <header className="max-w-[70ch]">
            <p className="flex items-center gap-2.5 text-sm font-medium text-slate">
              <span
                aria-hidden="true"
                className="section-marker size-1.5 shrink-0 bg-signal"
              />
              Work index
            </p>

            <h1
              data-reveal
              className="mt-6 font-display text-[clamp(2.25rem,6vw,4.5rem)]"
            >
              Work
            </h1>

            <p data-reveal className="mt-6 font-serif text-xl leading-relaxed text-ink">
              Project notes will be published here. None are live yet.
            </p>

            <p data-reveal className="mt-4 font-serif text-lg leading-relaxed text-slate">
              Each entry will cover what the system does, what was built or
              changed, and the stack it runs on — written to be checked, not just
              read. Until then, the fastest way to see relevant work is to ask
              about the problem you&apos;re solving.
            </p>

            {site.email.trim().length > 0 && (
              <p data-reveal className="mt-8">
                <a
                  href={`mailto:${site.email}`}
                  className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal"
                >
                  {site.email}
                </a>
              </p>
            )}
          </header>
        </div>
      </ViewTransition>
    );
  }

  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      <>
        <header className="shell gutter pt-14 md:pt-20 lg:pt-24">
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-6">
            <div className="md:col-span-2">
              <p
                data-reveal
                className="flex items-center gap-2.5 text-sm font-medium text-slate"
              >
                <span
                  aria-hidden="true"
                  className="section-marker size-1.5 shrink-0 bg-signal"
                />
                Work index
              </p>
            </div>

            <div className="md:col-span-10">
              <h1
                data-reveal
                className="font-display text-[clamp(2.25rem,6vw,4.5rem)]"
              >
                Work
              </h1>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
                <p
                  data-reveal
                  className="max-w-[58ch] font-serif text-xl leading-relaxed text-pretty text-ink md:col-span-8 lg:col-span-7"
                >
                  Fixes, features and releases on systems that were already
                  running, plus a few builds of my own. Each entry opens a short
                  note on what the system does, what I changed, and what it runs
                  on.
                </p>

                <dl
                  data-reveal
                  className="border-t border-line md:col-span-4 md:col-start-9"
                >
                  <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 text-sm">
                    <dt className="text-slate">Project notes</dt>
                    <dd className="font-display tabular-nums text-ink">
                      {number(rankedProjects.length)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 text-sm">
                    <dt className="text-slate">Selected</dt>
                    <dd className="font-display tabular-nums text-ink">
                      {number(featuredProjects.length)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 text-sm">
                    <dt className="text-slate">Register</dt>
                    <dd className="font-display tabular-nums text-ink">
                      {number(otherProjects.length)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </header>

        <div className="shell gutter mt-12 md:mt-16">
          {featuredProjects.length > 0 && (
            <section aria-labelledby="selected-work">
              <div className="flex items-baseline justify-between gap-6 border-b border-line pb-3">
                <h2
                  id="selected-work"
                  data-reveal
                  className="flex items-center gap-2.5 text-sm font-medium text-slate"
                >
                  <span
                    aria-hidden="true"
                    className="section-marker size-1.5 shrink-0 bg-signal"
                  />
                  Selected work
                </h2>
                <span className="font-display text-sm tabular-nums text-slate">
                  {number(featuredProjects.length)} notes
                </span>
              </div>

              <ul data-reveal-group>
                {featuredProjects.map((project, index) => (
                  <ProjectFolio
                    key={project.slug}
                    project={project}
                    eager={index === 0}
                  />
                ))}
              </ul>
            </section>
          )}

          {otherProjects.length > 0 && (
            <section
              aria-labelledby="more-work"
              className="mt-14 md:mt-20"
            >
              <div className="flex items-baseline justify-between gap-6 border-b border-line pb-3">
                <h2
                  id="more-work"
                  data-reveal
                  className="flex items-center gap-2.5 text-sm font-medium text-slate"
                >
                  <span
                    aria-hidden="true"
                    className="section-marker size-1.5 shrink-0 bg-signal"
                  />
                  More work
                </h2>
                <span className="font-display text-sm tabular-nums text-slate">
                  {number(otherProjects.length)} notes
                </span>
              </div>

              <ul data-reveal-group>
                {otherProjects.map((project) => (
                  <ProjectRow
                    key={project.slug}
                    project={project}
                    heading="h3"
                  />
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Closing ask. The label rail returns to tie the close to the
            index above instead of letting the page end on an unlabelled
            block. */}
        <section className="mt-16 border-t border-line md:mt-24">
          <div className="shell gutter py-14 md:py-20 lg:py-24">
            <div className="grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-6">
              <div className="md:col-span-2">
                <p
                  data-reveal
                  className="flex items-center gap-2.5 text-sm font-medium text-slate"
                >
                  <span
                    aria-hidden="true"
                    className="section-marker size-1.5 shrink-0 bg-signal"
                  />
                  Contact
                </p>
              </div>

              <div className="md:col-span-10">
                <p
                  data-reveal
                  className="font-display text-[clamp(1.625rem,3.5vw,2.25rem)] text-balance"
                >
                  Something close, but not listed?
                </p>

                {site.email.trim().length > 0 && (
                  <p data-reveal className="mt-8">
                    <a
                      href={`mailto:${site.email}`}
                      data-email
                      className="inline-flex min-h-11 items-center font-display text-[clamp(1.2rem,4vw,2.5rem)] text-ink underline decoration-slate/70"
                    >
                      {site.email}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </>
    </ViewTransition>
  );
}
