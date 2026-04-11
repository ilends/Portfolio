import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import katex from "katex";
import { CASE_STUDIES, getCaseStudy } from "@/lib/data/projects";
import type { CaseStudy, Constraint, ProjectLink, FdcrStrand } from "@/lib/data/projects";
import { FadeIn, StaggerContainer, StaggerItem } from "@/app/components/FadeIn";
import { ImageGallery } from "@/app/components/ImageGallery";

/* ── generateStaticParams ──────────────────────────────────────── */

export function generateStaticParams() {
  return CASE_STUDIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getCaseStudy(slug);
  if (!project) return { title: "Not Found" };
  const baseKeywords = [
    "Engineering Science",
    "University of Toronto",
    "Clinical Engineering",
    "Biomedical Design",
    "Emergency Medicine",
  ];
  return {
    title: project.title,
    description: project.summary,
    keywords: [...project.tags, ...baseKeywords],
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: `https://davidangelo.ca/projects/${project.slug}`,
      siteName: "David Angelo",
      images: [
        {
          url: "/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: `${project.title} · engineering case study`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: ["/android-chrome-512x512.png"],
    },
  };
}

/* ── Inline rich-text parser ───────────────────────────────────────
   Handles (in order): $$display$$  $inline$  **bold**  *italic*
   KaTeX renders server-side via dangerouslySetInnerHTML.
──────────────────────────────────────────────────────────────── */

function parseInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\$\$([\s\S]+?)\$\$|\$(.+?)\$|\*\*(.+?)\*\*|\*(.+?)\*/g;
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(regex)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) parts.push(text.slice(lastIndex, idx));

    if (match[1] !== undefined) {
      const html = katex.renderToString(match[1].trim(), { throwOnError: false, displayMode: true });
      parts.push(
        <span key={key++} className="block my-3 overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: html }} />
      );
    } else if (match[2] !== undefined) {
      const html = katex.renderToString(match[2], { throwOnError: false, displayMode: false });
      parts.push(<span key={key++} dangerouslySetInnerHTML={{ __html: html }} />);
    } else if (match[3] !== undefined) {
      parts.push(<strong key={key++} className="font-medium text-ink">{match[3]}</strong>);
    } else {
      parts.push(<em key={key++} className="italic">{match[4]}</em>);
    }
    lastIndex = idx + match[0].length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <>{parts}</>;
}

/* ── ProseBlock ────────────────────────────────────────────────────
   Paragraphs separated by \n\n.
   • Standalone $$...$$ paragraph → display math block.
   • Lines starting with • → styled bullet list.
   • Everything else → parseInline (bold, italic, $math$).
──────────────────────────────────────────────────────────────── */

function ProseBlock({ text }: { text: string }) {
  const paragraphs = text.split("\n\n");

  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();

        /* Standalone display-math block */
        const displayMatch = trimmed.match(/^\$\$([\s\S]+?)\$\$$/);
        if (displayMatch) {
          const html = katex.renderToString(displayMatch[1].trim(), { throwOnError: false, displayMode: true });
          return (
            <div key={i} className="overflow-x-auto py-2" dangerouslySetInnerHTML={{ __html: html }} />
          );
        }

        const lines = para.split("\n");
        const bulletLines = lines.filter((l) => l.trimStart().startsWith("•"));
        const leadText = lines.filter((l) => !l.trimStart().startsWith("•")).join(" ").trim();

        if (bulletLines.length === 0) {
          return (
            <p key={i} className="text-base text-ink-muted leading-relaxed">
              {parseInline(para)}
            </p>
          );
        }

        return (
          <div key={i} className="space-y-1.5">
            {leadText && (
              <p className="text-base text-ink-muted leading-relaxed">{parseInline(leadText)}</p>
            )}
            <ul className="space-y-1.5 pl-1">
              {bulletLines.map((line, j) => (
                <li key={j} className="flex items-start gap-2.5 text-base text-ink-muted leading-relaxed">
                  <span aria-hidden className="mt-2 w-1.5 h-1.5 rounded-full bg-accent-hi/60 shrink-0" />
                  <span>{parseInline(line.replace(/^[•\s]+/, ""))}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ── Shared UI primitives ─────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span className="text-xs font-medium tracking-[0.2em] uppercase text-accent-hi whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-accent-hi/35 to-transparent" />
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 text-sm font-medium rounded-full border border-accent/35 text-accent-hi bg-accent/10">
      {label}
    </span>
  );
}

/* ── Link buttons ─────────────────────────────────────────────── */

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}
function PdfIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  );
}
function ExternalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function ProjectLinkButton({ link }: { link: ProjectLink }) {
  const Icon =
    link.type === "github" ? GithubIcon : link.type === "pdf" ? PdfIcon : ExternalIcon;
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-accent/40 text-accent-hi bg-accent/10 hover:bg-accent/20 hover:border-accent-hi/50 transition-colors"
    >
      <Icon />
      {link.label}
    </a>
  );
}

