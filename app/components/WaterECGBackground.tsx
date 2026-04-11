"use client";

import { motion } from "framer-motion";

/* ── Path data (original dramatic trace + sine) ─────────────────
   ViewBox: 0 0 1400 300
   ECG baseline: y=130   |  Spike peak: y=30
   Sine baseline: y=210  |  Amplitude: ±45px (y=165 peak, y=255 trough)
   Stroke uses current accent #60a5fa + SVG glow (feGaussianBlur merge)
──────────────────────────────────────────────────────────────── */

const ECG_PATH =
  "M 0,130 L 70,130 " +
  "Q 85,108 100,130 L 133,130 L 143,143 L 152,30 L 161,147 L 175,130 " +
  "Q 200,92 235,130 L 350,130 " +
  "Q 365,108 380,130 L 413,130 L 423,143 L 432,30 L 441,147 L 455,130 " +
  "Q 480,92 515,130 L 700,130 " +
  "Q 715,108 730,130 L 763,130 L 773,143 L 782,30 L 791,147 L 805,130 " +
  "Q 830,92 865,130 L 1050,130 " +
  "Q 1065,108 1080,130 L 1113,130 L 1123,143 L 1132,30 L 1141,147 L 1155,130 " +
  "Q 1180,92 1215,130 L 1400,130";

const WAVE_PATH =
  "M 0,210 " +
  "C 35,165 105,165 140,210 C 175,255 245,255 280,210 " +
  "C 315,165 385,165 420,210 C 455,255 525,255 560,210 " +
  "C 595,165 665,165 700,210 C 735,255 805,255 840,210 " +
  "C 875,165 945,165 980,210 C 1015,255 1085,255 1120,210 " +
  "C 1155,165 1225,165 1260,210 C 1295,255 1365,255 1400,210";

export type ECGPhase = "idle" | "drawing" | "background";

interface Props {
  phase: ECGPhase;
  onDrawingComplete?: () => void;
}

export function WaterECGBackground({ phase, onDrawingComplete }: Props) {
  return (
    <div
      className="absolute pointer-events-none overflow-hidden"
      style={{
        top: "50%",
        left: 0,
        right: 0,
        height: "50vh",
        transform: "translateY(-50%)",
      }}
    >
      <svg
        viewBox="0 0 1400 300"
        preserveAspectRatio="none"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <filter id="ecg-glow" x="-10%" y="-80%" width="120%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d={ECG_PATH}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ecg-glow)"
          animate={{
            pathLength: phase === "idle" ? 0 : 1,
            opacity:
              phase === "idle" ? 0
              : phase === "drawing" ? 1
              : 0.09,
          }}
          transition={{
            pathLength:
              phase === "drawing"
                ? { duration: 2.5, ease: "easeInOut" }
                : { duration: 0 },
            opacity:
              phase === "drawing"
                ? { duration: 0.15 }
                : phase === "background"
                ? { duration: 1.5, ease: "easeInOut" }
                : { duration: 0 },
          }}
        />

        <motion.path
          d={WAVE_PATH}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#ecg-glow)"
          animate={{
            pathLength: phase === "idle" ? 0 : 1,
            opacity:
              phase === "idle" ? 0
              : phase === "drawing" ? 0.7
              : 0.07,
          }}
          transition={{
            pathLength:
              phase === "drawing"
                ? { duration: 1.8, ease: "easeInOut", delay: 2.8 }
                : { duration: 0 },
            opacity:
              phase === "drawing"
                ? { duration: 0.15, delay: 2.8 }
                : phase === "background"
                ? { duration: 1.5, ease: "easeInOut" }
                : { duration: 0 },
          }}
          onAnimationComplete={() => {
            if (phase === "drawing") onDrawingComplete?.();
          }}
        />
      </svg>
    </div>
  );
}
