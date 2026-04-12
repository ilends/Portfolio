import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import katex from "katex";
import { CASE_STUDIES, getCaseStudy, getPortfolioReferencesForCaseStudy } from "@/lib/data/projects";
import type { CaseStudy, Constraint, ProjectLink, ProjectReference, FdcrStrand } from "@/lib/data/projects";
import {
  getCtmfFigureIndexRanges,
  getGalleryTailIndexStart,
  getUnifiedCaseStudyImages,
} from "@/lib/caseStudyGallery";
import { FadeIn, StaggerContainer, StaggerItem } from "@/app/components/FadeIn";
import { ImageGallery } from "@/app/components/ImageGallery";
import { CaseStudyGalleryProvider, CaseStudyGalleryThumbs } from "@/app/components/CaseStudyGallery";

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
  const metaDescription = stripInlineMarkers(project.summary);
  const baseKeywords = [
    "Engineering Science",
    "University of Toronto",
    "Clinical Engineering",
    "Biomedical Design",
    "Emergency Medicine",
  ];
  return {
    title: project.title,
    description: metaDescription,
    keywords: [...project.tags, ...baseKeywords],
    openGraph: {
      type: "article",
      title: project.title,
      description: metaDescription,
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
      description: metaDescription,
      images: ["/android-chrome-512x512.png"],
    },
  };
}

/* ── Inline rich-text parser ───────────────────────────────────────
   Handles (in order): $$display$$  $inline$  **bold**  *italic*
   KaTeX renders server-side via dangerouslySetInnerHTML.
──────────────────────────────────────────────────────────────── */

type InlineTone = "default" | "gradientHighlight" | "emeraldHighlight" | "takeawaysHighlight";

/** CTMF ==phrase==: slate start → `--accent-hi` → `--accent-soft` (globals; steel/cornflower in light, blue-400 family in dark). */
const HIGHLIGHT_GRADIENT =
  "bg-gradient-to-r from-slate-500/78 via-[#5b8cc4]/88 to-[#6ea2e0]/90 bg-clip-text text-transparent dark:from-slate-300/88 dark:via-[#60a5fa]/88 dark:to-[#7eb3f0]/90";

/** Solid emerald for Results ==phrase== (headline + body): no bg-clip gradient banding in light mode. */
const EMERALD_HIGHLIGHT_SOLID =
  "text-emerald-800 dark:text-emerald-300";

/** Takeaways ==phrase==: solid sky (light-on-white gradients were low-contrast; dark stays readable). */
const TAKEAWAYS_HIGHLIGHT_SOLID =
  "text-sky-800 dark:text-sky-200";

/** Core inline: $$display$$ $inline$ **bold** *italic* (no == highlights). */
function parseInlineCore(text: string, tone: InlineTone = "default"): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\$\$([\s\S]+?)\$\$|\$(.+?)\$|\*\*(.+?)\*\*|\*(.+?)\*/g;
  let lastIndex = 0;
  let key = 0;
  const gh = tone === "gradientHighlight";
  const eh = tone === "emeraldHighlight";
  const th = tone === "takeawaysHighlight";
  const metricGrad = eh ? EMERALD_HIGHLIGHT_SOLID : th ? TAKEAWAYS_HIGHLIGHT_SOLID : HIGHLIGHT_GRADIENT;
  const strongClass =
    gh || eh || th ? `font-semibold ${metricGrad}` : "font-medium text-ink";
  const emClass = gh || eh || th ? `italic ${metricGrad}` : "italic";

  const pushPlain = (slice: string) => {
    if (!slice) return;
    if (gh || eh || th) {
      parts.push(
        <span key={key++} className={metricGrad}>
          {slice}
        </span>
      );
    } else {
      parts.push(slice);
    }
  };

  for (const match of text.matchAll(regex)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) pushPlain(text.slice(lastIndex, idx));

    if (match[1] !== undefined) {
      const html = katex.renderToString(match[1].trim(), { throwOnError: false, displayMode: true });
      parts.push(
        <span key={key++} className="block my-3 overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: html }} />
      );
    } else if (match[2] !== undefined) {
      const html = katex.renderToString(match[2], { throwOnError: false, displayMode: false });
      parts.push(<span key={key++} dangerouslySetInnerHTML={{ __html: html }} />);
    } else if (match[3] !== undefined) {
      parts.push(<strong key={key++} className={strongClass}>{match[3]}</strong>);
    } else {
      parts.push(<em key={key++} className={emClass}>{match[4]}</em>);
    }
    lastIndex = idx + match[0].length;
  }

  if (lastIndex < text.length) pushPlain(text.slice(lastIndex));
  return <>{parts}</>;
}

