"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProjectImage } from "@/lib/data/projects";

/* ── Blob-URL obfuscation ─────────────────────────────────────────
   Every image is fetched once, converted to an object URL, and
   rendered from that blob. The Elements panel shows only
   blob:https://…  — no path, no filename. Blobs are revoked on
   component unmount to avoid memory leaks.
──────────────────────────────────────────────────────────────── */

function useBlobUrls(images: ProjectImage[]) {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!images?.length) return;
    let revoked = false;
    const created: string[] = [];

    Promise.all(
      images.map((img) =>
        fetch(img.src)
          .then((r) => r.blob())
          .then((blob) => {
            const u = URL.createObjectURL(blob);
            created.push(u);
            return u;
          })
          .catch(() => img.src) // fallback to real src if fetch fails
      )
    ).then((resolved) => {
      if (!revoked) setUrls(resolved);
    });

    return () => {
      revoked = true;
      created.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [images]);

  return urls;
}

/* ── Context-menu / drag prevention ──────────────────────────── */

const noCtx = (e: React.MouseEvent) => e.preventDefault();

/* ── Gallery component ────────────────────────────────────────── */

export function ImageGallery({ images }: { images: ProjectImage[] }) {
  const blobUrls = useBlobUrls(images);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const close = useCallback(() => setSelectedIdx(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" && selectedIdx !== null)
        setSelectedIdx((i) => (i! + 1) % images.length);
      if (e.key === "ArrowLeft" && selectedIdx !== null)
        setSelectedIdx((i) => (i! - 1 + images.length) % images.length);
    };
    if (selectedIdx !== null) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selectedIdx, close, images.length]);

  if (!images?.length) return null;

  const gridClass =
    images.length === 1
      ? "grid-cols-1"
      : images.length === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const selectedImage = selectedIdx !== null ? images[selectedIdx] : null;
  const selectedBlob  = selectedIdx !== null ? (blobUrls[selectedIdx] ?? images[selectedIdx].src) : null;

  return (
    <>
      {/* ── Thumbnail grid ──────────────────────────────────── */}
      <div className={`grid ${gridClass} gap-4 mt-4`}>
        {images.map((img, i) => {
          const displaySrc = blobUrls[i] ?? null;
          return (
            <figure key={i} className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedIdx(i)}
                className="group relative w-full aspect-video rounded-xl overflow-hidden border border-rim/50 bg-surface cursor-zoom-in focus-visible:outline-2 focus-visible:outline-accent-hi"
                aria-label={`Enlarge: ${img.alt}`}
              >
                {displaySrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={displaySrc}
                    alt={img.alt}
                    draggable={false}
                    onContextMenu={noCtx}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] select-none pointer-events-none"
                  />
                ) : (
                  /* Skeleton while blobs load */
                  <div className="absolute inset-0 bg-surface animate-pulse" />
                )}

                {/* Enlarge hint */}
                <span className="absolute inset-0 flex items-end justify-end p-3 pointer-events-none">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/65 text-white text-[11px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M15 3h6m0 0v6m0-6-7 7M9 21H3m0 0v-6m0 6 7-7" />
                    </svg>
                    Enlarge
                  </span>
                </span>
              </button>

              {img.caption && (
                <figcaption className="text-xs text-ink-muted text-center font-mono leading-relaxed">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {/* ── Lightbox modal ───────────────────────────────────── */}
      {selectedImage && selectedBlob && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt}
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative max-w-5xl w-full rounded-2xl overflow-hidden bg-black/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedBlob}
              alt={selectedImage.alt}
              draggable={false}
              onContextMenu={noCtx}
              className="block max-h-[80vh] w-full object-contain select-none"
              style={{ WebkitUserDrag: "none" } as React.CSSProperties}
            />

            {selectedImage.caption && (
              <p className="text-sm text-white/70 text-center font-mono py-3 px-4 bg-black/40">
                {selectedImage.caption}
              </p>
            )}

            {/* Prev / Next arrows (when multiple images) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedIdx((i) => (i! - 1 + images.length) % images.length); }}
                  aria-label="Previous"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedIdx((i) => (i! + 1) % images.length); }}
                  aria-label="Next"
                  className="absolute right-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </>
            )}

            {/* Close */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
