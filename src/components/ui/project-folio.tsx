import Link from "next/link";
import { ViewTransition } from "react";

import type { Project } from "@/data/projects";
import { projectLeadImage } from "@/lib/project-media";
import { isExternalUrl } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "./icons";
import { ProjectMeta } from "./project-meta";
import { ProjectScope } from "./project-scope";
import { ProjectThumb } from "./project-thumb";

type ProjectFolioProps = {
  project: Project;
  /** First folio: its screenshot is the page's LCP. */
  eager?: boolean;
};

/**
 * One entry in the lead tier: a numbered proof row, not a card.
 *
 * The index has a spine. The number sits in the first column, the plate
 * occupies the next five, and the note fills the right six. On small
 * screens the same order becomes number, title, plate, evidence, so the
 * reader always knows which entry they are in before the image arrives.
 *
 * The title link stretches over the whole row; outbound links are lifted
 * above that overlay. The plate keeps the shared `project-<slug>`
 * transition name so it morphs into the lead image on the project page.
 */
export function ProjectFolio({ project, eager = false }: ProjectFolioProps) {
  const image = projectLeadImage(project);
  const links = [
    { label: "Live site", url: project.liveUrl },
    { label: "Repository", url: project.repoUrl },
    { label: "App Store", url: project.appStoreUrl },
  ].filter(
    (link): link is { label: string; url: string } => isExternalUrl(link.url),
  );

  return (
    <li
      data-reveal
      className="group relative border-b border-line transition-colors hover:bg-mist/40 focus-within:bg-mist/40"
    >
      <div className="grid grid-cols-1 items-start gap-x-6 gap-y-5 py-8 md:py-10 lg:grid-cols-12">
        <div className="flex items-center gap-3 lg:col-span-1 lg:block lg:pt-1.5">
          <span
            aria-hidden="true"
            className="font-display text-sm tabular-nums text-slate"
          >
            {String(project.rank).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-line lg:hidden" />
        </div>

        <div className="lg:col-span-5 lg:col-start-2 lg:row-start-1">
          {image ? (
            <ViewTransition
              name={`project-${project.slug}`}
              share="morph"
              default="none"
            >
              <ProjectThumb
                project={project}
                eager={eager}
                sizes="(min-width: 1312px) 500px, (min-width: 1024px) 38vw, 100vw"
                className="aspect-[16/10] w-full"
              />
            </ViewTransition>
          ) : project.scope ? (
            <ProjectScope items={project.scope} className="aspect-[16/10]" />
          ) : null}
        </div>

        <div className="min-w-0 lg:col-span-6 lg:col-start-7 lg:row-start-1">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] [overflow-wrap:anywhere]">
              <Link
                href={`/projects/${project.slug}`}
                transitionTypes={["nav-forward"]}
                data-stretched-link
                className="after:absolute after:inset-0 after:content-['']"
              >
                {project.title}
                <span className="sr-only">, project note</span>
              </Link>
            </h2>

            <ArrowRight className="mt-2 hidden size-4 shrink-0 text-slate transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-ink lg:block" />
          </div>

          <ProjectMeta project={project} className="mt-2" />

          <p className="mt-4 max-w-[46ch] font-serif text-lg leading-relaxed text-pretty text-slate">
            {project.description}
          </p>

          <div className="mt-6 border-t border-line">
            {project.tags.length > 0 && (
              <div className="flex flex-col gap-1 border-b border-line py-3 sm:flex-row sm:gap-6">
                <p className="w-16 shrink-0 pt-0.5 text-xs uppercase tracking-[0.18em] text-slate">
                  Stack
                </p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            )}

            {links.length > 0 && (
              <div className="relative z-10 flex flex-col gap-1 py-2 sm:flex-row sm:gap-6">
                <p className="w-16 shrink-0 pt-2.5 text-xs uppercase tracking-[0.18em] text-slate">
                  Links
                </p>
                <ul className="flex flex-wrap gap-x-5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.url}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="inline-flex min-h-11 items-center gap-1.5 text-sm text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal"
                      >
                        {link.label}
                        <ArrowUpRight className="size-3.5 text-slate" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
