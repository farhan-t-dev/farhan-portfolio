import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { projects, rankedProjects } from "@/data/projects";
import {
  existingProjectImages,
  projectImageAlt,
  projectLeadImage,
} from "@/lib/project-media";
import { projectKindLabel, projectStatusLabel } from "@/lib/project-labels";
import { socialMetadata } from "@/lib/social-metadata";
import { isExternalUrl } from "@/lib/utils";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { ProjectMeta } from "@/components/ui/project-meta";
import { ProjectScope } from "@/components/ui/project-scope";
import { ProjectThumb } from "@/components/ui/project-thumb";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const number = (value: number) => String(value).padStart(2, "0");

/**
 * Only slugs in the data file exist. Unknown project URLs are a 404 at
 * the routing level instead of a render-on-demand miss that still has to
 * boot the app to say no.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.description,
    ...socialMetadata({
      title: project.title,
      description: project.description,
      path: `/projects/${project.slug}`,
      type: "article",
      // The segment's opengraph-image route supplies the card. Declaring an
      // image here would override it.
      image: false,
    }),
  };
}

/**
 * Project note — one page per project in src/data/projects.ts.
 *
 * Deliberately a note, not a case study: it carries what the project is,
 * what was built or changed, and the stack, which is what the data file
 * actually holds. Calling it a case study promised a situation, a
 * decision trail and a handover that these entries do not yet have, so
 * the name follows the content instead of the ambition. When structured
 * situation/change/handover fields exist, the name can change back.
 *
 * Everything on it comes from the data file: nothing is invented to make
 * the page look fuller, so a project with only a title, summary and tags
 * renders exactly that. Images render only if their files actually exist
 * in public/ (see src/lib/project-media.ts) — drop the WebP in and
 * rebuild, and it appears; until then there is no broken image and no
 * substitute. The first image is the lead plate; any others follow in a
 * two-column gallery with optional captions.
 *
 * Composition: a sheet head with the index number, title and standfirst;
 * a full-width specification table for type, stack and links; then the
 * evidence. The note closes on the next project in the register, shown
 * as the same kind of folio the index uses, so the sequence carries
 * through instead of ending on a back button.
 */
