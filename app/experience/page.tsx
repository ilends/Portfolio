import type { Metadata } from "next";
import { AccentGlow } from "../components/AccentGlow";
import { FadeIn } from "../components/FadeIn";

export const metadata: Metadata = {
  title: "Experience",
  description: "Education, clinical roles, and team experience — Engineering Science at UofT, lifeguard and first aid instructor, and robotics competition team.",
  keywords: [
    "Engineering Science",
    "University of Toronto",
    "Clinical Engineering",
    "Emergency Medicine",
    "Lifeguard",
    "First Aid Instructor",
  ],
};

/* ── Data ─────────────────────────────────────────────────────── */

type Entry = {
  title: string;
  org: string;
  location: string;
  period: string;
  bullets: React.ReactNode[];
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
          <>CGPA: <AccentGlow>3.68 / 4.0</AccentGlow> — Dean&apos;s List, <AccentGlow>Fall 2025</AccentGlow></>,
          <>Shaw Admission Scholarship recipient</>,
          <>Expected graduation: <AccentGlow>June 2030</AccentGlow></>,
        ],
        tags: ["Engineering Design", "Systems Modelling", "Computational Mathematics", "Technical Communication"],
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
          <>Co-instructs and evaluates Emergency First Aid cohorts of <AccentGlow>15+</AccentGlow> candidates, maintaining an <AccentGlow>86%</AccentGlow> success rate against national Lifesaving Society standards.</>,
          <>Executes high-fidelity emergency simulations to assess candidate response times and medical intervention accuracy.</>,
          <>Currently completing Examiner and Standard First Aid instructional practicums to independently evaluate and authorize national certifications.</>,
        ],
        tags: ["Leadership", "Emergency Protocols", "Simulation Design", "Clinical Evaluation"],
      },
      {
        title: "Lifeguard & Swim Instructor",
        org: "City of Mississauga",
        location: "Mississauga, ON",
        period: "Aug 2023 – Present",
        bullets: [
          <>Manages dynamic risk mitigation and aquatic safety protocols for high-traffic environments of up to <AccentGlow>100+</AccentGlow> concurrent patrons.</>,
          <>Mentored <AccentGlow>5+</AccentGlow> junior staff members, ensuring strict adherence to standardized emergency response policies and public health compliance.</>,
        ],
        tags: ["NLS", "Supervision", "Risk Management", "Crisis Prevention", "Public Health"],
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
          <>Calculated chassis cutting angles from CAD drawings, reducing fabrication error to <AccentGlow>&lt;5 mm</AccentGlow> variance for the 2025 Waterloo Electric Vehicle Challenge</>,
          <>Secured <AccentGlow>$5,000+</AccentGlow> in team sponsorships through outreach to <AccentGlow>10+ organisations</AccentGlow> for the 2024 FIRST Robotics Competition — Team Sustainability Award</>,
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
            <h3 className="text-xl font-medium text-ink leading-snug tracking-tight">
              {entry.title}
            </h3>
            <p className="text-base text-ink-muted mt-1">
              {entry.org} &middot; {entry.location}
            </p>
          </div>
          <span className="shrink-0 self-start text-sm font-sans text-accent-hi bg-accent/10 border border-accent/25 px-3 py-1 rounded-md">
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
              <span>{b}</span>
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
        <h2 className="text-xs font-medium tracking-[0.2em] uppercase text-accent-hi whitespace-nowrap">
          {section.category}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-accent-hi/35 to-transparent" />
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
      <h1 className="text-5xl font-medium text-ink mb-3 tracking-tight">
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
