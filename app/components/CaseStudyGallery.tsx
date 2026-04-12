"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ProjectImage } from "@/lib/data/projects";

/* ── Blob URLs (same strategy as ImageGallery) ─────────────────── */

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

type GalleryContextValue = {
  images: ProjectImage[];
  blobUrls: string[];
  openAt: (globalIndex: number) => void;
  selectedIdx: number | null;
  close: () => void;
};

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function CaseStudyGalleryProvider({
  images,
  children,
}: {
  images: ProjectImage[];
  children: React.ReactNode;
}) {
  const blobUrls = useBlobUrls(images);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const openAt = useCallback((globalIndex: number) => {
    if (globalIndex >= 0 && globalIndex < images.length) setSelectedIdx(globalIndex);
  }, [images.length]);

  const close = useCallback(() => setSelectedIdx(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" && selectedIdx !== null) {
        setSelectedIdx((i) => ((i! + 1) % images.length));
      }
      if (e.key === "ArrowLeft" && selectedIdx !== null) {
        setSelectedIdx((i) => (i! - 1 + images.length) % images.length);
      }
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

  const selectedImage = selectedIdx !== null ? images[selectedIdx] : null;
  const selectedBlob =
    selectedIdx !== null ? (blobUrls[selectedIdx] ?? images[selectedIdx]?.src) : null;

  const value: GalleryContextValue = {
    images,
    blobUrls,
    openAt,
    selectedIdx,
    close,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
      {selectedImage && selectedBlob != null && (
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIdx((i) => ((i! + 1) % images.length));
                  }}
                  aria-label="Next image"
                  className="absolute right-12 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
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
    </GalleryContext.Provider>
  );
}

/** Thumbnails that open the shared lightbox at global indices (same pool as the rest of the case study). */
export function CaseStudyGalleryThumbs({
  indices,
  compact = false,
}: {
  indices: number[];
  compact?: boolean;
}) {
  const ctx = useContext(GalleryContext);
  const [thumbError, setThumbError] = useState<Record<number, boolean>>({});

  if (!ctx || !indices.length) return null;

  const { images, blobUrls, openAt } = ctx;

  const singleCompact = compact && indices.length === 1;

  const gridClass = compact
    ? singleCompact
      ? "grid-cols-1 w-full"
      : indices.length >= 3
        ? "grid-cols-2 sm:grid-cols-3 max-w-2xl mx-auto"
        : "grid-cols-1 sm:grid-cols-2 max-w-xl mx-auto"
    : indices.length === 1
      ? "grid-cols-1 max-w-lg mx-auto"
      : indices.length >= 3
        ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
        : "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto";

  const thumbFrameSquareCompact =
    "mx-auto aspect-square w-full max-w-[min(100%,152px)] sm:max-w-[172px]";
  const thumbFrameSquareDefault =
    "mx-auto aspect-square w-full max-w-[min(100%,200px)] sm:max-w-[236px]";

  const gridGap = compact ? "gap-2 sm:gap-2.5" : "gap-2.5 sm:gap-3";

  return (
    <div className={`grid ${gridClass} ${gridGap}`}>
      {indices.map((globalIdx) => {
        const img = images[globalIdx];
        if (!img) return null;
        const displaySrc = blobUrls[globalIdx] ?? null;
        const key = `${globalIdx}-${img.src}`;

        return (
          <figure
            key={key}
            className={`flex flex-col ${singleCompact ? "w-full max-w-xl mx-auto gap-2" : `items-center ${compact ? "gap-1" : "gap-1.5 sm:gap-2"}`}`}
          >
            <button
              type="button"
              onClick={() => openAt(globalIdx)}
              className={
                singleCompact
                  ? "group relative flex w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-lg border border-rim/45 bg-black/20 p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hi"
                  : `group relative flex cursor-zoom-in items-center justify-center overflow-hidden rounded-lg border border-rim/45 bg-black/20 p-1.5 sm:p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hi ${compact ? thumbFrameSquareCompact : thumbFrameSquareDefault}`
              }
              aria-label={`Open larger: ${img.alt}`}
            >
              {displaySrc && !thumbError[globalIdx] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={displaySrc}
                  alt={img.alt}
                  draggable={false}
                  onContextMenu={noCtx}
                  onError={() => setThumbError((prev) => ({ ...prev, [globalIdx]: true }))}
                  className={
                    singleCompact
                      ? "w-full h-auto max-h-[min(20rem,40vh)] object-contain object-center select-none transition-transform duration-300 group-hover:scale-[1.01]"
                      : "h-full w-full max-h-full max-w-full object-contain object-center select-none transition-transform duration-300 group-hover:scale-[1.02]"
                  }
                />
              ) : displaySrc && thumbError[globalIdx] ? (
                <div className="px-4 py-8 text-center text-sm text-ink-muted">Image unavailable</div>
              ) : (
                <div className="h-full w-full animate-pulse rounded-md bg-surface/80" />
              )}
              <span className="absolute bottom-1.5 right-1.5 pointer-events-none rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                Enlarge
              </span>
            </button>
            {img.caption && (
              <figcaption
                title={img.caption}
                className={`w-full text-left leading-snug text-ink-muted/90 font-sans line-clamp-3 ${compact ? "text-[10px] sm:text-[11px]" : "text-[11px] sm:text-xs"}`}
              >
                {img.caption}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}
