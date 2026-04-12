import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/app/components/FadeIn";
import { CHRONOLOGICAL_PORTFOLIO_DESIGN_REFERENCES } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Design project references",
  description:
    "IEEE-style reference list for Praxis I, CIV102, and Praxis II design deliverables, in chronological portfolio order.",
};

export default function DesignReferencesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 xl:px-8 pt-28 pb-24 flex flex-col gap-10">
      <FadeIn>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-accent-hi transition-colors group mb-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-0.5"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Projects
        </Link>
        <h1 className="text-4xl sm:text-5xl font-medium text-ink tracking-tight leading-tight mb-3">
          References
        </h1>
        <p className="text-base text-ink-muted leading-relaxed">
          IEEE-style bibliography for completed University of Toronto design case studies on this site. In-text citations
          use the same bracket numbers as shown in the case study pages.
        </p>
        <p className="w-full text-sm text-ink-muted/95 leading-relaxed mt-5 border-l-2 border-accent-hi/30 pl-3 pr-1">
          <span className="font-medium text-ink/90">CTMFs.</span> Names and working definitions of concepts, tools, models,
          and frameworks on the case study pages follow Praxis I and II lecture materials (slides), except where a case
          study explicitly cites another source.
        </p>
      </FadeIn>

      <FadeIn>
        <div className="rounded-xl border border-rim/40 bg-card/20 px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-accent-hi/90 mb-4">
            Document references
          </p>
          <ol className="list-none space-y-4 m-0 p-0">
            {CHRONOLOGICAL_PORTFOLIO_DESIGN_REFERENCES.map((ref, i) => {
              const n = i + 1;
              return (
                <li key={n} className="text-sm leading-relaxed text-ink-muted font-sans pl-0">
                  <span className="text-ink/85 font-medium tabular-nums">[{n}]</span>{" "}
                  <span>{ref.ieee}</span>
                  {ref.href ? (
                    <>
                      {" "}
                      <a
                        href={ref.href}
                        className="text-accent-hi underline decoration-accent-hi/40 underline-offset-2 hover:decoration-accent-hi whitespace-nowrap"
                      >
                        PDF
                      </a>
                    </>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </FadeIn>
    </main>
  );
}
