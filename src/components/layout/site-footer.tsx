import { site } from "@/data/site";
import { ArrowUp } from "@/components/ui/icons";

/**
 * Site footer: a copyright line + a self-referential colophon.
 *
 * Profile links (GitHub, LinkedIn) live in the Contact section only —
 * repeating them here made the footer a second nav with no added value.
 *
 * The colophon is deliberate proof-of-work for the agency and employer
 * audience: the site names its own stack honestly, and is itself a
 * polished, accessible Next.js build. Server component.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-mist">
      <div className="shell gutter flex flex-col gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
        <p className="text-sm text-slate">
          © {year} {site.name}
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
          <p className="text-sm text-slate">
            Built with Next.js, React and Tailwind CSS
          </p>

          <a
            href="#top"
            className="group inline-flex min-h-11 items-center gap-2 text-sm text-slate underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Top
            <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="sr-only"> of page</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
