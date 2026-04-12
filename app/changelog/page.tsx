import type { Metadata } from "next";
import { FadeIn } from "../components/FadeIn";
import { Changelog } from "../components/Changelog";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Release history for davidangelo.ca — what changed and when.",
  keywords: [
    "Engineering Science",
    "University of Toronto",
    "Clinical Engineering",
    "davidangelo.ca",
  ],
};

export default function ChangelogPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 sm:px-8 pt-28 pb-32">

      {/* ── Page header ──────────────────────────────────────── */}
      <FadeIn>
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <h1 className="text-5xl font-medium text-ink tracking-tight">
              Changelog
            </h1>
            {/* Live badge */}
            <span className="self-end mb-1.5 inline-flex items-center gap-1.5 font-sans text-[11px] font-medium tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border border-accent/35 text-accent-hi bg-accent/10">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-hi shadow-[0_0_8px_2px_rgba(96,165,250,0.28)]" />
              v2.0.0
            </span>
          </div>
          <p className="text-base text-ink-muted leading-[1.65] max-w-xl">
            A running log of every release — what was added, improved, or hardened, and when it shipped.
          </p>

          {/* Divider */}
          <div className="mt-10 h-px bg-gradient-to-r from-accent-hi/30 via-rim/40 to-transparent" />
        </div>
      </FadeIn>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <FadeIn delay={0.06}>
        <Changelog />
      </FadeIn>

    </main>
  );
}
