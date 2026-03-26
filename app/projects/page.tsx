import type { Metadata } from "next";
import { FadeIn } from "../components/FadeIn";

export const metadata: Metadata = {
  title: "Projects – David Angelo",
};

/* ── Highlight component ──────────────────────────────────────── */

/** Glowing teal highlight for key stats and metrics. */
function S({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-accent-hi font-semibold"
      style={{ textShadow: "0 0 10px rgba(34, 211, 238, 0.38)" }}
    >
      {children}
    </span>
  );
}

/* ── Data ─────────────────────────────────────────────────────── */

type Project = {
  title: string;
  subtitle?: string;
  description: React.ReactNode;
  tags: string[];
  status: "Completed" | "In Progress" | "Planned";
};

const PROJECTS: Project[] = [
  {
    title: "Praxis II Engineering Design Project",
    subtitle: "ESC102 · University of Toronto",
    description:
      "Second-semester design project in the Engineering Science Praxis sequence. Details will be added as the project develops this term. Focused on stakeholder-centred design solutions for a variable swim resistance training device.",
    tags: ["Engineering Design", "Prototyping", "LaTeX", "Teamwork"],
    status: "In Progress",
  },
  {
    title: "Doffing Glove Removal Device : Praxis I Engineering Design Project",
    subtitle: "ESC101 · University of Toronto",
    description: (
      <>
        Engineered <S>3+</S> glove-removal devices to improve safety for
        healthcare workers. Evaluated accessibility constraints through proxy
        testing in a team of 5, maintaining applied forces below{" "}
        <S>22.2 N</S>, weight below <S>500 g</S>, doffing time of{" "}
        <S>8.82 s</S>, and reducing contamination contact rate from a
        documented <S>37%</S> to <S>5%</S>.
      </>
    ),
    tags: ["Fusion 360", "Prototyping", "Drafting", "LaTeX"],
    status: "Completed",
  },
  {
    title: "CIV102 Bridge Design Project",
    subtitle: "CIV102 · University of Toronto",
    description: (
      <>
        Designed and tested a matboard truss bridge in a team of{" "}
        <S>4</S> using statics and load-path analysis across <S>5+</S>{" "}
        iterations. Achieved a maximum sustained load of <S>450 N</S> and
        cumulative failure load of <S>1250 N</S>; optimised truss member
        geometry through Python simulation of shear-force and bending-moment
        diagrams.
      </>
    ),
    tags: ["Python", "CAD", "Structural Engineering", "Statics"],
    status: "Completed",
  },
  {
    title: "Biomedical Engineering Research",
    subtitle: "Targeting Research Hospitals",
    description:
      "Actively seeking research opportunities at hospitals to further my understanding of biomedical engineering, improve patient care, and optimize healthcare delivery.",
    tags: ["Research"],
    status: "In Progress",
  },
];

/* ── Components ───────────────────────────────────────────────── */

const STATUS_STYLES: Record<Project["status"], string> = {
  Completed: "border-emerald-500/40 text-emerald-400 bg-emerald-400/10",
  "In Progress": "border-accent/40 text-accent-hi bg-accent/10",
  Planned: "border-rim/60 text-ink-muted bg-surface",
};

const STATUS_DOT: Record<Project["status"], string> = {
  Completed: "bg-emerald-400",
  "In Progress": "bg-accent-hi animate-pulse",
  Planned: "bg-ink-muted",
};

function StatusBadge({ status }: { status: Project["status"] }) {
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

function ProjectPanel({
  project,
  index, 
}: {
  project: Project;
  index: number;
}) {
  return (
    <FadeIn delay={index * 0.06}>
      <div className="ecg-panel relative rounded-xl border border-rim/50 bg-card overflow-hidden">
        {/* Left accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-hi/60" />

        <div className="pl-8 pr-7 py-7">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div className="flex items-start gap-4">
              {/* Index number */}
              <span className="font-mono text-3xl font-bold text-accent-hi/20 select-none leading-none mt-0.5 shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-xl font-semibold text-ink leading-snug tracking-tight">
                  {project.title}
                </h2>
                {project.subtitle && (
                  <p className="text-sm text-ink-muted mt-1 font-mono">
                    {project.subtitle}
                  </p>
                )}
              </div>
            </div>
            <StatusBadge status={project.status} />
          </div>

          {/* Description — accepts ReactNode for inline highlights */}
          <p className="text-base text-ink-muted leading-relaxed mb-5">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function ProjectsPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 pt-28 pb-24">
      <h1 className="text-5xl font-bold text-ink mb-3 tracking-tight">
        Projects
      </h1>
      <p className="text-base text-ink-muted mb-12">
        Academic and independent work — sub-pages coming soon.
      </p>

      <div className="flex flex-col gap-5">
        {PROJECTS.map((project, i) => (
          <ProjectPanel key={project.title} project={project} index={i} />
        ))}
      </div>
    </main>
  );
}