/* ── Metric / constraint card ─────────────────────────────────── */

function ConstraintCard({ constraint }: { constraint: Constraint }) {
  return (
    <div className="ecg-panel rounded-xl border border-rim/50 bg-card p-5 flex flex-col gap-1 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-hi/50 via-accent-hi/20 to-transparent" />
      <p className="text-xs font-medium tracking-[0.15em] uppercase text-ink-muted mb-1">
        {constraint.label}
      </p>
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className="font-sans text-2xl font-medium text-accent-hi leading-none">
          {constraint.value}
        </span>
        <span className="font-sans text-sm text-ink-muted">{constraint.unit}</span>
      </div>
      {constraint.rationale && (
        <p className="text-xs text-ink-muted mt-2 leading-relaxed">
          {parseInline(constraint.rationale)}
        </p>
      )}
    </div>
  );
}

/* ── Section label map (design vs research) ───────────────────── */

const LABELS = {
  design: {
    problem: "The Problem",
    constraints: "Engineering Constraints",
    design: "Design",
    iterations: "Iterations",
    testing: "Testing",
    results: "Results",
    gallery: "Visual evidence",
    takeaways: "Takeaways & position in context",
    ctmfSection: "Design process: concepts, tools, models, and frameworks",
  },
  research: {
    problem: "Objective",
    constraints: "Key Parameters",
    design: "Methodology",
    iterations: "Process",
    testing: "Analysis",
    results: "Findings",
    gallery: "Visual evidence",
    takeaways: "Takeaways & position",
    ctmfSection: "Concepts, tools, models, and frameworks",
  },
} as const;

const FDCR_BADGE: Record<
  FdcrStrand,
  { label: string; className: string }
> = {
  Frame: {
    label: "Frame",
    className:
      "border-sky-500/45 bg-sky-500/[0.12] text-sky-200/95",
  },
  Diverge: {
    label: "Diverge",
    className:
      "border-violet-500/45 bg-violet-500/[0.12] text-violet-200/95",
  },
  Converge: {
    label: "Converge",
    className:
      "border-amber-500/45 bg-amber-500/[0.12] text-amber-100/95",
  },
  Represent: {
    label: "Represent",
    className:
      "border-teal-500/45 bg-teal-500/[0.12] text-teal-200/95",
  },
};

