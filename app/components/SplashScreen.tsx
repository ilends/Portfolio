"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPLASH_KEY = "da-splash-v1";

/* ── Wave layers ──────────────────────────────────────────────── */

function Waves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
      {/* Layer 1 — slowest, most transparent */}
      <motion.div
        style={{ position: "absolute", bottom: 0, left: "-10%", right: "-10%" }}
        animate={{ x: ["0%", "-8%", "0%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 1440 180"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "120%", height: 180, display: "block" }}
        >
          <path
            d="M0,90 C240,130 480,50 720,90 C960,130 1200,50 1440,90 L1440,180 L0,180 Z"
            fill="rgba(34,211,238,0.04)"
          />
        </svg>
      </motion.div>

      {/* Layer 2 — medium */}
      <motion.div
        style={{ position: "absolute", bottom: 0, left: "-10%", right: "-10%" }}
        animate={{ x: ["0%", "6%", "0%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 1440 160"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "120%", height: 160, display: "block" }}
        >
          <path
            d="M0,70 C360,20 720,120 1080,70 C1260,45 1380,95 1440,70 L1440,160 L0,160 Z"
            fill="rgba(34,211,238,0.06)"
          />
        </svg>
      </motion.div>

      {/* Layer 3 — fastest, most opaque, closest to viewer */}
      <motion.div
        style={{ position: "absolute", bottom: 0, left: "-10%", right: "-10%" }}
        animate={{ x: ["0%", "-5%", "0%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 1440 140"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "120%", height: 140, display: "block" }}
        >
          <path
            d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,25 1440,50 L1440,140 L0,140 Z"
            fill="rgba(8,145,178,0.09)"
          />
        </svg>
      </motion.div>

      {/* Solid wave floor */}
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ width: "100%", height: 80, display: "block" }}
      >
        <path
          d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,80 L0,80 Z"
          fill="rgba(34,211,238,0.05)"
        />
      </svg>
    </div>
  );
}

/* ── Splash screen ────────────────────────────────────────────── */

export function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) return;
    setShow(true);

    const dismiss = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem(SPLASH_KEY, "1");
    }, 2000);

    return () => clearTimeout(dismiss);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.9,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#060b12" }}
        >
          {/* Animated waves */}
          <Waves />

          {/* Center content */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
            className="relative z-10 flex flex-col items-center gap-5"
          >
            {/* DA monogram */}
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold tracking-tight shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #0891b2, #22d3ee)",
                boxShadow: "0 0 40px rgba(34,211,238,0.25), 0 0 0 4px rgba(34,211,238,0.12)",
              }}
              animate={{
                boxShadow: [
                  "0 0 40px rgba(34,211,238,0.25), 0 0 0 4px rgba(34,211,238,0.12)",
                  "0 0 60px rgba(34,211,238,0.40), 0 0 0 8px rgba(34,211,238,0.08)",
                  "0 0 40px rgba(34,211,238,0.25), 0 0 0 4px rgba(34,211,238,0.12)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              DA
            </motion.div>

            {/* Name */}
            <div className="text-center">
              <p
                className="text-2xl font-bold tracking-tight"
                style={{ color: "#cfe8f5" }}
              >
                David Angelo
              </p>
              <p
                className="text-[11px] font-mono tracking-[0.22em] uppercase mt-1"
                style={{ color: "rgba(34,211,238,0.5)" }}
              >
                Engineering Science · UofT
              </p>
            </div>

            {/* Progress bar */}
            <div
              className="w-48 rounded-full overflow-hidden"
              style={{ height: 2, backgroundColor: "rgba(21,37,53,0.8)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "#22d3ee" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.85, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
