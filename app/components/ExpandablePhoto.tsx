"use client";

import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
  caption: string;
  className?: string;
  /** Wraps the preview image (e.g. `aspect-[16/9]`) so `object-cover` crops predictably */
  frameClassName?: string;
  /** CSS `object-position` for the preview (and lightbox uses contain, so mainly preview) */
  objectPosition?: string;
};

const noCtx = (e: React.MouseEvent) => e.preventDefault();

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function ExpandablePhoto({
  src,
  alt,
  caption,
  className,
  frameClassName,
  objectPosition,
}: Props) {
  const [open, setOpen] = useState(false);
  const [blobUrl, setBlobUrl] = useState(src);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
  }, [src]);

  useEffect(() => {
    let revoked = false;
    let created: string | null = null;

    fetch(src)
      .then((r) => r.blob())
      .then((blob) => {
        if (revoked) return;
        created = URL.createObjectURL(blob);
        setBlobUrl(created);
      })
      .catch(() => setBlobUrl(src));

    return () => {
      revoked = true;
      if (created) URL.revokeObjectURL(created);
    };
  }, [src]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function renderImg(extra: string, withObjectPosition = true) {
    return (
      <img
        src={blobUrl}
        alt={alt}
        className={extra}
        style={
          withObjectPosition && objectPosition ? { objectPosition } : undefined
        }
        draggable={false}
        onError={() => setLoadError(true)}
      />
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        disabled={loadError}
        className={`group text-left rounded-xl overflow-hidden border border-rim/50 bg-card hover:border-accent-hi/45 transition-colors disabled:pointer-events-none disabled:opacity-60 ${className ?? ""}`}
      >
        {frameClassName ? (
          <div
            className={`relative w-full overflow-hidden ${frameClassName}`}
          >
            {loadError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-surface px-3 text-center text-xs text-ink-muted">
                Image unavailable
              </div>
            ) : (
              renderImg("absolute inset-0 h-full w-full object-cover")
            )}
          </div>
        ) : loadError ? (
          <div className="flex min-h-32 items-center justify-center bg-surface px-3 text-center text-xs text-ink-muted">
            Image unavailable
          </div>
        ) : (
          renderImg("h-full w-full object-cover")
        )}
        <div className="border-t border-rim/35 px-4 py-3 text-sm text-ink-muted">
          {caption}
        </div>
      </button>

      {/* Lightbox: matches ImageGallery modal — dark overlay, figure caption bar, icon close */}
      {open && !loadError && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blobUrl}
              alt={alt}
              draggable={false}
              onContextMenu={noCtx}
              className="block max-h-[80vh] w-full select-none object-contain"
              style={
                {
                  WebkitUserDrag: "none",
                } as React.CSSProperties
              }
            />

            <p className="bg-black/40 px-4 py-3 text-center font-sans text-sm text-white/70">
              {caption}
            </p>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close image"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