type ParseInlineOptions = {
  highlight?: boolean;
  /** CTMF accent gradient · `emerald` / `takeaways` solid highlights (readable on light backgrounds). */
  highlightGradient?: "accent" | "emerald" | "takeaways";
};

/**
 * Inline rich text. Optional `highlight`: wrap phrases in ==double equals== (CTMF bodies or Results metrics).
 */
function parseInline(text: string, options?: ParseInlineOptions): React.ReactNode {
  if (!options?.highlight) {
    return parseInlineCore(text);
  }

  const hlTone: InlineTone =
    options.highlightGradient === "emerald"
      ? "emeraldHighlight"
      : options.highlightGradient === "takeaways"
        ? "takeawaysHighlight"
        : "gradientHighlight";

  const parts: React.ReactNode[] = [];
  const re = /==([\s\S]+?)==/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(<span key={key++}>{parseInlineCore(text.slice(last, m.index))}</span>);
    }
    parts.push(
      <span key={key++} className="inline font-semibold">
        {parseInlineCore(m[1], hlTone)}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    parts.push(<span key={key++}>{parseInlineCore(text.slice(last))}</span>);
  }
  if (parts.length === 0) {
    return parseInlineCore(text);
  }
  return <>{parts}</>;
}

/** Strip ==highlights== and *italic* / **bold** markers for Open Graph and meta descriptions. */
function stripInlineMarkers(text: string): string {
  return text
    .replace(/==([\s\S]+?)==/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

/* ── ProseBlock ────────────────────────────────────────────────────
   Paragraphs separated by \n\n.
   • Standalone $$...$$ paragraph → display math block.
   • Lines starting with • → styled bullet list.
   • Everything else → parseInline (bold, italic, $math$).
   • variant="ctmf": slightly larger type; ==phrase== → accent gradient (CTMF bodies).
   • variant="results": ==phrase== → solid emerald (key metrics). Do not wrap metrics in $…$ inside ==…== — that runs KaTeX and breaks styling.
   • variant="takeaways": ==phrase== → solid sky; paragraph spacing for long blocks.
──────────────────────────────────────────────────────────────── */

function ProseBlock({
  text,
  variant = "default",
}: {
  text: string;
  variant?: "default" | "ctmf" | "results" | "takeaways";
}) {
  const paragraphs = text.split("\n\n");
  const ctmf = variant === "ctmf";
  const results = variant === "results";
  const takeaways = variant === "takeaways";
  const inlineOpts: ParseInlineOptions | undefined = ctmf
    ? { highlight: true, highlightGradient: "accent" }
    : results
      ? { highlight: true, highlightGradient: "emerald" }
      : takeaways
        ? { highlight: true, highlightGradient: "takeaways" }
        : undefined;
  const bodyClass = ctmf
    ? "text-[1.075rem] leading-relaxed text-ink-muted"
    : takeaways
      ? "text-[1.05rem] leading-[1.8] text-ink-muted"
      : "text-base text-ink-muted leading-relaxed";

  const outerSpace = takeaways ? "" : "space-y-4";

  return (
    <div className={`${outerSpace} ${bodyClass}`.trim()}>
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
            <p
              key={i}
              className={
                takeaways && i > 0 ? "mt-6 border-t border-rim/35 pt-6" : undefined
              }
            >
              {parseInline(para, inlineOpts)}
            </p>
          );
        }

        return (
          <div key={i} className="space-y-1.5">
            {leadText && (
              <p className="leading-relaxed">{parseInline(leadText, inlineOpts)}</p>
            )}
            <ul className="space-y-1.5 pl-1">
              {bulletLines.map((line, j) => (
                <li key={j} className="flex items-start gap-2.5 text-ink-muted leading-relaxed">
                  <span aria-hidden className="mt-2 w-1.5 h-1.5 rounded-full bg-accent-hi/60 shrink-0" />
                  <span>{parseInline(line.replace(/^[•\s]+/, ""), inlineOpts)}</span>
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
    <div className="flex w-full min-w-0 items-center gap-4 mb-5">
      <span className="text-xs font-medium tracking-[0.2em] uppercase text-accent-hi whitespace-nowrap shrink-0">
        {children}
      </span>
      <div className="min-w-0 flex-1 h-px bg-gradient-to-r from-accent-hi/35 to-transparent" />
    </div>
  );
}

/** IEEE-style list for design case studies; sits above the academic integrity footer. */
function DesignReferencesSection({
  items,
  label,
}: {
  items: readonly { index: number; ref: ProjectReference }[];
  label: string;
}) {
  return (
    <section className="scroll-mt-4" aria-label={label}>
      <SectionLabel>{label}</SectionLabel>
      <div className="rounded-xl border border-rim/40 bg-card/20 px-5 py-4 sm:px-6 sm:py-5">
        {items.length > 0 ? (
          <ul className="list-none space-y-3 m-0 p-0">
            {items.map(({ index, ref }) => (
              <li key={index} className="text-sm leading-relaxed text-ink-muted font-sans pl-0">
                <span className="text-ink/85 font-medium tabular-nums">[{index}]</span>{" "}
                <span>{ref.ieee}</span>
                {ref.href ? (
                  <>
                    {" "}
                    <a
                      href={ref.href}
                      className="text-accent-hi underline decoration-accent-hi/40 underline-offset-2 hover:decoration-accent-hi whitespace-nowrap"
                    >
                      PDF
                    </a>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-muted font-sans leading-relaxed m-0">
            Course and deliverable references in IEEE format will be listed here.
          </p>
        )}
        {items.length > 0 ? (
          <p className="text-xs text-ink-muted/85 font-sans mt-4 mb-0 leading-snug">
            Numbers match the{" "}
            <Link
              href="/projects/references"
              className="text-accent-hi underline decoration-accent-hi/40 underline-offset-2 hover:decoration-accent-hi"
            >
              full portfolio reference list
            </Link>
            .
          </p>
        ) : null}
      </div>
    </section>
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
    gallery: "Additional photos",
    takeaways: "Takeaways & position in context",
    ctmfSection: "Design process (CTMFs)",
    references: "References",
    /** Eyebrow above the condensed summary band (problem → constraints → results). */
    summaryBandEyebrow: "At a glance (one-pager)",
    /** Eyebrow above takeaways, CTMFs, iterations, and other process content. */
    detailBandEyebrow: "Process, tools & reflection",
  },
  research: {
    problem: "Objective",
    constraints: "Key Parameters",
    design: "Methodology",
    iterations: "Process",
    testing: "Analysis",
    results: "Findings",
    gallery: "Additional photos",
    takeaways: "Takeaways & position",
    ctmfSection: "CTMFs in context",
    references: "References",
    summaryBandEyebrow: "At a glance (one-pager)",
    detailBandEyebrow: "Methodology & reflection",
  },
} as const;

const FDCR_BADGE: Record<
  FdcrStrand,
  { label: string; className: string }
> = {
  Frame: {
    label: "Frame",
    className:
      "border-sky-500/50 bg-sky-500/15 text-sky-900 dark:border-sky-500/45 dark:bg-sky-500/[0.12] dark:text-sky-200/95",
  },
  Diverge: {
    label: "Diverge",
    className:
      "border-violet-500/50 bg-violet-500/15 text-violet-900 dark:border-violet-500/45 dark:bg-violet-500/[0.12] dark:text-violet-200/95",
  },
  Converge: {
    label: "Converge",
    className:
      "border-amber-500/55 bg-amber-500/18 text-amber-950 dark:border-amber-500/45 dark:bg-amber-500/[0.12] dark:text-amber-100/95",
  },
  Represent: {
    label: "Represent",
    className:
      "border-teal-500/50 bg-teal-500/15 text-teal-900 dark:border-teal-500/45 dark:bg-teal-500/[0.12] dark:text-teal-200/95",
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

/** Same emerald headline + results prose treatment as the "At a glance" Results block (CIV102 / Praxis II). */
function ResultsEmphasisCard({ headline, body }: { headline: string; body: string }) {
  return (
    <div className="ecg-panel rounded-xl border border-emerald-600/30 bg-emerald-600/[0.06] relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-emerald-600/85 via-emerald-500/45 to-transparent" />
      <div className="pl-6 sm:pl-8 pr-5 sm:pr-7 py-6 flex flex-col gap-4">
        <p
          className="text-xl sm:text-2xl font-medium text-ink/90 leading-snug dark:[text-shadow:0_0_24px_rgba(16,185,129,0.08)]"
        >
          {parseInline(headline, { highlight: true, highlightGradient: "emerald" })}
        </p>
        <ProseBlock text={body} variant="results" />
      </div>
    </div>
  );
}

/* ── Case study body: summary band (results → constraints → problem), then process & reflection ─ */

function CaseStudyNarrativeBody({
  project,
  L,
  ctmfFigureRanges,
  unifiedGallery = false,
}: {
  project: CaseStudy;
  L: CaseStudyLabels;
  /** Global indices into `getUnifiedCaseStudyImages(project)` for each CTMF’s inline figures. */
  ctmfFigureRanges?: { start: number; count: number }[];
  /** When true, inline CTMF thumbs use the shared case-study lightbox (same order as the gallery strip). */
  unifiedGallery?: boolean;
}) {
  const positionImpact = project.positionImpact?.trim();
  const lessonsText = project.lessons?.trim();
  const combinedTakeaways = [positionImpact, lessonsText].filter(Boolean).join("\n\n");
  const hasCtmfs = Boolean(project.ctmfs?.length);
  /** Methodology lives in CTMF blocks when present; otherwise keep the standalone Design / Methodology section. */
  const showStandaloneDesign =
    Boolean(project.design?.trim()) && !project.ctmfs?.length;

  const hasDetailSections =
    Boolean(combinedTakeaways) ||
    showStandaloneDesign ||
    hasCtmfs ||
    Boolean(project.iterations?.trim()) ||
    Boolean(project.testing);

  return (
    <>
      {/* ── One-pager style summary: outcomes → limits → framing (matches portfolio “summarized” / showcase one-pager intent) ─ */}
      <FadeIn delay={0.04}>
        <section
          className="rounded-2xl border border-rim/50 bg-gradient-to-b from-card/[0.45] to-card/[0.2] px-5 py-7 sm:px-8 sm:py-9 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]"
          aria-label="Project summary"
        >
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-accent-hi/90 mb-8">
            {L.summaryBandEyebrow}
          </p>
          <div className="flex flex-col gap-10 sm:gap-12">
            <div>
              <SectionLabel>{L.results}</SectionLabel>
              <ResultsEmphasisCard headline={project.results.headline} body={project.results.body} />
            </div>

            <div>
              <SectionLabel>{L.constraints}</SectionLabel>
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {project.constraints.map((c) => (
                  <StaggerItem key={c.label}>
                    <ConstraintCard constraint={c} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            <div>
              <SectionLabel>{L.problem}</SectionLabel>
              <ProseBlock text={project.problem} />
            </div>
          </div>
        </section>
      </FadeIn>

      {hasDetailSections && (
        <div className="flex flex-col gap-10 sm:gap-12 pt-2">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ink-muted/75 px-0.5 -mb-2">
            {L.detailBandEyebrow}
          </p>

      {combinedTakeaways && (
        <FadeIn>
          <section>
            <SectionLabel>{L.takeaways}</SectionLabel>
            <div className="ecg-panel rounded-xl border border-accent/30 bg-accent/[0.04] relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent-hi/70 via-accent-hi/30 to-transparent" />
              <div className="pl-6 sm:pl-8 pr-5 sm:pr-7 py-6">
                <ProseBlock text={combinedTakeaways} variant="takeaways" />
              </div>
            </div>
          </section>
        </FadeIn>
      )}

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
            <div className="w-full">
              <SectionLabel>{L.ctmfSection}</SectionLabel>
              {project.kind === "design" && (
                <p className="w-full text-xs text-ink-muted/90 font-sans leading-relaxed -mt-2 mb-1 border-l-2 border-accent-hi/30 pl-3 pr-1">
                  CTMF names and working definitions follow{" "}
                  <span className="font-medium text-ink/85">Praxis I and II</span> lecture materials (slides), except where the
                  narrative notes a different source.
                </p>
              )}
            </div>
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
                    </h2>
                    <FdcrBadge strand={ctmf.fdcr} />
                  </div>
                  {ctmf.application != null && ctmf.assessment != null ? (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-700/85 dark:text-emerald-400/90 mb-2.5">
                          Application
                        </h3>
                        <ProseBlock text={ctmf.application} variant="ctmf" />
                      </div>
                      <div>
                        <h3 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-700/85 dark:text-emerald-400/90 mb-2.5">
                          Assessment
                        </h3>
                        <ProseBlock text={ctmf.assessment} variant="ctmf" />
                      </div>
                    </div>
                  ) : (
                    <ProseBlock text={ctmf.body ?? ""} variant="ctmf" />
                  )}
                  {ctmf.figures && ctmf.figures.length > 0 ? (
                    <div className="mt-4 border-t border-rim/30 pt-4">
                      {unifiedGallery && ctmfFigureRanges?.[i] && ctmfFigureRanges[i].count > 0 ? (
                        <CaseStudyGalleryThumbs
                          compact
                          indices={Array.from({ length: ctmfFigureRanges[i].count }, (_, j) => ctmfFigureRanges[i].start + j)}
                        />
                      ) : (
                        <ImageGallery images={[...ctmf.figures]} compact />
                      )}
                    </div>
                  ) : null}
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
        </div>
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
  const unifiedGalleryImages = getUnifiedCaseStudyImages(project);
  const ctmfFigureRanges = getCtmfFigureIndexRanges(project);
  const galleryTailIndexStart = getGalleryTailIndexStart(project);

  const caseStudyMain = (
      <div className="flex flex-col gap-12">
        <CaseStudyNarrativeBody
          project={project}
          L={L}
          ctmfFigureRanges={ctmfFigureRanges}
          unifiedGallery={unifiedGalleryImages.length > 0}
        />
        {hasGallery && project.images && (
          <FadeIn>
            <section>
              <SectionLabel>{L.gallery}</SectionLabel>
              {unifiedGalleryImages.length > 0 ? (
                <CaseStudyGalleryThumbs
                  indices={project.images.map((_, i) => galleryTailIndexStart + i)}
                />
              ) : (
                <ImageGallery images={project.images} />
              )}
            </section>
          </FadeIn>
        )}
      </div>
  );

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
          <p className="text-lg text-ink-muted leading-relaxed">{project.summary}</p>

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

      {unifiedGalleryImages.length > 0 ? (
        <CaseStudyGalleryProvider images={unifiedGalleryImages}>{caseStudyMain}</CaseStudyGalleryProvider>
      ) : (
        caseStudyMain
      )}

      {project.kind === "design" && (
        <FadeIn>
          <DesignReferencesSection
            items={getPortfolioReferencesForCaseStudy(project)}
            label={LABELS.design.references}
          />
        </FadeIn>
      )}

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
