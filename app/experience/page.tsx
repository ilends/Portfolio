import type { Metadata } from "next";
import { FadeIn } from "../components/FadeIn";

export const metadata: Metadata = {
  title: "Experience – David Angelo",
};

/* ── Data ─────────────────────────────────────────────────────── */

type Entry = {
  title: string;
  org: string;
  location: string;
  period: string;
  bullets: string[];
  tags: string[];
};

type Section = {
  category: string;
  entries: Entry[];
};

const SECTIONS: Section[] = [
  {
    category: "Education",
    entries: [
      {
        title: "Bachelor of Applied Science — Engineering Science",
        org: "University of Toronto",
        location: "Toronto, ON",
        period: "2025 – Present",
        bullets: [
          "CGPA: 3.68 / 4.0 — Dean's List, Fall 2025",
          "Shaw Admission Scholarship recipient",
          "Expected graduation: June 2030",
        ],
        tags: ["Python", "MATLAB", "C", "LaTeX"],
      },
    ],
  },
  {
    category: "Work Experience",
    entries: [
      {
        title: "Advanced Leadership Instructor — First Aid & Lifesaving",
        org: "City of Mississauga",
        location: "Mississauga, ON",
        period: "Sep 2025 – Present",
        bullets: [
          "Instructs first aid and aquatic lifesaving procedures to 15 candidates per cohort, achieving an 86% pass rate",
          "Apprenticed under a senior instructor before assuming full independent responsibility in professional settings",
        ],
        tags: ["Leadership", "First Aid", "CPR", "Teaching"],
      },
      {
        title: "Lifeguard & Swim Instructor",
        org: "City of Mississauga",
        location: "Mississauga, ON",
        period: "Aug 2023 – Present",
        bullets: [
          "Teaches progressive swimming skills to 150+ youth, building water confidence and safety awareness across age groups",
          "Supervises up to 100 patrons simultaneously; mentored 5+ junior instructors compliant to standard policy",
        ],
        tags: ["NLS", "Supervision", "Instruction", "Safety"],
      },
    ],
  },
  {
    category: "Team Experience",
    entries: [
      {
        title: "Engineering Competition Team",
        org: "Glenforest Secondary School",
        location: "Mississauga, ON",
        period: "Sep 2023 – May 2025",
        bullets: [
          "Calculated chassis cutting angles from CAD drawings, reducing fabrication error to <5 mm variance for the 2025 Waterloo Electric Vehicle Challenge",
          "Secured $5,000+ in team sponsorships through outreach to 10+ organisations for the 2024 FIRST Robotics Competition — Team Sustainability Award",
        ],
        tags: ["CAD", "FIRST Robotics", "Fundraising", "EV Design"],
      },
    ],
  },
];

/* ── Components ───────────────────────────────────────────────── */

function Tag({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 text-sm font-medium rounded-full border border-accent/35 text-accent-hi bg-accent/10">
      {label}
    </span>
  );
}

function EntryPanel({ entry }: { entry: Entry }) {
  return (
    <FadeIn>
    <div className="ecg-panel relative rounded-xl border border-rim/50 bg-card overflow-hidden">
      {/* Left accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-hi/60" />

      <div className="pl-8 pr-7 py-7">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xl font-semibold text-ink leading-snug tracking-tight">
              {entry.title}
            </h3>
            <p className="text-base text-ink-muted mt-1">
              {entry.org} &middot; {entry.location}
            </p>
          </div>
          <span className="shrink-0 self-start text-sm font-mono text-accent-hi bg-accent/10 border border-accent/25 px-3 py-1 rounded-md">
            {entry.period}
          </span>
        </div>

        {/* Bullets */}
        <ul className="space-y-2.5 mb-5">
          {entry.bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-3 text-base text-ink-muted leading-relaxed"
            >
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent-hi shrink-0" />
              {b}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      </div>
    </div>
    </FadeIn>
  );
}

function SectionGroup({ section }: { section: Section }) {
  return (
    <div className="mb-14">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent-hi whitespace-nowrap">
          {section.category}
        </h2>
        <div className="flex-1 h-px bg-accent-hi/20" />
      </div>

      <div className="flex flex-col gap-5">
        {section.entries.map((entry, i) => (
          <EntryPanel key={i} entry={entry} />
        ))}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function ExperiencePage() {
  return (
    <main className="max-w-5xl mx-auto px-6 pt-28 pb-24">
      <h1 className="text-5xl font-bold text-ink mb-3 tracking-tight">
        Experience
      </h1>
      <p className="text-base text-ink-muted mb-12">
        Education, clinical work, and team involvement.
      </p>

      {SECTIONS.map((section) => (
        <SectionGroup key={section.category} section={section} />
      ))}
    </main>
  );
}
