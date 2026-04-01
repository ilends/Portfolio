"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "./FadeIn";

/* ── Pillar icons ─────────────────────────────────────────────── */

function GradCapIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function HeartPulseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l1.5-3 2 4.5 1.5-3h5.27" />
    </svg>
  );
}

function ShieldPlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M9 12h6M12 9v6" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

/* ── Data ─────────────────────────────────────────────────────── */

const PILLARS = [
  {
    icon: <GradCapIcon />,
    title: "Engineering Science Student",
    body: "Currently navigating one of Canada's most intensive engineering curricula with a cGPA of 3.68. Building a strong foundation in engineering principles and problem-solving.",
  },
  {
    icon: <HeartPulseIcon />,
    title: "Emergency Medicine Focus",
    body: "Everything I do leans into my long-term focus on Emergency Medicine. I'm driven by the goal to bring technical perspectives from engineering to frontline care.",
  },
  {
    icon: <ShieldPlusIcon />,
    title: "Certified Instructor & Lifeguard",
    body: "NLS-certified and a certified Standard First Aid Instructor for the City of Mississauga. I regularly supervise 50+ concurrent patrons and have coached 150+ youth swimmers.",
  },
  {
    icon: <LightbulbIcon />,
    title: "Design Philosophy",
    body: "I'm a learner first. I thrive to remain curious, willing to change my assumptions, and strive to build solutions around a stakeholder-centric approach.",
  },
];

const SKILL_GROUPS = [
  {
    label: "Programming",
    items: ["Python", "NumPy", "Matplotlib", "MATLAB", "C"],
  },
  {
    label: "Design & CAD",
    items: ["Fusion 360", "Onshape", "SolidWorks"],
  },
  {
    label: "Digital Infrastructure",
    items: ["Git", "Vercel", "Snyk", "DNS & Domain Management"],
  },
  {
    label: "Analysis & Media",
    items: ["LaTeX", "Excel", "Tracker", "Adobe After Effects", "Wondershare Filmora", "FL Studio"],
  },
];

/* ── Shared sub-components ────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent-hi whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-accent-hi/35 to-transparent" />
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-rim/50 bg-card px-7 py-6 shadow-sm">
      <h2 className="text-xl font-semibold text-ink mb-4 tracking-tight">
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ── Pillar card ──────────────────────────────────────────────── */

function PillarCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="ecg-panel rounded-xl border border-rim/50 bg-card px-5 py-5 flex flex-col gap-3 h-full">
      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/15 text-accent-hi shrink-0">
        {icon}
      </span>
      <h3 className="text-base font-semibold text-ink leading-snug">{title}</h3>
      <p className="text-sm text-ink-muted leading-relaxed">{body}</p>
    </div>
  );
}

/* ── Position item ────────────────────────────────────────────── */

function PositionItem({
  role,
  org,
  period,
  note,
}: {
  role: string;
  org: string;
  period: string;
  note?: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 w-2 h-2 rounded-full bg-accent-hi shrink-0" />
      <div>
        <p className="text-base font-semibold text-ink leading-snug">{role}</p>
        <p className="text-sm text-ink-muted mt-0.5">
          {org} &middot; {period}
        </p>
        {note && (
          <p className="text-xs text-ink-muted/60 font-mono mt-0.5">{note}</p>
        )}
      </div>
    </li>
  );
}

/* ── Section ──────────────────────────────────────────────────── */

export function AboutSection() {
  return (
    <section
      id="about"
      className="max-w-5xl mx-auto w-full px-6 pb-28 flex flex-col gap-10"
    >
      {/* ── Core Pillars ── */}
      <div>
        <FadeIn>
          <SectionLabel>What Drives Me</SectionLabel>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PILLARS.map((p) => (
            <StaggerItem key={p.title}>
              <PillarCard {...p} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* ── My Position ── */}
      <FadeIn>
        <SectionLabel>My Position</SectionLabel>
        <SectionCard title="My Position">
          <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-rim/50">
            <span className="text-sm text-ink-muted/40 font-mono tracking-wider select-none">
              — coming soon —
            </span>
          </div>
        </SectionCard>
      </FadeIn>

      {/* ── Current Roles ── */}
      <FadeIn>
        <SectionLabel>Current Roles</SectionLabel>
        <SectionCard title="Current Roles">
          <ul className="flex flex-col gap-4">
            <PositionItem
              role="Engineering Science Student"
              org="University of Toronto"
              period="2025 – Present"
              note="CGPA 3.68 · Dean's List · Shaw Admission Scholarship"
            />
            <PositionItem
              role="Advanced Leadership Instructor, First Aid & Lifesaving"
              org="City of Mississauga"
              period="Sep 2025 – Present"
              note="86% cohort pass rate · First Aid, CPR and AED certified"
            />
            <PositionItem
              role="Lifeguard & Swim Instructor"
              org="City of Mississauga"
              period="Aug 2023 – Present"
              note="150+ youth taught · 100-patron supervision · NLS"
            />
          </ul>
        </SectionCard>
      </FadeIn>

      {/* ── Technical Skills ── */}
      <FadeIn>
        <SectionLabel>Technical Skills</SectionLabel>
        <SectionCard title="Technical Skills">
          <div className="flex flex-col gap-5">
            {SKILL_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-ink-muted/40 mb-2.5">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 text-sm font-medium rounded-full border border-accent/40 text-accent-hi bg-accent/10 hover:bg-accent/20 transition-colors duration-150"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </FadeIn>
    </section>
  );
}
