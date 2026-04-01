"use client";

import { StaggerContainer, StaggerItem } from "./FadeIn";

/* ── Types ────────────────────────────────────────────────────── */

type ChangeKind = "new" | "improved" | "security" | "fix";

type ChangeItem = {
  kind: ChangeKind;
  text: string;
};

type Release = {
  version: string;
  date: string;
  label: "latest" | "minor" | "initial";
  summary: string;
  changes: ChangeItem[];
};

/* ── Data ─────────────────────────────────────────────────────── */

const RELEASES: Release[] = [
  {
    version: "v1.1.1",
    date: "Apr 1, 2026",
    label: "latest",
    summary: "Added auto-generated sitemap for SEO.",
    changes: [
      { kind: "new", text: "Auto-generated `sitemap.xml` via Next.js App Router, covering all static pages and dynamic project routes." },
    ],
  },
  {
    version: "v1.1.0",
    date: "Apr 1, 2026",
    label: "minor",
    summary: "Major update: mobile support, security hardening, new projects and case study pages, visual rebrand, and UX polish across the whole site.",
    changes: [
      { kind: "new",      text: "Favicon and PWA icons: browser tab, iOS home screen, Android Chrome (192 × 192 and 512 × 512) with matching deep-navy theme colour." },
      { kind: "new",      text: "Hamburger menu navigation for smaller screens, full responsive layout down to 375 px." },
      { kind: "new",      text: "Dynamic `/projects/[slug]` case study pages with sectioned layout, slug is the project name." },
      { kind: "new",      text: "KaTeX server-side LaTeX rendering for inline and display math on case study pages." },
      { kind: "new",      text: "Image gallery with lightbox, keyboard navigation, and prev/next controls." },
      { kind: "new",      text: "Changelog page." },
      { kind: "new",      text: "\"View Projects\" button added to hero action row." },
      { kind: "security", text: "PDFs (reports + resume) served via opaque `/api/pdf/[slug]` route. Filenames no longer exposed in markup or network tab." },
      { kind: "security", text: "Gallery images loaded as `blob:` URLs, original file paths no longer visible in elements panels." },
      { kind: "security", text: "Static assets moved out of `public/` into `private/`, direct URL access blocked." },
      { kind: "improved", text: "Colour palette changed to surgical teals and deep navy to fit new branding." },
      { kind: "improved", text: "DotGrid canvas replaced with medical monitor graph-paper texture." },
      { kind: "improved", text: "ECG panel hover animations and radar-pulse status dots added sitewide." },
      { kind: "improved", text: "Technical Skills section expanded and grouped by categories." },
      { kind: "improved", text: "Project summaries rewritten to be more impact-first." },
      { kind: "improved", text: "Experience section subheading lines match site-wide fade-to-transparent gradient style." },
    ],
  },
  {
    version: "v1.0.0",
    date: "Mar 25, 2026",
    label: "initial",
    summary: "Initial public deployment. Core pages live on Vercel with CI/CD.",
    changes: [
      { kind: "new", text: "Next.js 16 App Router scaffold with Geist Sans / Geist Mono." },
      { kind: "new", text: "Pages: Home, Experience, Projects, Contact." },
      { kind: "new", text: "Framer Motion scroll-triggered FadeIn and StaggerContainer animation system." },
      { kind: "new", text: "Light / dark theme toggle with localStorage persistence and no-flash inline script." },
      { kind: "new", text: "Vercel production deployment with automatic preview branches on push." },
    ],
  },
];

/* ── Change-kind badge ────────────────────────────────────────── */

const KIND_STYLES: Record<ChangeKind, string> = {
  new:      "bg-accent/12 text-accent-hi border-accent/30",
  improved: "bg-sky-500/10 text-sky-400 border-sky-500/25",
  security: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  fix:      "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
};

const KIND_LABEL: Record<ChangeKind, string> = {
  new:      "New",
  improved: "Improved",
  security: "Security",
  fix:      "Fix",
};

function KindBadge({ kind }: { kind: ChangeKind }) {
  return (
    <span className={`shrink-0 inline-block text-[9px] font-bold tracking-[0.15em] uppercase px-1.5 py-0.5 rounded border ${KIND_STYLES[kind]}`}>
      {KIND_LABEL[kind]}
    </span>
  );
}

/* ── Inline code renderer ─────────────────────────────────────── */

function ChangeText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code
            key={i}
            className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-accent/10 border border-accent/25 text-accent-hi"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/* ── Dot styles ───────────────────────────────────────────────── */

function releaseDotClass(label: Release["label"]) {
  if (label === "latest")
    return "bg-accent-hi shadow-[0_0_8px_2px_rgba(82,171,152,0.35)]";
  return "bg-ink-muted/40";
}

function releaseBadgeClass(label: Release["label"]) {
  if (label === "latest")
    return "border-accent/40 text-accent-hi bg-accent/10";
  return "border-rim/50 text-ink-muted bg-surface/60";
}

/* ── Component ───────────────────────────────────────────────── */

export function Changelog() {
  return (
    <StaggerContainer className="relative flex flex-col">
      {/* Continuous vertical connector */}
      <div
        aria-hidden
        className="absolute left-[5.25rem] top-3 bottom-3 w-px bg-gradient-to-b from-accent-hi/40 via-rim/30 to-transparent pointer-events-none"
      />

      {RELEASES.map((release) => (
        <StaggerItem key={release.version}>
          <article className="relative flex gap-5 sm:gap-6 pb-12 last:pb-0">

            {/* ── Left: version badge + date ─────────────────── */}
            <div className="flex flex-col items-end gap-1.5 w-20 shrink-0 pt-0.5">
              <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${releaseBadgeClass(release.label)}`}>
                {release.version}
              </span>
              <span className="font-mono text-[10px] text-ink-muted/50 whitespace-nowrap text-right leading-tight">
                {release.date}
              </span>
            </div>

            {/* ── Timeline dot ──────────────────────────────── */}
            <div className="relative shrink-0 pt-1 z-10">
              <span className={`block w-3 h-3 rounded-full ring-4 ring-offset-0 ${releaseDotClass(release.label)} ${release.label === "latest" ? "ring-accent-hi/15" : "ring-ink-muted/10"}`} />
            </div>

            {/* ── Content ───────────────────────────────────── */}
            <div className="flex flex-col gap-3 flex-1 min-w-0 pt-0.5">
              <p className="text-sm font-semibold text-ink leading-snug">
                {release.summary}
              </p>

              <ul className="space-y-2">
                {release.changes.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-ink-muted leading-relaxed">
                    <KindBadge kind={item.kind} />
                    <span><ChangeText text={item.text} /></span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
