"use client";

import Link from "next/link";
import { AccentGlow } from "./AccentGlow";
import { FadeIn } from "./FadeIn";

/* ── Data ─────────────────────────────────────────────────────── */

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
      <span className="text-xs font-medium tracking-[0.2em] uppercase text-accent-hi whitespace-nowrap">
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
      <h2 className="text-xl font-medium text-ink mb-4 tracking-tight">
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────── */

export function AboutSection() {
  return (
    <section
      id="about"
      className="max-w-5xl mx-auto w-full px-6 pb-28 flex flex-col gap-10"
    >
      {/* ── Intro ── */}
      <FadeIn>
        <SectionLabel>About Me</SectionLabel>
        <SectionCard title="At a Glance">
          <div className="space-y-4">
            <p className="text-base text-ink-muted leading-relaxed">
              I am an{" "}
              <AccentGlow>
                Engineering Science student at the University of Toronto
              </AccentGlow>{" "}
              building a strong foundation in engineering principles and problem
              solving. Everything I do leans into my long-term focus on{" "}
              <AccentGlow>Emergency Medicine</AccentGlow>. I&apos;m driven by the
              goal to bring{" "}
              <AccentGlow>
                technical perspectives from engineering to frontline care in
                emergency medicine
              </AccentGlow>
              .
            </p>
            <p className="text-base text-ink-muted leading-relaxed">
              Outside being a student, I teach{" "}
              <AccentGlow>first aid and swim instruction</AccentGlow> supervise{" "}
              <AccentGlow>high-volume aquatic environments</AccentGlow> as a{" "}
              <AccentGlow>lifeguard</AccentGlow>. In my spare time, I stay active
              in <AccentGlow>music and media production</AccentGlow>, being a{" "}
              <AccentGlow>bassist and music producer</AccentGlow>.
            </p>
            <div className="pt-1">
              <Link
                href="/profile"
                className="inline-flex items-center rounded-full border border-accent-hi/45 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.22em] text-accent-hi hover:bg-accent/10 transition-colors"
              >
                Open Profile
              </Link>
            </div>
          </div>
        </SectionCard>
      </FadeIn>

      {/* ── My Position ── */}
      <FadeIn>
        <SectionLabel>My Position</SectionLabel>
        <SectionCard title="My Position as an Engineering Student">
          <div className="space-y-4">
            <p className="text-sm text-ink-muted leading-relaxed border-b border-rim/40 pb-4">
              <span className="font-medium text-ink/90"></span> Brief summary of my position. The
              complete version (all sections, same material as the PDF) is on{" "}
              <Link
                href="/profile#position-on-design"
                className="text-accent-hi underline-offset-2 hover:underline"
              >
                my profile
              </Link>
              .
            </p>
            <p className="text-base text-ink-muted leading-relaxed">
              My practice as an engineering designer is driven by the principle
              that technical solutions only gain meaning when{" "}
              <AccentGlow>validated by the communities they serve</AccentGlow>.
              Informed by my{" "}
              <AccentGlow>
                frontline experience in emergency first aid and aquatic
                supervision
              </AccentGlow>
              {", I recognize that "}
              <AccentGlow>stakeholders</AccentGlow> often operate under intense{" "}
              <AccentGlow>cognitive load</AccentGlow> and{" "}
              <AccentGlow>bounded rationality</AccentGlow>.
            </p>
            <p className="text-base text-ink-muted leading-relaxed">
              Therefore, I approach every problem with an{" "}
              <AccentGlow>agnostic lens</AccentGlow>, accepting that mathematical
              models are{" "}
              <AccentGlow>inherently incomplete simplifications</AccentGlow> of
              complex human realities. Ultimately, I operate as a{" "}
              <AccentGlow>learner first</AccentGlow> to build{" "}
              <AccentGlow>sustainable</AccentGlow>, analytically sound systems
              that remain{" "}
              <AccentGlow>genuinely usable under pressure</AccentGlow>.
            </p>
            <div className="pt-1">
              <Link
                href="/profile#position-on-design"
                className="inline-flex items-center rounded-full border border-accent-hi/45 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.22em] text-accent-hi hover:bg-accent/10 transition-colors"
              >
                View Full Position
              </Link>
              <a
                href="/api/pdf/position"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center ml-2 rounded-full border border-rim/50 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.22em] text-ink-muted hover:text-ink hover:border-accent-hi/40 hover:bg-card transition-colors"
              >
                Alternatively View/Download Position as PDF
              </a>
            </div>
          </div>
        </SectionCard>
      </FadeIn>

      {/* ── Technical Skills ── */}
      <FadeIn>
        <SectionLabel>Technical Skills</SectionLabel>
        <SectionCard title="Technical Skills">
          <div className="flex flex-col gap-5">
            {SKILL_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-ink-muted/40 mb-2.5">
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

      {/* ── Explore Next ── */}
      <FadeIn>
        <SectionLabel>Explore Next</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-full border border-accent-hi/75 px-7 py-4 text-[15px] font-medium text-accent-hi bg-accent/22 hover:bg-accent/30 shadow-[0_0_22px_-8px_rgba(96,165,250,0.3)] transition-all duration-200"
          >
            Explore Projects
          </Link>
          <Link
            href="/experience"
            className="inline-flex items-center justify-center rounded-full border border-accent-hi/35 px-7 py-4 text-[15px] font-medium text-ink hover:text-ink hover:border-accent-hi/60 bg-card/70 hover:bg-card transition-all duration-200"
          >
            View Experience
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-full border border-accent-hi/35 px-7 py-4 text-[15px] font-medium text-ink hover:text-ink hover:border-accent-hi/60 bg-card/70 hover:bg-card transition-all duration-200"
          >
            Open Profile
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-accent-hi/35 px-7 py-4 text-[15px] font-medium text-ink hover:text-ink hover:border-accent-hi/60 bg-card/70 hover:bg-card transition-all duration-200"
          >
            Contact
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
