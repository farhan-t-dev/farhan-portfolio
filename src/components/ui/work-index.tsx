"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Project } from "@/data/projects";
import { projectKindLabel, projectStatusLabel } from "@/lib/project-labels";
import { cn } from "@/lib/utils";
import { ArrowRight } from "./icons";
import { ProjectMeta } from "./project-meta";
import { ProjectScope } from "./project-scope";

export type WorkIndexItem = {
  project: Project;
  /** Resolved on the server, so this client component never touches fs. */
  image: { src: string; alt: string } | null;
};

type WorkIndexProps = {
  items: WorkIndexItem[];
  /** Total size of the full index, for the door at the foot. */
  total: number;
};

/**
 * The homepage work index: a ruled list on the left, a live plate on the
 * right.
 *
 * The old homepage was a type-only index, which was honest but withheld
 * the one thing a client is judging. This version keeps the editorial
 * rows and lets them drive a single, large plate: hover or focus a row
 * and the plate registers in with that project's screenshot. On touch the
 * plate is replaced by a small still inside each row, so the work is
 * visible there too.
 *
 * The preview is decoration, not a second navigation surface, so the
 * aside is `aria-hidden`: the list already carries every title and link.
 * The plate is not a card — it is a framed still with registration marks
 * and a caption in the same grid.
 *
 * `Project` is serializable data; the image is resolved in the server
 * section before it reaches this island.
 */
export function WorkIndex({ items, total }: WorkIndexProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Every plate that has been inspected stays mounted. Swapping the plate
  // by key restarted it from `opacity: 0`, so a fast cursor left the panel
  // blinking; kept layers crossfade instead, and only visited screenshots
  // are ever fetched.
  const [seen, setSeen] = useState<number[]>([0]);
  const active = items[activeIndex] ?? items[0];

  const inspect = (index: number) => {
    setActiveIndex(index);
    setSeen((current) =>
      current.includes(index) ? current : [...current, index],
    );
  };

  if (!active) return null;

  return (
    <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-8">
      <div className="lg:col-span-6">
        <ul className="border-t border-line" data-reveal-group>
          {items.map(({ project, image }, index) => {
            return (
              <li
                key={project.slug}
                data-work-row
                data-reveal
                onMouseEnter={() => inspect(index)}
                onFocus={() => inspect(index)}
                className={cn(
                  "group relative border-b border-line transition-colors hover:bg-mist/40 focus-within:bg-mist/40",
                  // Only the first three featured entries show on mobile;
                  // the rest wait for the "All projects" door. Desktop
                  // keeps the full list beside the plate.
                  index >= 3 ? "hidden lg:block" : "",
                )}
              >
                <div
                  data-work-row-inner
                  className="grid grid-cols-[minmax(0,1fr)_5rem] items-start gap-x-6 py-6 md:py-6 lg:grid-cols-1 lg:gap-x-0"
                >
                  <div className="min-w-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-xl font-semibold tracking-tight text-ink [overflow-wrap:anywhere]">
                        <Link
                          href={`/projects/${project.slug}`}
                          transitionTypes={["nav-forward"]}
                          data-stretched-link
                          className="after:absolute after:inset-0 after:content-['']"
                        >
                          {project.title}
                          <span className="sr-only">, project note</span>
                        </Link>
                      </h3>

                      <ArrowRight className="work-row-arrow hidden size-4 shrink-0 text-ink lg:block" />
                    </div>

                    <ProjectMeta project={project} className="mt-1.5" />

                    <p className="mt-2 line-clamp-2 max-w-[54ch] font-serif text-base leading-relaxed text-pretty text-slate">
                      {project.description}
                    </p>
                  </div>

                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-mist lg:hidden">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="104px"
                        className="object-cover object-top"
                      />
                    ) : project.scope ? (
                      <ProjectScope
                        items={project.scope}
                        className="h-full justify-center p-3 [&_li]:min-h-0 [&_li]:text-xs [&_p]:text-[0.6rem] [&_ul]:mt-1"
                      />
                    ) : (
                      <span className="flex h-full items-end p-3 font-display text-sm text-slate">
                        {project.title}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-6" data-reveal>
          <Link
            href="/work"
            transitionTypes={["nav-forward"]}
            className="group inline-flex min-h-11 items-center gap-2 text-sm text-slate underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            All {total} projects
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            <span className="sr-only"> (project index)</span>
          </Link>
        </p>
      </div>

      {/* Decorative: the list above is the accessible copy of this panel. */}
      <aside
        aria-hidden="true"
        className="hidden lg:col-span-6 lg:block"
      >
        <div className="sticky top-24">
          <div className="preview-plate relative aspect-[16/10] overflow-hidden border border-line bg-mist">
            {seen.map((index) => {
              const item = items[index];
              if (!item) return null;

              return (
                <div
                  key={item.project.slug}
                  data-plate-layer
                  data-active={index === activeIndex ? "true" : "false"}
                  className="pointer-events-none absolute inset-0"
                >
                  {item.image ? (
                    <Image
                      src={item.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 45vw, 45vw"
                      className="object-cover object-top"
                    />
                  ) : item.project.scope ? (
                    <ProjectScope items={item.project.scope} className="h-full" />
                  ) : (
                    <span className="flex h-full flex-col justify-end p-6">
                      <span className="font-display text-3xl text-ink">
                        {item.project.title}
                      </span>
                      <span className="mt-2 text-sm text-slate">Project note</span>
                    </span>
                  )}
                </div>
              );
            })}

            <span className="pointer-events-none absolute left-3 top-3 z-10 size-3 border-l border-t border-signal" />
            <span className="pointer-events-none absolute bottom-3 right-3 z-10 size-3 border-b border-r border-signal" />
          </div>

          <div className="mt-3 flex items-start justify-between gap-8 border-t border-line pt-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">
                {active.project.title}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate">
                {projectKindLabel(active.project)}
                {projectStatusLabel(active.project) ? (
                  <>
                    <span className="px-1.5">·</span>
                    {projectStatusLabel(active.project)}
                  </>
                ) : null}
              </p>
            </div>

            <ul className="flex max-w-[18rem] flex-wrap justify-end gap-x-3 gap-y-1 text-xs text-slate">
              {active.project.tags.slice(0, 3).map((tag) => (
                <li
                  key={tag}
                  className={cn(
                    "overflow-hidden text-ellipsis whitespace-nowrap min-w-0 max-w-full",
                  )}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
