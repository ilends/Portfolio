import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { AccentGlow } from "../components/AccentGlow";
import { FadeIn, StaggerContainer, StaggerItem } from "../components/FadeIn";

export const metadata: Metadata = {
  title: "Projects",
  description: "Engineering design projects and mathematical research by David Angelo — structural analysis, signal processing, medical device design, and mathematical modelling.",
  keywords: [
    "Engineering Science",
    "University of Toronto",
    "Clinical Engineering",
    "Biomedical Design",
    "Medical Device Design",
    "Structural Analysis",
  ],
};

/* ── Types ────────────────────────────────────────────────────── */

type Status = "Completed" | "In Progress" | "Planned";

type Project = {
  title: string;
  subtitle?: string;
  date?: string;
  description: React.ReactNode;
  tags: string[];
  /** Three Praxis CTMFs for design case studies (optional for research cards). */
  ctmfs?: readonly [string, string, string];
  status: Status;
  featured?: boolean;
  slug?: string;
  /** Big mono number on the card (e.g. chronological ref order); defaults to grid position. */
  cardIndex?: number;
};

/* ── Data ─────────────────────────────────────────────────────── */

const DESIGN_PROJECTS: Project[] = [
  {
    title: "RipTune: Variable Resistance for Swimmers",
    subtitle: "Praxis II · ESC102 · University of Toronto",
    date: "Winter 2026",
    description: (
      <>
        Delivered <AccentGlow>RipTune</AccentGlow>, a come-along winch that clips to starting blocks to add{" "}
        <AccentGlow>variable swim resistance</AccentGlow> in the MSSAC HP team&apos;s training. Proxy testing yielded{" "}
        <AccentGlow>412 N/m</AccentGlow>, <AccentGlow>7.87 s</AccentGlow> average setup, and a{" "}
        <AccentGlow>0 to 824 N</AccentGlow> continuous resistance envelope.
      </>
    ),
    tags: ["Engineering Design", "Human Factors", "Verification & Validation", "Stakeholder Engagement"],
    ctmfs: ["Working environment analysis", "Verification vs. validation", "Signal-to-noise ratio"],
    status: "Completed",
    featured: true,
    slug: "esc102-riptune",
    cardIndex: 3,
  },
  {
    title: "CIV102 Bridge Design Project",
    subtitle: "CIV102 · University of Toronto",
    description: (
      <>
        Built a simply-supported matboard box-girder bridge in a team of{" "}
        <AccentGlow>4</AccentGlow> across <AccentGlow>5</AccentGlow> major iterations guided by a Python structural
        analysis pipeline evaluating <AccentGlow>8</AccentGlow> failure modes. Final design
        achieved a minimum factor of safety of <AccentGlow>2.49</AccentGlow> under Load Case 2
        (<AccentGlow>452 N</AccentGlow>) with compression governing the failure mode.
      </>
    ),
    date: "Fall 2025",
    tags: ["Python", "Structural Engineering", "Statics", "Safety Analysis"],
    ctmfs: ["Iteration and refinement", "Trade-offs", "CAD (Onshape)"],
    status: "Completed",
    slug: "civ102-matboard-bridge",
    cardIndex: 2,
  },
  {
    title: "Doffing Glove Removal Device",
    subtitle: "ESC101 · Praxis I · University of Toronto",
    description: (
      <>
        Developed <AccentGlow>5</AccentGlow> prototype concepts (Hook, Slicer, Tape, Air Blower,
        Water Pump) in a team of <AccentGlow>5</AccentGlow> for safe vinyl glove removal. Converged
        on a tape-tab system via Pugh chart analysis and a 10-student survey —
        achieving a contact rate of <AccentGlow>5 %</AccentGlow> (down from <AccentGlow>37 %</AccentGlow>), doffing
        time of <AccentGlow>8.82 s</AccentGlow>, and device mass of just <AccentGlow>0.5 g</AccentGlow>.
      </>
    ),
    date: "Fall 2025",
    tags: ["Verification", "Human Factors", "Iterative Prototyping", "Ergonomics"],
    ctmfs: ["Needs → Goals → Objectives (NGO)", "Morphological charts", "Decision matrices"],
    status: "Completed",
    slug: "glove-doffing-device",
    cardIndex: 1,
  },
];

const RESEARCH_PROJECTS: Project[] = [
  {
    title: "Biomedical Engineering Research",
    subtitle: "Targeting Research Hospital Partnerships",
    description:
      "Actively seeking research opportunities at hospital-affiliated labs to advance my understanding of biomedical engineering and the clinical environment, with interest in patient-outcome optimisation.",
    tags: ["Biomedical Engineering", "Research"],
    status: "In Progress",
    featured: true,
  },
  {
    title: "Dolphin Kick Biomechanics",
    subtitle: "Mathematical Modelling · Biomechanics",
    description: (
      <>
        Extracted <AccentGlow>72</AccentGlow> discrete kinematic data points via GoPro footage and Adobe After Effects motion tracking to model the propulsive mechanics of the human dolphin kick. 
        Derived an optimal swimming velocity of <AccentGlow>2.64 m/s</AccentGlow> by utilizing continuous piecewise functions to evaluate dynamic thrust-to-drag ratios.
      </>
    ),
    date: "Jan 2025",
    tags: ["Mathematical Modelling", "Biomechanics", "Adobe After Effects", "Kinematic Analysis"],
    status: "Completed",
    slug: "dolphin-kick",
  },
  {
    title: "DCT in JPEG Compression",
    subtitle: "Signal Processing · Independent Research",
    description: (
      <>
        Explored the DCT through first principles (DFT → real projection), worked
        through the full JPEG pipeline on a personal beach photo using Python
        matrix operations. Demonstrated that the DCT outperforms the FFT
        for image reconstruction with <AccentGlow>near-identical</AccentGlow> output vs.
        visible FFT artifacts due to its continuous periodicity assumption.
      </>
    ),
    date: "May 2025",
    tags: ["Python", "Algorithm Implementation", "Signal Processing", "Image Compression"],
    status: "Completed",
    slug: "dct-jpeg",
  },
];

