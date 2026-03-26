"use client";

import { useEffect, useRef } from "react";

const SPACING = 28;
const GLOW_RADIUS = 135;

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let mx = -9999;
    let my = -9999;
    let raf: number;

    function resize() {
      const c = canvasRef.current;
      if (!c) return;
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    }

    function draw() {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;

      const { width, height } = c;
      ctx.clearRect(0, 0, width, height);

      const dark = document.documentElement.classList.contains("dark");
      const rgb = dark ? "34,211,238" : "8,145,178";

      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * SPACING;
          const y = j * SPACING;
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const prox = Math.max(0, 1 - dist / GLOW_RADIUS);

          const opacity = 0.06 + prox * 0.52;
          const radius = 1 + prox * 2;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${opacity.toFixed(2)})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
    }

    function onMouseLeave() {
      mx = -9999;
      my = -9999;
    }

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
