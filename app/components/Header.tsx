"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "About",      href: "/" },
  { label: "Experience", href: "/experience" },
  { label: "Projects",   href: "/projects" },
  { label: "Contact",    href: "/contact" },
];

/* ── Icons ────────────────────────────────────────────────────── */

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6"  x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/* ── Status beacon ────────────────────────────────────────────── */

function StatusIndicator() {
  return (
    <a
      href="mailto:research@davidangelo.ca"
      className="hidden sm:flex items-center gap-2 group"
      aria-label="Email David Angelo about research opportunities"
    >
      <span className="w-px h-4 bg-rim/50" />
      <span className="radar-dot w-2 h-2 rounded-full bg-accent-hi shrink-0" />
      <span className="font-mono text-[11px] tracking-wider text-ink-muted group-hover:text-ink transition-colors duration-150">
        <span className="text-accent-hi/80 group-hover:text-accent-hi transition-colors duration-150">STATUS</span>
        <span className="text-rim/60 mx-1">:</span>
        <span className="hidden md:inline group-hover:underline underline-offset-2 decoration-accent-hi/40">SEEKING RESEARCH OPPORTUNITIES</span>
        <span className="inline md:hidden">ACTIVE</span>
      </span>
    </a>
  );
}

/* ── Theme toggle ─────────────────────────────────────────────── */

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="flex items-center justify-center w-8 h-8 rounded-full border border-rim/50 text-ink-muted hover:text-ink hover:border-accent-hi/50 hover:bg-card transition-colors duration-150 cursor-pointer"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

/* ── Header ───────────────────────────────────────────────────── */

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  /* Close drawer on route change */
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  /* Lock body scroll while drawer is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 py-4 border-b border-rim/30 bg-surface/75 backdrop-blur-md">

        {/* Left: logo + status beacon */}
        <div className="flex items-center gap-3 mr-auto">
          <Link
            href="/"
            className="font-mono text-sm font-bold tracking-widest text-accent-hi uppercase hover:opacity-75 transition-opacity"
          >
            DA
          </Link>
          <StatusIndicator />
        </div>

        {/* Desktop nav (sm and up) */}
        <div className="hidden sm:flex items-center gap-1">
          <nav className="flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={label}
                  href={href}
                  className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                    isActive ? "text-ink bg-card" : "text-ink-muted hover:text-ink hover:bg-card"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <span className="w-px h-5 bg-rim/40 mx-2" />
          <ThemeToggle />
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-rim/50 text-ink-muted hover:text-ink hover:border-accent-hi/50 hover:bg-card transition-colors duration-150 cursor-pointer"
          >
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {/* Mobile slide-down drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setMenuOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Panel */}
          <nav
            className="absolute top-[65px] left-0 right-0 border-b border-rim/30 bg-surface/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-colors duration-150 ${
                    isActive
                      ? "text-ink bg-card border border-rim/50"
                      : "text-ink-muted hover:text-ink hover:bg-card"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            {/* Status line inside drawer */}
            <a
              href="mailto:research@davidangelo.ca"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 mt-1 rounded-lg border border-rim/30 text-xs font-mono text-ink-muted hover:text-ink hover:bg-card transition-colors duration-150"
            >
              <span className="radar-dot w-2 h-2 rounded-full bg-accent-hi shrink-0" />
              <span className="text-accent-hi/80">STATUS</span>
              <span className="text-rim/60">:</span>
              <span className="text-ink-muted">SEEKING RESEARCH OPPORTUNITIES</span>
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
