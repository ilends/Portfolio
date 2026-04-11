"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProjectImage } from "@/lib/data/projects";

/* ── Blob-URL obfuscation ─────────────────────────────────────────
   Images are fetched once, converted to object URLs, and rendered
   from that blob. Blobs are revoked on unmount.
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
          .catch(() => img.src)
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

const noCtx = (e: React.MouseEvent) => e.preventDefault();

export function ImageGallery({ images }: { images: ProjectImage[] }) {
  const blobUrls = useBlobUrls(images);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [thumbError, setThumbError] = useState<Record<number, boolean>>({});

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
      ? "grid-cols-1 max-w-lg mx-auto"
      : images.length >= 3
        ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
        : "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto";

  const selectedImage = selectedIdx !== null ? images[selectedIdx] : null;
  const selectedBlob =
    selectedIdx !== null ? (blobUrls[selectedIdx] ?? images[selectedIdx].src) : null;

  return (
    <>
      <div className={`grid ${gridClass} gap-2.5 sm:gap-3`}>
        {images.map((img, i) => {
          const displaySrc = blobUrls[i] ?? null;
          return (
            <figure key={i} className="flex flex-col gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setSelectedIdx(i)}
                className="group relative w-full cursor-zoom-in overflow-hidden rounded-lg border border-rim/45 bg-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hi"
                aria-label={`Open larger: ${img.alt}`}
              >
                <div className="flex min-h-[72px] items-center justify-center p-1.5 sm:min-h-[88px] sm:p-2">
                  {displaySrc && !thumbError[i] ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={displaySrc}
                      alt={img.alt}
                      draggable={false}
                      onContextMenu={noCtx}
                      onError={() =>
                        setThumbError((prev) => ({ ...prev, [i]: true }))
                      }
                      className="max-h-[min(120px,22vh)] sm:max-h-[min(140px,24vh)] w-full object-contain object-center select-none transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : displaySrc && thumbError[i] ? (
                    <div className="px-4 py-12 text-center text-sm text-ink-muted">
                      Image unavailable
                    </div>
                  ) : (
                    <div className="h-20 w-full animate-pulse rounded-md bg-surface/80" />
                  )}
                </div>
                <span className="absolute bottom-1.5 right-1.5 pointer-events-none rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Enlarge
                </span>
              </button>

              {img.caption && (
                <figcaption
                  title={img.caption}
                  className="text-left text-[11px] sm:text-xs leading-snug text-ink-muted/90 font-sans line-clamp-3"
                >
                  {img.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {selectedImage && selectedBlob && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt}
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-black/50 shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedBlob}
              alt={selectedImage.alt}
              draggable={false}
              onContextMenu={noCtx}
              className="block max-h-[85vh] w-full object-contain select-none bg-black/40"
              style={{ WebkitUserDrag: "none" } as React.CSSProperties}
            />

            {selectedImage.caption && (
              <p className="text-sm text-white/80 font-sans py-3 px-4 bg-black/60 border-t border-white/10">
                {selectedImage.caption}
              </p>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIdx((i) => (i! - 1 + images.length) % images.length);
                  }}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIdx((i) => (i! + 1) % images.length);
                  }}
                  aria-label="Next image"
                  className="absolute right-12 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
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
