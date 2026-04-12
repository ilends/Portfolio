"use client";

import { useEffect, useRef } from "react";

// â”€â”€ Layout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ROW_H = 96;
const SCROLL_SPEED = 15;
const BALL_SPEED = 95;
const BALL_R = 2.1;

// â”€â”€ Beat shape (scrolling baseline) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BEAT_W = 90;
const BEAT_SHAPE: [number, number][] = [
  [0, 0],
  [5, 0],
  [10, -5],
  [16, 0],
  [24, 0],
  [27, 3],
  [30, -26],
  [33, 13],
  [36, 0],
  [43, 1],
  [50, -10],
  [60, 0],
  [BEAT_W, 0],
];

function getBeatYOffset(x: number): number {
  if (x < 0 || x > BEAT_W) return 0;
  for (let i = 0; i < BEAT_SHAPE.length - 1; i++) {
    const [x0, y0] = BEAT_SHAPE[i];
    const [x1, y1] = BEAT_SHAPE[i + 1];
    if (x >= x0 && x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return 0;
}

function h(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

interface RowCfg {
  beatSpacing: number;
  phaseOffset: number;
}

function makeRowCfg(row: number): RowCfg {
  const beatSpacing = Math.round(520 + h(row * 3 + 0.5) * 260);
  const phaseOffset = Math.round(h(row * 7 + 2.3) * beatSpacing);
  return { beatSpacing, phaseOffset };
}

const PHASES = [0, 0.37, 0.61, 0.14, 0.82, 0.5, 0.25, 0.73, 0.44, 0.91, 0.07, 0.55];

/** Muted blue-slate â€” readable motion without â€œterminal laserâ€ intensity */
function trailRgb(dark: boolean): string {
  return dark ? "130, 162, 198" : "82, 118, 165";
}

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rowCfgsRef = useRef<RowCfg[]>([]);

  function ensureConfigs(n: number) {
    while (rowCfgsRef.current.length < n) {
      rowCfgsRef.current.push(makeRowCfg(rowCfgsRef.current.length));
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf: number | null = null;
    let startTime: number | null = null;
    let accumulatedMs = 0;
    let lastDrawTs: number | null = null;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ensureConfigs(Math.ceil(canvas.height / ROW_H) + 2);
    }

    function draw(ts: number) {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      lastDrawTs = ts;
      if (startTime === null) startTime = ts;
      const elapsed = (accumulatedMs + (ts - startTime)) / 1000;
      const scrollX = elapsed * SCROLL_SPEED;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const dark = document.documentElement.classList.contains("dark");
      const rgb = trailRgb(dark);

      const numRows = Math.ceil(height / ROW_H) + 2;
      ensureConfigs(numRows);

      for (let row = 0; row < numRows; row++) {
        const { beatSpacing, phaseOffset } = rowCfgsRef.current[row];
        const rowCenterY = row * ROW_H + ROW_H / 2;
        const tilePhase = (scrollX + phaseOffset) % beatSpacing;

        ctx.save();
        ctx.translate(-tilePhase, 0);

        const numTiles = Math.ceil((width + tilePhase) / beatSpacing) + 2;
        ctx.beginPath();
        ctx.moveTo(-beatSpacing, rowCenterY);

        for (let t = -1; t < numTiles; t++) {
          const tx = t * beatSpacing;
          for (const [bx, by] of BEAT_SHAPE) {
            ctx.lineTo(tx + bx, rowCenterY + by);
          }
          ctx.lineTo(tx + beatSpacing, rowCenterY);
        }

        ctx.lineWidth = 5;
        ctx.strokeStyle = `rgba(${rgb},0.01)`;
        ctx.stroke();
        ctx.lineWidth = 1.05;
        ctx.strokeStyle = `rgba(${rgb},0.022)`;
        ctx.stroke();
        ctx.restore();

        const ballX =
          (elapsed * BALL_SPEED + PHASES[row % PHASES.length] * width) % width;
        const ballTileX = (ballX + tilePhase) % beatSpacing;
        const ballY = rowCenterY + getBeatYOffset(ballTileX);

        const outerR = 22;
        const outer = ctx.createRadialGradient(
          ballX,
          ballY,
          0,
          ballX,
          ballY,
          outerR,
        );
        outer.addColorStop(0, `rgba(${rgb},0.05)`);
        outer.addColorStop(0.45, `rgba(${rgb},0.02)`);
        outer.addColorStop(1, `rgba(${rgb},0)`);
        ctx.beginPath();
        ctx.fillStyle = outer;
        ctx.arc(ballX, ballY, outerR, 0, Math.PI * 2);
        ctx.fill();

        const midR = 6;
        const mid = ctx.createRadialGradient(
          ballX,
          ballY,
          0,
          ballX,
          ballY,
          midR,
        );
        mid.addColorStop(0, `rgba(${rgb},0.14)`);
        mid.addColorStop(1, `rgba(${rgb},0)`);
        ctx.beginPath();
        ctx.fillStyle = mid;
        ctx.arc(ballX, ballY, midR, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb},0.38)`;
        ctx.arc(ballX, ballY, BALL_R, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    function start() {
      if (raf !== null) return;
      startTime = null;
      raf = requestAnimationFrame(draw);
    }

    function stop() {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      if (startTime !== null && lastDrawTs !== null) {
        accumulatedMs += lastDrawTs - startTime;
        startTime = null;
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") stop();
      else start();
    }
    function handlePageHide() {
      stop();
    }
    function handlePageShow() {
      start();
    }

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        backgroundImage: [
          "linear-gradient(var(--grid-minor) 1px, transparent 1px)",
          "linear-gradient(90deg, var(--grid-minor) 1px, transparent 1px)",
          "linear-gradient(var(--grid-major) 1px, transparent 1px)",
          "linear-gradient(90deg, var(--grid-major) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "24px 24px, 24px 24px, 120px 120px, 120px 120px",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block mix-blend-multiply opacity-[0.88] dark:mix-blend-screen dark:opacity-100"
      />
    </div>
  );
}
