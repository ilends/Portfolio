import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "../components/FadeIn";

export const metadata: Metadata = {
  title: "Projects",
  description: "Engineering design projects and mathematical research by David Angelo — structural analysis, signal processing, medical device design, and mathematical modelling.",
};

/* ── Inline stat highlight ────────────────────────────────────── */

function S({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-accent-hi font-semibold"
      style={{ textShadow: "0 0 8px rgba(82,171,152,0.35)" }}
    >
      {children}
    </span>
  );
}

/* ── Section label (matches AboutSection style) ──────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-7">
      <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent-hi whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-accent-hi/35 to-transparent" />
    </div>
  );
}

/* ── Types ────────────────────────────────────────────────────── */

type Status = "Completed" | "In Progress" | "Planned";

type Project = {
  title: string;
  subtitle?: string;
  date?: string;
  description: React.ReactNode;
  tags: string[];
  status: Status;
  featured?: boolean;
  slug?: string;
};

/* ── Data ─────────────────────────────────────────────────────── */

const DESIGN_PROJECTS: Project[] = [
  {
    title: "Praxis II Engineering Design Project",
    subtitle: "ESC102 · University of Toronto",
    date: "Winter 2026",
    description:
      "Currently engineering a variable-resistance aquatic training mechanism for the MSSAC High Performance Swim Team. Navigating stakeholder constraints to develop physical prototypes, iterating on user research and concept generation to optimize ergonomics and safety.",
    tags: ["Engineering Design", "Human Factors", "Verification & Validation", "Stakeholder Engagement"],
    status: "In Progress",
    featured: true,
  },
  {
    title: "Doffing Glove Removal Device",
    subtitle: "ESC101 · Praxis I · University of Toronto",
    description: (
      <>
        Developed <S>5</S> prototype concepts (Hook, Slicer, Tape, Air Blower,
        Water Pump) in a team of <S>5</S> for safe vinyl glove removal. Converged
        on a tape-tab system via Pugh chart analysis and a 10-student survey —
        achieving a contact rate of <S>5 %</S> (down from <S>37 %</S>), doffing
        time of <S>8.82 s</S>, and device mass of just <S>0.5 g</S>.
      </>
    ),
    date: "Fall 2025",
    tags: ["Fusion 360", "Prototyping", "Drafting", "LaTeX"],
    status: "Completed",
    slug: "glove-doffing-device",
  },
  {
    title: "CIV102 Bridge Design Project",
    subtitle: "CIV102 · University of Toronto",
    description: (
      <>
        Built a simply-supported matboard box-girder bridge in a team of{" "}
        <S>4</S> across <S>5</S> major iterations guided by a Python structural
        analysis pipeline evaluating <S>8</S> failure modes. Final design
        achieved a minimum factor of safety of <S>2.49</S> under Load Case 2
        (<S>452 N</S>) with compression governing the failure mode.
      </>
    ),
    date: "Fall 2025",
    tags: ["Python", "Structural Engineering", "Statics", "Safety Analysis"],
    status: "Completed",
    slug: "civ102-matboard-bridge",
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
        Extracted <S>72</S> discrete kinematic data points via GoPro footage and Adobe After Effects motion tracking to model the propulsive mechanics of the human dolphin kick. 
        Derived an optimal swimming velocity of <S>2.64 m/s</S> by utilizing continuous piecewise functions to evaluate dynamic thrust-to-drag ratios.
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
        for image reconstruction with <S>near-identical</S> output vs.
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
  Completed:     "border-emerald-500/40 text-emerald-400 bg-emerald-400/10",
  "In Progress": "border-accent/40 text-accent-hi bg-accent/10",
  Planned:       "border-rim/60 text-ink-muted bg-surface",
};
const STATUS_DOT: Record<Status, string> = {
  Completed:     "bg-emerald-400",
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
      {/* Left accent stripe — hidden for placeholder cards */}
      {!isPlanned && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-hi/60" />
      )}

      <div className={`py-7 h-full flex flex-col ${isPlanned ? "px-7" : "pl-8 pr-7"}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex items-start gap-4">
            <span className="font-mono text-3xl font-bold text-accent-hi/20 select-none leading-none mt-0.5 shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              {project.date && (
                <p className="font-mono text-xs text-accent-hi/60 uppercase tracking-widest mb-1">
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

        {/* Case study link */}
        {project.slug && (
          <div className="mt-4 pt-4 border-t border-rim/30">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-hi hover:text-ink transition-colors group"
            >
              View Case Study
              <svg
                width="14"
                height="14"
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
}: {
  label: string;
  projects: Project[];
}) {
  return (
    <section className="flex flex-col gap-5">
      <FadeIn>
        <SectionLabel>{label}</SectionLabel>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
    <main className="max-w-7xl mx-auto px-6 xl:px-10 pt-28 pb-24 flex flex-col gap-16">
      {/* Page header */}
      <FadeIn>
        <h1 className="text-5xl font-bold text-ink mb-3 tracking-tight">
          Projects
        </h1>
        <p className="text-base text-ink-muted max-w-3xl">
        A portfolio of engineering design and quantitative research. 
        Each case study documents the technical methodology, initial constraints, and final stakeholder outcomes, including supplemental documentation.
        </p>
      </FadeIn>

      <ProjectSection label="Design Projects"   projects={DESIGN_PROJECTS} />
      <ProjectSection label="Research Projects" projects={RESEARCH_PROJECTS} />
    </main>
  );
}
