import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The requested page could not be found. Return to davidangelo.ca to explore Engineering Science projects, experience, and contact information.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="relative z-10 mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 pb-24 pt-32 text-center">
      <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-accent-hi/80">
        Error 404
      </p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
        This page isn&apos;t available
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">
        The URL may have changed or the link may be outdated. You can head back
        to the homepage to continue browsing.
      </p>
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/"
          className="inline-flex min-h-11 min-w-[11rem] items-center justify-center rounded-full border border-accent-hi/60 bg-accent/15 px-8 py-3 text-base font-medium text-accent-hi transition-colors hover:border-accent-hi hover:bg-accent/25"
        >
          Back to home
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-h-11 min-w-[11rem] items-center justify-center rounded-full border border-rim/50 px-8 py-3 text-base font-medium text-ink-muted transition-colors hover:border-accent-hi/40 hover:bg-card hover:text-ink"
        >
          Contact
        </Link>
      </div>
    </main>
  );
}
