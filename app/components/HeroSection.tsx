"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { WaterECGBackground, type ECGPhase } from "./WaterECGBackground";

const SPLASH_KEY = "da-splash-v2";

/* ── Icons ────────────────────────────────────────────────────── */

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function MailIcon({ size = 20 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

/* ── big CTAs + subtle icon links ─────────────────── */

function SocialIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink-muted/45 hover:text-accent-hi hover:bg-accent/10 transition-colors duration-200"
    >
      {children}
    </a>
  );
}

/* ── Hero section ─────────────────────────────────────────────── */

export function HeroSection() {
  const [bgPhase, setBgPhase]           = useState<ECGPhase>("idle");
  const [contentVisible, setContent]    = useState(false);
  const [showScrollHint, setScrollHint] = useState(false);
  const mountedRef = useRef(true);
  const timeoutIdsRef = useRef<number[]>([]);

  const pushTimeout = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      if (mountedRef.current) fn();
    }, ms);
    timeoutIdsRef.current.push(id);
    return id;
  }, []);

  function handleContinueClick() {
    const aboutEl = document.getElementById("about");
    if (!aboutEl) return;
    const headerOffset = 88;
    const y = aboutEl.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      timeoutIdsRef.current.forEach(clearTimeout);
      timeoutIdsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const isReturn = !!sessionStorage.getItem(SPLASH_KEY);

    if (isReturn) {
      setBgPhase("background");
      setContent(true);
      pushTimeout(() => setScrollHint(true), 800);
      return;
    }

    /* First visit — lock scroll, wait for "Open File" */
    document.body.style.overflow = "hidden";

    const handler = () => {
      /* Splash fades over 0.8 s — start drawing after it clears */
      pushTimeout(() => setBgPhase("drawing"), 850);
    };

    window.addEventListener("splash-open-file", handler);
    return () => {
      window.removeEventListener("splash-open-file", handler);
      document.body.style.overflow = "";
    };
  }, [pushTimeout]);

  const handleDrawingComplete = useCallback(() => {
    /* Pause on full trace, then fade ECG to quiet background first; only after that fade does hero copy appear */
    const ECG_FADE_MS = 1500; /* matches WaterECGBackground opacity transition into `background` */
    pushTimeout(() => {
      setBgPhase("background");
      pushTimeout(() => {
        setContent(true);
        document.body.style.overflow = "";
        pushTimeout(() => setScrollHint(true), 1200);
      }, ECG_FADE_MS);
    }, 500);
  }, [pushTimeout]);

  return (
    <section className="relative flex min-h-screen min-h-[100dvh] flex-col items-center justify-center overflow-hidden">
      {/* ── Animated background ── */}
      <WaterECGBackground phase={bgPhase} onDrawingComplete={handleDrawingComplete} />

      {/* ── Hero content ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={contentVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center px-6 gap-5"
      >
        {/* Mono kicker */}
        <p className="font-sans text-[11px] tracking-[0.28em] uppercase text-accent-hi/55">
          Engineering Science · University of Toronto
        </p>

        {/* Name */}
        <h1
          className="text-5xl sm:text-7xl font-semibold tracking-tight leading-none"
          style={{
            background:
              "linear-gradient(130deg, var(--color-ink, #e2eaf0) 40%, var(--color-accent-hi, #5b8cc4) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          David Angelo
        </h1>

        {/* Tagline */}
        <p className="text-sm text-ink-muted tracking-[0.18em] uppercase font-medium">
          Emergency Medicine · Biomedical Research · Lifesaving
        </p>

        {/* Big CTAs — closer to original site style */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-2xl mt-2">
          <a
            href="/projects"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full text-base font-medium border border-accent-hi/60 text-accent-hi bg-accent/15 hover:bg-accent/25 hover:border-accent-hi transition-all duration-200"
          >
            View Projects
          </a>
          <a
            href="/api/pdf/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full text-base font-medium border border-rim/50 text-ink-muted bg-transparent hover:text-ink hover:border-accent-hi/40 hover:bg-card transition-all duration-200"
          >
            Resume
          </a>
        </div>

        {/* Subtle icon row */}
        <div className="flex items-center justify-center gap-1 mt-1">
          <SocialIconLink href="https://github.com/ilends" label="GitHub">
            <GitHubIcon size={22} />
          </SocialIconLink>
          <SocialIconLink href="https://linkedin.com/in/david-angelo" label="LinkedIn">
            <LinkedInIcon size={22} />
          </SocialIconLink>
          <SocialIconLink href="mailto:contact@davidangelo.ca" label="Email">
            <MailIcon size={22} />
          </SocialIconLink>
        </div>
      </motion.div>

      {/* ── Continue → About (strong but clean) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollHint ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.button
          type="button"
          onClick={handleContinueClick}
          className="group flex min-h-11 items-center gap-2 rounded-full border border-accent-hi/45 bg-accent/8 px-5 py-2.5 text-accent-hi shadow-[0_0_22px_-8px_rgba(96,165,250,0.22)] backdrop-blur-sm transition-all duration-300 hover:border-accent-hi/70 hover:bg-accent/18"
          animate={{ y: [0, 2, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-accent-hi/90">
            Continue
          </span>
          <span className="opacity-85"><ChevronDownIcon /></span>
        </motion.button>
      </motion.div>
    </section>
  );
}
