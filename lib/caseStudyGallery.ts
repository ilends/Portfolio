import type { CaseStudy, ProjectImage } from "@/lib/data/projects";

/** Single lightbox order: all CTMF `figures` in order, then `project.images`. */
export function getUnifiedCaseStudyImages(project: CaseStudy): ProjectImage[] {
  const out: ProjectImage[] = [];
  for (const c of project.ctmfs ?? []) {
    if (c.figures?.length) out.push(...c.figures);
  }
  if (project.images?.length) out.push(...project.images);
  return out;
}

/** Parallel to `project.ctmfs`: global index range of each block's inline figures. */
export function getCtmfFigureIndexRanges(project: CaseStudy): { start: number; count: number }[] {
  const ranges: { start: number; count: number }[] = [];
  let offset = 0;
  for (const c of project.ctmfs ?? []) {
    const count = c.figures?.length ?? 0;
    ranges.push({ start: offset, count });
    offset += count;
  }
  return ranges;
}

/** First global index of `project.images` inside the unified array. */
export function getGalleryTailIndexStart(project: CaseStudy): number {
  let n = 0;
  for (const c of project.ctmfs ?? []) {
    n += c.figures?.length ?? 0;
  }
  return n;
}