function FdcrBadge({ strand }: { strand: FdcrStrand }) {
  const b = FDCR_BADGE[strand];
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase font-sans ${b.className}`}
      title={`FDCR strand: ${b.label}`}
    >
      {b.label}
    </span>
  );
}

type CaseStudyLabels = (typeof LABELS)[keyof typeof LABELS];

/* ── Case study body: Results → takeaways (position + lessons merged) → problem → … ─ */

function CaseStudyNarrativeBody({
  project,
  L,
}: {
  project: CaseStudy;
  L: CaseStudyLabels;
}) {
  const positionImpact = project.positionImpact?.trim();
  const lessonsText = project.lessons?.trim();
  const combinedTakeaways = [positionImpact, lessonsText].filter(Boolean).join("\n\n");
  const hasCtmfs = Boolean(project.ctmfs?.length);
  /** Methodology lives in CTMF blocks when present; otherwise keep the standalone Design / Methodology section. */
  const showStandaloneDesign =
    Boolean(project.design?.trim()) && !project.ctmfs?.length;

  return (
    <>
      <FadeIn delay={0.04}>
        <section>
          <SectionLabel>{L.results}</SectionLabel>
          <div className="ecg-panel rounded-xl border border-emerald-600/30 bg-emerald-600/[0.06] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-emerald-600/85 via-emerald-500/45 to-transparent" />
            <div className="pl-6 sm:pl-8 pr-5 sm:pr-7 py-6 flex flex-col gap-4">
              <p
                className="text-xl sm:text-2xl font-medium text-emerald-500 leading-snug"
                style={{ textShadow: "0 0 28px rgba(96,165,250,0.1)" }}
              >
                {parseInline(project.results.headline)}
              </p>
              <ProseBlock text={project.results.body} />
            </div>
          </div>
        </section>
      </FadeIn>

      {combinedTakeaways && (
        <FadeIn>
          <section>
            <SectionLabel>{L.takeaways}</SectionLabel>
            <div className="ecg-panel rounded-xl border border-accent/30 bg-accent/[0.04] relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent-hi/70 via-accent-hi/30 to-transparent" />
              <div className="pl-6 sm:pl-8 pr-5 sm:pr-7 py-6">
                <ProseBlock text={combinedTakeaways} />
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      <FadeIn>
        <section>
          <SectionLabel>{L.problem}</SectionLabel>
          <ProseBlock text={project.problem} />
        </section>
      </FadeIn>

      <FadeIn>
        <section>
          <SectionLabel>{L.constraints}</SectionLabel>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {project.constraints.map((c) => (
              <StaggerItem key={c.label}>
                <ConstraintCard constraint={c} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </FadeIn>

      {showStandaloneDesign && project.design && (
        <FadeIn>
          <section>
            <SectionLabel>{L.design}</SectionLabel>
            <ProseBlock text={project.design} />
          </section>
        </FadeIn>
      )}

      {hasCtmfs && project.ctmfs && (
        <FadeIn>
          <section className="flex flex-col gap-8">
            <SectionLabel>{L.ctmfSection}</SectionLabel>
            <div className="flex flex-col gap-8">
              {project.ctmfs.map((ctmf, i) => (
                <div
                  key={`${ctmf.title}-${i}`}
                  className="ecg-panel rounded-xl border border-rim/50 bg-card/50 p-6 sm:p-7 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-hi/45 via-accent-hi/15 to-transparent" />
                  <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-4 sm:gap-y-2">
                    <h2 className="text-lg sm:text-xl font-medium text-ink tracking-tight leading-snug max-w-[min(100%,42rem)]">
                      {ctmf.title}
                      <span className="text-ink-muted font-normal"> · {ctmf.category}</span>
                    </h2>
                    <FdcrBadge strand={ctmf.fdcr} />
                  </div>
                  <ProseBlock text={ctmf.body} />
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {project.iterations?.trim() && (
        <FadeIn>
          <section>
            <SectionLabel>{L.iterations}</SectionLabel>
            <ProseBlock text={project.iterations} />
          </section>
        </FadeIn>
      )}

      {project.testing && (
        <FadeIn>
          <section>
            <SectionLabel>{L.testing}</SectionLabel>
            <ProseBlock text={project.testing} />
          </section>
        </FadeIn>
      )}
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getCaseStudy(slug);
  if (!project) notFound();

  const L = LABELS[project.kind];
  const hasGallery = Boolean(project.images?.length);

  return (
    <main className="mx-auto max-w-6xl px-6 xl:px-8 pt-28 pb-28 flex flex-col gap-12">

      {/* ── Back navigation ──────────────────────────────────── */}
      <FadeIn>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-accent-hi transition-colors group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Projects
        </Link>
      </FadeIn>

      {/* ── Header ───────────────────────────────────────────── */}
      <FadeIn delay={0.04}>
        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-sm text-ink-muted">
            <span>{project.date}</span>
            <span className="text-rim">·</span>
            {project.teamSize > 1 ? (
              <span>Team of {project.teamSize}</span>
            ) : (
              <span>Individual</span>
            )}
            <span className="text-rim">·</span>
            <span className={`inline-flex items-center gap-1.5 ${project.status === "Completed" ? "text-emerald-500" : "text-accent-hi"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${project.status === "Completed" ? "bg-emerald-500" : "bg-accent-hi animate-pulse"}`} />
              {project.status}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-medium text-ink tracking-tight leading-tight">
            {project.title}
          </h1>
          <p className="text-base font-sans text-ink-muted">{project.subtitle}</p>
          <p className="text-lg text-ink-muted leading-relaxed">
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => <Tag key={t} label={t} />)}
          </div>

          {project.ctmfs && project.ctmfs.length > 0 && (
            <div className="rounded-lg border border-accent/25 bg-accent/[0.04] px-3 py-2.5 sm:px-4 sm:py-3">
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-accent-hi/90 mb-1">
                CTMFs
              </p>
              <p className="text-xs sm:text-sm text-ink-muted leading-snug font-sans">
                {project.ctmfs.map((c) => c.title).join(" · ")}
              </p>
            </div>
          )}

          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-1">
              {project.links.map((link) => (
                <ProjectLinkButton key={link.href} link={link} />
              ))}
            </div>
          )}

          <div className="h-px bg-gradient-to-r from-accent-hi/30 via-rim/40 to-transparent mt-1" />
        </header>
      </FadeIn>

      <div className="flex flex-col gap-12">
        <CaseStudyNarrativeBody project={project} L={L} />
        {hasGallery && project.images && (
          <FadeIn>
            <section>
              <SectionLabel>{L.gallery}</SectionLabel>
              <ImageGallery images={project.images} />
            </section>
          </FadeIn>
        )}
      </div>

      <FadeIn>
        <footer
          className="mt-4 rounded-xl border border-rim/40 bg-card/30 px-5 py-5 sm:px-6 sm:py-6"
          aria-label="Academic integrity and teammate attribution"
        >
          {project.teamSize > 1 ? (
            <p className="text-sm leading-relaxed text-ink-muted font-sans">
              As per the{" "}
              <a
                href="https://governingcouncil.utoronto.ca/secretariat/policies/code-behaviour-academic-matters"
                className="text-accent-hi underline decoration-accent-hi/40 underline-offset-2 hover:decoration-accent-hi"
                target="_blank"
                rel="noopener noreferrer"
              >
                University of Toronto Code of Academic Behaviour
              </a>{" "}
              and the Professional Engineers Ontario Code of Ethics, I acknowledge that this project was completed as part of a team. I attribute shared design
              work, analysis, prototyping, testing, and documentation that were not solely my own to my
              teammates:{" "}
              {project.teammates && project.teammates.length > 0 ? (
                project.teammates.map((name, i) => (
                  <span key={`${name}-${i}`}>
                    {i > 0 && ", "}
                    <span className="text-ink/90 font-medium">{name}</span>
                  </span>
                ))
              ) : (
                <>
                  <span className="text-ink/90 font-medium">[Name 1]</span>,{" "}
                  <span className="text-ink/90 font-medium">[Name 2]</span>,{" "}
                  <span className="text-ink/90 font-medium">[Name X]</span>
                </>
              )}
              .
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-ink-muted font-sans">
              As per the{" "}
              <a
                href="https://governingcouncil.utoronto.ca/secretariat/policies/code-behaviour-academic-matters"
                className="text-accent-hi underline decoration-accent-hi/40 underline-offset-2 hover:decoration-accent-hi"
                target="_blank"
                rel="noopener noreferrer"
              >
                University of Toronto Code of Academic Behaviour
              </a>{" "}
              and the Professional Engineers Ontario Code of Ethics, I confirm that this project was completed individually and that the work described here is my
              own except where outside sources are cited.
            </p>
          )}
        </footer>
      </FadeIn>

    </main>
  );
}