/* ── Status badge ─────────────────────────────────────────────── */

const STATUS_STYLES: Record<Status, string> = {
  Completed:     "border-emerald-600/45 text-emerald-500 bg-emerald-600/10",
  "In Progress": "border-accent/40 text-accent-hi bg-accent/10",
  Planned:       "border-rim/60 text-ink-muted bg-surface",
};
const STATUS_DOT: Record<Status, string> = {
  Completed:     "bg-emerald-500",
  "In Progress": "bg-accent-hi animate-pulse",
  Planned:       "bg-ink-muted",
};

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full border ${STATUS_STYLES[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {status}
    </span>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 text-sm font-medium rounded-full border border-accent/35 text-accent-hi bg-accent/10">
      {label}
    </span>
  );
}

/* ── Project card ─────────────────────────────────────────────── */

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const isPlanned = project.status === "Planned";

  return (
    <div
      className={`ecg-panel relative rounded-xl border overflow-hidden h-full ${
        isPlanned
          ? "border-dashed border-rim/40 bg-card/50"
          : "border-rim/50 bg-card"
      }`}
    >
      {/* Left accent stripe — hidden for planned (dashed) cards */}
      {!isPlanned && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-hi/60" />
      )}

      <div className={`py-7 h-full flex flex-col ${isPlanned ? "px-8" : "pl-8 pr-7"}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex items-start gap-4">
            <span className="font-mono text-3xl font-bold text-accent-hi/20 select-none leading-none mt-0.5 shrink-0 tabular-nums">
              {String(project.cardIndex ?? index + 1).padStart(2, "0")}
            </span>
            <div>
              {project.date && (
                <p className="font-mono text-xs text-accent-hi/78 uppercase tracking-widest mb-0.5">
                  {project.date}
                </p>
              )}
              <h3 className="text-xl font-semibold text-ink leading-snug tracking-tight">
                {project.title}
              </h3>
              {project.subtitle && (
                <p className="text-sm text-ink-muted mt-1 font-mono">
                  {project.subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <StatusBadge status={project.status} />
          </div>
        </div>

        {/* Description */}
        <p className="text-base text-ink-muted leading-relaxed mb-5 flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>

        {/* CTMFs (design portfolio) */}
        {project.ctmfs && (
          <div className="mt-4">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-ink-muted mb-1">
              CTMFs
            </p>
            <p className="text-sm text-ink-muted/95 leading-relaxed font-sans">
              {project.ctmfs[0]} · {project.ctmfs[1]} · {project.ctmfs[2]}
            </p>
          </div>
        )}

        {/* Case study link */}
        {project.slug && (
          <div className="mt-4 pt-4 border-t border-rim/30">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-accent-hi hover:text-ink transition-colors group"
            >
              View Case Study
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Project grid section ─────────────────────────────────────── */

function ProjectSection({
  label,
  projects,
  headerAside,
}: {
  label: string;
  projects: Project[];
  headerAside?: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <FadeIn>
        <div className="flex items-center gap-4 mb-7 flex-wrap">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-accent-hi whitespace-nowrap">
            {label}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-accent-hi/35 to-transparent min-w-[2rem]" />
          {headerAside}
        </div>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-7xl mx-auto w-full">
        {projects.map((project, i) => (
          <StaggerItem
            key={project.title}
            className={project.featured ? "lg:col-span-2" : ""}
          >
            <ProjectCard project={project} index={i} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function ProjectsPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 xl:px-8 pt-28 pb-24 flex flex-col gap-12">
      {/* Page header */}
      <FadeIn>
        <h1 className="text-5xl font-bold text-ink mb-3 tracking-tight">
          Projects
        </h1>
        <p className="text-lg text-ink-muted leading-relaxed">
        A portfolio of engineering design and quantitative research. 
        Each case study documents the technical methodology, initial constraints, and final stakeholder outcomes, including supplemental documentation.
        </p>
      </FadeIn>

      <ProjectSection
        label="Design Projects"
        projects={DESIGN_PROJECTS}
        headerAside={
          <Link
            href="/projects/references"
            className="text-xs font-medium tracking-[0.12em] uppercase text-accent-hi hover:text-ink transition-colors underline decoration-accent-hi/35 underline-offset-[5px] hover:decoration-accent-hi whitespace-nowrap shrink-0"
          >
            View full reference list
          </Link>
        }
      />
      <ProjectSection label="Research Projects" projects={RESEARCH_PROJECTS} />
    </main>
  );
}
