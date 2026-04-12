import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExpandablePhoto } from "../components/ExpandablePhoto";
import { StaggerContainer, StaggerItem } from "../components/FadeIn";
import {
  PositionDevelopmentAccordion,
  PositionPrinciplesAccordion,
} from "../components/PositionPrinciplesAccordion";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Personal profile for David Angelo, covering motivation, background, and interests beyond coursework.",
  keywords: [
    "Engineering Science",
    "University of Toronto",
    "Clinical Engineering",
    "Emergency Medicine",
    "Biomedical Design",
  ],
};

export default function ProfilePage() {
  return (
    <main className="max-w-5xl mx-auto px-6 pt-28 pb-24">
      <StaggerContainer className="flex flex-col gap-12">
        <StaggerItem>
          <div>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-accent-hi/45 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.22em] text-accent-hi hover:bg-accent/10 transition-colors"
            >
              ← Return Home
            </Link>

            <section className="mt-10 flex flex-col items-center text-center">
              <p className="font-sans text-xs tracking-[0.24em] uppercase text-accent-hi/75">
                Full Profile
              </p>

              <h1 className="mt-4 text-5xl sm:text-6xl font-semibold tracking-tight text-ink">
                David Angelo
              </h1>

              <p className="mt-4 text-lg text-ink-muted max-w-2xl">
                Engineering Science student focused on rigorous analysis for real-world medical and biomechanical challenges.
              </p>

              <div className="relative mt-10 h-64 w-64 overflow-hidden rounded-full border-2 border-accent-hi/50 bg-card shadow-[0_0_28px_-10px_rgba(96,165,250,0.26)]">
                <Image
                  src="/images/profile/portrait.png"
                  alt="David Angelo"
                  width={256}
                  height={256}
                  className="h-full w-full object-cover"
                  priority
                  sizes="256px"
                />
              </div>
            </section>
          </div>
        </StaggerItem>

        <StaggerItem>
          <section className="rounded-xl border border-rim/50 bg-card px-7 py-6">
            <header className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-ink">
                Cultivating a Pathway into Clinical Practice
              </h2>
              <div
                className="mt-3 h-px w-10 bg-gradient-to-r from-accent-hi/50 to-transparent"
                aria-hidden
              />
            </header>
            <div className="space-y-6 text-[15px] sm:text-base text-ink/85 leading-[1.75]">
              <p className="text-pretty">
                For most of my life I was focused on competitive swimming, where improvement meant refining my own technique and pushing for better times. When I later transitioned into lifeguarding and teaching first aid, my perspective shifted. Instead of focusing on individual performance, I became responsible for the safety of hundreds of people at once. That environment forced me to think in systems. Prevention, situational awareness, and quick decision making mattered more than perfection.
              </p>
              <p className="text-pretty">
                That experience pushed me toward Engineering Science. I wanted to understand the technical side of the environments I worked in and learn how rigorous analysis could support real decisions in high pressure situations. The same focus I developed through music and sport translated naturally. Practicing bass guitar taught me discipline and rhythm, while lifeguarding demanded calm execution under pressure. Engineering gave me the tools to approach those situations analytically.
              </p>
              <p className="text-pretty">
                Today, I&apos;m interested in the intersection between engineering and emergency medicine. Frontline care often depends on clear information and reliable tools, especially when time and cognitive bandwidth are limited. My goal is to build a strong foundation in systems analysis and hardware so I can contribute to technologies that support clinicians in those moments. I am not interested in separating engineering from medicine. What motivates me is the possibility of bringing both together in environments where careful design can directly support patient care.
              </p>
            </div>
          </section>
        </StaggerItem>

        <StaggerItem>
          <section
            id="position-on-design"
            className="scroll-mt-28 rounded-xl border border-rim/50 bg-card px-7 py-6"
          >
            <h2 className="text-xl font-semibold tracking-tight text-ink mb-2">
              My Position on Engineering Design as an Engineering Student
            </h2>
            <p className="text-sm text-ink-muted mb-5 max-w-3xl leading-relaxed">
              Expand each principle to read the full text. The current statement and an earlier version are available as PDFs below.
            </p>
            <div className="rounded-lg border-l-2 border-accent-hi/45 pl-4 sm:pl-5">
              <PositionPrinciplesAccordion />
              <PositionDevelopmentAccordion />
            </div>
            <div className="pt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="/api/pdf/position"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-rim/50 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.22em] text-ink-muted hover:text-ink hover:border-accent-hi/40 hover:bg-card transition-colors"
              >
                Alternatively View/Download Position as PDF
              </a>
              <a
                href="/api/pdf/position-old"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-rim/50 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.22em] text-ink-muted hover:text-ink hover:border-accent-hi/40 hover:bg-card transition-colors"
              >
                View Earlier Position as PDF
              </a>
            </div>
            <p className="mt-3 text-xs text-ink-muted/90 max-w-3xl leading-relaxed">
              The earlier PDF is only slightly changed from what was submitted for coursework, to protect confidentiality where needed.
            </p>
          </section>
        </StaggerItem>

        <StaggerItem>
          <section className="rounded-xl border border-rim/50 bg-card px-7 py-6">
            <h2 className="text-xl font-semibold tracking-tight text-ink mb-4">
              Field Notes
            </h2>
            <p className="text-base text-ink-muted leading-relaxed mb-5">
              Continually updating. Personal experiences keep me grounded outside of work. Click to expand.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <div className="min-w-0">
                <ExpandablePhoto
                  src="/images/profile/montreal-trip.jpg"
                  alt="Montreal — pedestrian street opening toward the downtown skyline on a clear day"
                  caption="Montreal trip - Visiting McGill University! Summer 2025."
                  className="w-full"
                  frameClassName="aspect-[5/3] w-full"
                  objectPosition="center 42%"
                />
              </div>
            </div>
          </section>
        </StaggerItem>
      </StaggerContainer>
    </main>
  );
}
