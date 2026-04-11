import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "./FadeIn";
import { CASE_STUDIES, type CaseStudy } from "@/lib/data/projects";

/* ── Section label (matches AboutSection style) ───────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="text-xs font-medium tracking-[0.2em] uppercase text-accent-hi whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-accent-hi/35 to-transparent" />
    </div>
  );
}

/* ── Kind badge ───────────────────────────────────────────────── */

function KindBadge({ kind }: { kind: CaseStudy["kind"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[0.15em] uppercase px-2.5 py-1 rounded-full ${
        kind === "design"
          ? "bg-accent/15 text-accent-hi border border-accent/30"
          : "bg-emerald-600/10 text-emerald-500 border border-emerald-600/25"
      }`}
    >
      {kind === "design" ? (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ) : (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
      )}
      {kind === "design" ? "Design Project" : "Research"}
    </span>
  );
}

/* ── Individual project card ──────────────────────────────────── */

function ProjectCard({ project }: { project: CaseStudy }) {
  const visibleTags = project.tags.slice(0, 3);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col rounded-2xl border border-rim/50 bg-card overflow-hidden
                 transition-all duration-300 hover:border-accent-hi/40 hover:shadow-lg hover:shadow-accent/8
                 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent-hi"
    >
      {/* Top accent bar — grows on hover */}
      <span className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-hi/50 to-transparent
                       scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-center" />

      <div className="flex flex-col gap-4 p-6 flex-1">
        {/* Kind + status row */}
        <div className="flex items-center justify-between gap-3">
          <KindBadge kind={project.kind} />
          <span className="text-[10px] font-sans text-ink-muted/50 tracking-wider">
            {project.date}
          </span>
        </div>

        {/* Title & subtitle */}
        <div>
          <h3 className="text-lg font-medium text-ink leading-snug group-hover:text-accent-hi transition-colors duration-200">
            {project.title}
          </h3>
          <p className="text-xs text-ink-muted/70 font-sans mt-1 leading-relaxed">
            {project.subtitle}
          </p>
        </div>

        {/* Summary — 2 line clamp */}
        <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
          {project.summary}
        </p>

        {/* Results headline — the headline metric */}
        <div className="rounded-lg border border-accent/25 bg-accent/8 px-4 py-3">
          <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-accent-hi/70 mb-1">
            Key Result
          </p>
          <p className="text-sm font-medium text-accent-hi leading-snug">
            {/* Strip LaTeX from results headline for plain display */}
            {project.results.headline.replace(/\$[^$]*\$/g, "…")}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-full border border-rim/60 text-ink-muted/70 bg-surface/50 font-medium"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-rim/40 text-ink-muted/40 font-medium">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* CTA footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-rim/40 bg-surface/30">
        <span className="text-xs font-medium text-ink-muted/60">
          Team of {project.teamSize} · {project.status}
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-accent-hi
                         translate-x-0 group-hover:translate-x-1 transition-transform duration-200">
          View Case Study
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/* ── Section ──────────────────────────────────────────────────── */

export function FeaturedProjects() {
  const designProjects = CASE_STUDIES.filter((p) => p.kind === "design");
  const researchProjects = CASE_STUDIES.filter((p) => p.kind === "research");

  return (
    <section className="max-w-5xl mx-auto w-full px-6 pb-10">
      <FadeIn>
        <SectionLabel>Featured Work</SectionLabel>
      </FadeIn>

      {/* Design projects */}
      <FadeIn>
        <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-ink-muted/40 mb-3">
          Design
        </p>
      </FadeIn>
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {designProjects.map((project) => (
          <StaggerItem key={project.slug}>
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Research projects */}
      <FadeIn>
        <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-ink-muted/40 mb-3">
          Research
        </p>
      </FadeIn>
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {researchProjects.map((project) => (
          <StaggerItem key={project.slug}>
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* "See all" link */}
      <FadeIn>
        <div className="flex justify-center mt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted/60
                       hover:text-accent-hi transition-colors duration-200 group"
          >
            <span>See all projects</span>
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
