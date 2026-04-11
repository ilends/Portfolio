"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPLASH_KEY = "da-splash-v2";

/** Same stack as the rest of the site (Geist) — reads close to SF Pro on Apple */
const splashSans = "font-sans antialiased";

/* ── Ambient scatter ────────────────────────────────────────── */

const MARKS = [
  { x: "8%", y: "18%" },
  { x: "15%", y: "72%" },
  { x: "22%", y: "38%" },
  { x: "78%", y: "25%" },
  { x: "85%", y: "65%" },
  { x: "91%", y: "42%" },
  { x: "68%", y: "82%" },
  { x: "32%", y: "88%" },
  { x: "55%", y: "12%" },
  { x: "44%", y: "60%" },
];

function AmbientMarks() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {MARKS.map((m, i) => (
        <motion.span
          key={i}
          className="absolute text-accent-hi/[0.09] font-sans text-xs"
          style={{ left: m.x, top: m.y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.55, 0] }}
          transition={{
            delay: 0.4 + i * 0.18,
            duration: 3,
            repeat: Infinity,
            repeatDelay: 4 + i * 0.5,
            ease: "easeInOut",
          }}
        >
          +
        </motion.span>
      ))}
    </div>
  );
}

/* ── Splash screen ────────────────────────────────────────────── */

export function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) return;
    setShow(true);
  }, []);

  function dismiss() {
    window.dispatchEvent(new CustomEvent("splash-open-file"));
    setShow(false);
    sessionStorage.setItem(SPLASH_KEY, "1");
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#0b0f14" }}
        >
          {/* Centre glow — softer wash */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_52%_at_50%_44%,rgba(96,165,250,0.045),transparent_72%)]"
            aria-hidden
          />
          <AmbientMarks />

          {/* Centre content — clearer tiers: name / subtitle / CTA */}
          <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
              className={`mb-4 whitespace-nowrap sm:mb-5 ${splashSans}`}
              style={{
                fontWeight: 600,
                fontSize: "clamp(3.2rem, 10vw, 7rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                background: "linear-gradient(130deg, #ffffff 35%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              David Angelo
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.5 }}
              className={`mb-10 whitespace-nowrap text-center text-[clamp(12px,3vw,14px)] font-medium uppercase leading-relaxed tracking-[0.1em] text-sky-300/55 sm:mb-11 sm:tracking-[0.12em] ${splashSans}`}
            >
              Engineering Science · University of Toronto
            </motion.p>

            {/*
              Real transparency: no gradient on the button itself — a transparent child on top of
              a gradient parent still shows the parent’s paint. One layer + border only = splash shows through.
            */}
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.92 }}
              onClick={dismiss}
              whileTap={{ scale: 0.99 }}
              className={`relative inline-flex min-h-[2.65rem] min-w-[10.25rem] items-center justify-center rounded-full border-2 border-blue-500/50 bg-transparent px-10 py-2.5 text-center text-[12px] font-medium uppercase tracking-[0.16em] text-blue-200/90 transition-[border-color,background-color,color] duration-200 hover:border-blue-400/75 hover:bg-blue-500/[0.12] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14] sm:text-[13px] ${splashSans}`}
            >
              Open File
            </motion.button>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(to right, transparent, rgba(96,165,250,0.14), transparent)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
