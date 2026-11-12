import Link from "next/link";

import type { Project } from "@/data/projects";
import { ArrowRight } from "./icons";
import { ProjectMeta } from "./project-meta";

type ProjectRowProps = {
  project: Project;
  /**
   * Heading level, not a rendered string: the register sits under the
   * page title and its "More work" label, so its rows use h3.
   */
  heading?: "h2" | "h3";
};

/**
 * One entry in the register: the compact, ruled tier under the lead
 * folios.
 *
 * Four columns — number, project, what it does, what it runs on — so the
 * remaining work can be scanned like a contents page. There is no plate
 * here; evidence belongs to the lead tier and the project note. The row
 * itself is the action, so the title link stretches across it and the
 * arrow only appears on inspection.
 */
export function ProjectRow({ project, heading: Heading = "h3" }: ProjectRowProps) {
  return (
    <li
      data-reveal
      className="group relative border-b border-line transition-colors hover:bg-mist/40 focus-within:bg-mist/40"
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 py-5 md:py-6 lg:grid-cols-12 lg:gap-y-3">
        <div className="flex items-center gap-3 lg:col-span-1 lg:items-start">
          <span
            aria-hidden="true"
            className="font-display text-sm tabular-nums text-slate"
          >
            {String(project.rank).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-line lg:hidden" />
        </div>

        <div className="min-w-0 lg:col-span-4">
          <div className="flex items-start justify-between gap-4">
            <Heading className="text-xl font-semibold tracking-tight [overflow-wrap:anywhere]">
              <Link
                href={`/projects/${project.slug}`}
                transitionTypes={["nav-forward"]}
                data-stretched-link
                className="underline decoration-slate/70 underline-offset-4 transition-colors after:absolute after:inset-0 after:content-[''] group-hover:decoration-signal"
              >
                {project.title}
                <span className="sr-only">, project note</span>
              </Link>
            </Heading>

            <ArrowRight className="mt-1.5 hidden size-4 shrink-0 text-slate opacity-0 transition-[opacity,transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-ink group-hover:opacity-100 group-focus-within:text-ink group-focus-within:opacity-100 lg:block" />
          </div>

          <ProjectMeta project={project} className="mt-1.5" />
        </div>

        <p className="max-w-[58ch] font-serif text-base leading-relaxed text-pretty text-slate lg:col-span-4">
          {project.description}
        </p>

        {project.tags.length > 0 && (
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate lg:col-span-3 lg:content-start">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