export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = rankedProjects.find((p) => p.slug === slug);

  if (!project) notFound();

  const index = rankedProjects.indexOf(project);
  const images = existingProjectImages(project);
  const [leadImage, ...moreImages] = images;
  const nextProject =
    rankedProjects.length > 1
      ? rankedProjects[(index + 1) % rankedProjects.length]
      : null;

  const nextImage = nextProject ? projectLeadImage(nextProject) : null;
  const nextHasVisual = Boolean(nextImage || nextProject?.scope?.length);

  // Placeholders ("https://<site-url>") are dropped rather than rendered
  // as broken anchors.
  const links = [
    { label: "Live site", url: project.liveUrl },
    { label: "Repository", url: project.repoUrl },
    { label: "App Store", url: project.appStoreUrl },
  ].filter(
    (link): link is { label: string; url: string } => isExternalUrl(link.url),
  );

  const statusLabel = projectStatusLabel(project);

  // The root layout owns <main>; this renders the detail body only.
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
      <article className="shell gutter py-14 md:py-20 lg:py-24">
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
              Project note
            </p>
          </div>

          <div
            data-reveal-group
            className="min-w-0 md:col-span-10"
          >
            <div
              data-reveal
              className="flex items-center justify-between gap-6 border-b border-line pb-3 text-sm"
            >
              <Link
                href="/work"
                transitionTypes={["nav-back"]}
                className="group inline-flex min-h-11 items-center gap-2 text-slate underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                All work
                <span className="sr-only"> (project index)</span>
              </Link>

              <span
                aria-label={`Project ${project.rank} of ${rankedProjects.length}`}
                className="font-display tabular-nums text-slate"
              >
                {number(project.rank)} / {number(rankedProjects.length)}
              </span>
            </div>

            <h1
              data-reveal
              className="mt-8 max-w-[16ch] font-display text-[clamp(2.5rem,7vw,5.5rem)] [overflow-wrap:anywhere]"
            >
              {project.title}
            </h1>

            <p
              data-reveal
              className="mt-6 max-w-[58ch] font-serif text-xl leading-relaxed text-pretty text-ink md:text-2xl"
            >
              {project.description}
            </p>

            <dl
              data-reveal
              className="mt-8 grid grid-cols-1 border-t border-line sm:grid-cols-3"
            >
              <div className="border-b border-line py-4 sm:border-b-0 sm:border-r sm:pr-6">
                <dt className="text-xs uppercase tracking-[0.18em] text-slate">
                  Type
                </dt>
                <dd className="mt-1.5 text-sm text-ink">
                  {projectKindLabel(project)}
                  {statusLabel && (
                    <span className="mt-0.5 block text-slate">
                      {statusLabel}
                    </span>
                  )}
                </dd>
              </div>

              <div className="border-b border-line py-4 sm:border-b-0 sm:border-r sm:px-6">
                <dt className="text-xs uppercase tracking-[0.18em] text-slate">
                  Stack
                </dt>
                <dd className="mt-1.5">
                  {project.tags.length > 0 ? (
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink">
                      {project.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-slate">Not listed</span>
                  )}
                </dd>
              </div>

              <div className="border-b border-line py-4 sm:border-b-0 sm:pl-6">
                <dt className="text-xs uppercase tracking-[0.18em] text-slate">
                  Links
                </dt>
                <dd className="mt-1.5">
                  {links.length > 0 ? (
                    <ul className="flex flex-col items-start">
                      {links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          rel="noopener noreferrer"
                          target="_blank"
                          className="group inline-flex min-h-9 items-center gap-1.5 text-sm text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal"
                        >
                          {link.label}
                          <ArrowUpRight className="size-3.5 text-slate transition-colors group-hover:text-ink" />
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-slate">No public link</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {leadImage && (
          // 16:10 is the ratio the current screenshots were captured at, so
          // most plates render uncropped; `object-top` only bites on a
          // taller file. Fixed ratios keep the page free of layout shift
          // while the real dimensions stay out of the data model.
          <figure className="mt-10 md:mt-14">
            <ViewTransition
              name={`project-${project.slug}`}
              share="morph"
              default="none"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-mist">
                <Image
                  src={leadImage.src}
                  alt={projectImageAlt(project, leadImage)}
                  fill
                  loading="eager"
                  sizes="(min-width: 1312px) 1170px, (min-width: 1024px) 92vw, 100vw"
                  className="object-cover object-top"
                />
                <span className="pointer-events-none absolute left-3 top-3 size-3 border-l border-t border-signal" />
                <span className="pointer-events-none absolute bottom-3 right-3 size-3 border-b border-r border-signal" />
              </div>
            </ViewTransition>

            <figcaption className="mt-3 flex items-start justify-between gap-6 border-t border-line pt-3 text-sm text-slate">
              <span className="max-w-[58ch] leading-relaxed">
                {leadImage.caption ?? "Screenshot"}
              </span>
              <span className="shrink-0 font-display tabular-nums">
                Plate 01
              </span>
            </figcaption>
          </figure>
        )}

        {moreImages.length > 0 && (
          <div
            data-reveal-group
            className={
              moreImages.length > 1
                ? "mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2"
                : "mt-6 grid grid-cols-1 gap-6"
            }
          >
            {moreImages.map((image, imageIndex) => (
              <figure key={image.src} data-reveal>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-mist">
                  <Image
                    src={image.src}
                    alt={projectImageAlt(project, image)}
                    fill
                    sizes="(min-width: 768px) 46vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>

                <figcaption className="mt-3 flex items-start justify-between gap-6 border-t border-line pt-3 text-sm text-slate">
                  <span className="max-w-[58ch] leading-relaxed">
                    {image.caption ?? "Screenshot"}
                  </span>
                  <span className="shrink-0 font-display tabular-nums">
                    Plate {number(imageIndex + 2)}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {nextProject && (
          <nav
            aria-label="More work"
            className="mt-14 border-t border-line pt-8 md:mt-20 md:pt-10"
          >
            <div className="flex items-baseline justify-between gap-6">
              <p className="flex items-center gap-2.5 text-sm font-medium text-slate">
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 bg-signal"
                />
                Next in the register
              </p>
              <span
                aria-hidden="true"
                className="font-display text-sm tabular-nums text-slate"
              >
                {number(nextProject.rank)} / {number(rankedProjects.length)}
              </span>
            </div>

            <div className="group relative mt-5 grid grid-cols-1 items-start gap-x-6 gap-y-5 focus-within:outline focus-within:outline-2 focus-within:outline-signal focus-within:-outline-offset-2 lg:grid-cols-12">
              {nextImage ? (
                <div className="lg:col-span-6">
                  <ViewTransition
                    name={`project-${nextProject.slug}`}
                    share="morph"
                    default="none"
                  >
                    <ProjectThumb
                      project={nextProject}
                      sizes="(min-width: 1312px) 600px, (min-width: 1024px) 45vw, 100vw"
                      className="aspect-[16/10] w-full"
                    />
                  </ViewTransition>
                </div>
              ) : nextProject.scope ? (
                <ProjectScope
                  items={nextProject.scope}
                  className="aspect-[16/10] lg:col-span-6"
                />
              ) : null}

              <div className={nextHasVisual ? "min-w-0 lg:col-span-6" : "min-w-0 lg:col-span-12"}>
                <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] [overflow-wrap:anywhere]">
                  <Link
                    href={`/projects/${nextProject.slug}`}
                    transitionTypes={["nav-forward"]}
                    data-stretched-link
                    className="after:absolute after:inset-0 after:content-['']"
                  >
                    {nextProject.title}
                    <span className="sr-only">, next project note</span>
                  </Link>
                </h2>

                <ProjectMeta project={nextProject} className="mt-2" />

                <p className="mt-4 max-w-[48ch] font-serif text-lg leading-relaxed text-pretty text-slate">
                  {nextProject.description}
                </p>

                <p className="mt-5 inline-flex items-center gap-2 text-sm text-ink">
                  Open note
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </p>
              </div>
            </div>

            <p className="mt-8">
              <Link
                href="/work"
                transitionTypes={["nav-back"]}
                className="group inline-flex min-h-11 items-center gap-2 text-sm text-slate underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                Back to all work
              </Link>
            </p>
          </nav>
        )}
      </article>
    </ViewTransition>
  );
}
