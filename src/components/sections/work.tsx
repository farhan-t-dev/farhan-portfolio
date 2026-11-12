import { featuredProjects, rankedProjects } from "@/data/projects";
import { projectImageAlt, projectLeadImage } from "@/lib/project-media";
import { WorkIndex, type WorkIndexItem } from "@/components/ui/work-index";
import { Section } from "./section";

/**
 * Work — the proof, placed directly after the hero.
 *
 * The section is still an index, not a contact sheet: six ruled rows in
 * rank order, each opening its project note. What changed is that the
 * rows now inspect the work rather than merely describe it. A live plate
 * sits beside the list on desktop and registers to whichever row is
 * hovered or focused; on touch, each row carries a small still of its
 * own. The screenshots are resolved on the server through
 * `projectLeadImage`, so the client island only receives URLs.
 *
 * Renders nothing when nothing is featured: an unfinished data file
 * costs the homepage a section, not an empty band on the page.
 */
export function Work() {
  if (featuredProjects.length === 0) return null;

  const items: WorkIndexItem[] = featuredProjects.map((project) => {
    const image = projectLeadImage(project);

    return {
      project,
      image: image
        ? { src: image.src, alt: projectImageAlt(project, image) }
        : null,
    };
  });

  return (
    <Section id="work" label="Work">
      <WorkIndex items={items} total={rankedProjects.length} />
    </Section>
  );
}
