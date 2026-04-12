import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

/* ── Opaque slug → actual filename map ──────────────────────────
   Only slugs listed here can be served. Any other slug returns 404.
   PDFs live in private/reports/ (tracked in git — see .gitignore).
   The actual filenames are not exposed in hrefs (only /api/pdf/[slug]).
──────────────────────────────────────────────────────────────── */

const PDF_MAP: Record<string, string> = {
  "glove-doffing":  "glove-doffing-report.pdf",
  "bridge":         "bridge-design-report.pdf",
  "civ102-handout": "civ102-bdp-handout-v2.pdf",
  "dolphin-kick":   "math-ia-dolphin-kick.pdf",
  "dct-jpeg":       "math-ee-dct-jpeg.pdf",
  /* Place your position statement at private/reports/position-statement.pdf */
  "position":       "position-statement.pdf",
  "position-old":   "position-old.pdf",
  /* Place your resume at private/reports/resume.pdf */
  "resume":         "resume.pdf",
  "praxis-ii-poster":    "praxis-ii-team05-poster.pdf",
  "praxis-ii-one-pager": "praxis-ii-team05-one-pager.pdf",
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

  const filePath = path.join(process.cwd(), "private", "reports", filename);

  try {
    const buffer = await readFile(filePath);
    return new NextResponse(new Uint8Array(buffer), {
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
