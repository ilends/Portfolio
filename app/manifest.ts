import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "David Angelo",
    short_name: "DA",
    description: "Engineering Science @ UofT — Biomedical Research & Emergency Medicine",
    start_url: "/",
    display: "standalone",
    theme_color: "#0b0f14",
    background_color: "#0b0f14",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
