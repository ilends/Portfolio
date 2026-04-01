import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

/* ── Opaque slug → actual filename map ──────────────────────────
   Only slugs listed here can be served. Any other slug returns 404.
   The actual filenames are never exposed to the client.
──────────────────────────────────────────────────────────────── */

const PDF_MAP: Record<string, string> = {
  "glove-doffing":  "glove-doffing-report.pdf",
  "bridge":         "bridge-design-report.pdf",
  "dolphin-kick":   "math-ia-dolphin-kick.pdf",
  "dct-jpeg":       "math-ee-dct-jpeg.pdf",
  /* Place your resume at private/reports/resume.pdf */
  "resume":         "resume.pdf",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const filename = PDF_MAP[slug];

  if (!filename) {
    return new NextResponse("Not found", { status: 404 });
  }

  /* private/ is outside public/ so Next.js never serves it as a static asset */
  const filePath = path.join(process.cwd(), "private", "reports", filename);

  try {
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        /* inline → open in browser viewer, not force-download */
        "Content-Disposition": "inline",
        /* Prevent caching of sensitive content on shared machines */
        "Cache-Control": "private, no-store",
        /* Stop the browser hinting the real filename in save dialogs */
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
