/* ── Project case-study data ──────────────────────────────────────
   Each CaseStudy maps 1-to-1 with a route at /projects/[slug].

   Text formatting supported in body fields:
     **bold**          → <strong>
     *italic*          → <em>
     $...$             → KaTeX inline math
     $$...$$           → KaTeX display math (own paragraph, sep. by \n\n)
     Lines starting •  → styled bullet list

   PDFs in /public/reports/ open in the browser's native viewer.
──────────────────────────────────────────────────────────────── */

export type ProjectLink = {
  label: string;
  href: string;
  type: "github" | "pdf" | "external";
};

export type Constraint = {
  label: string;
  value: string;
  unit: string;
  rationale?: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  tags: string[];
  teamSize: number;
  status: "Completed" | "In Progress" | "Planned";
  summary: string;
  links?: ProjectLink[];
  /** "design" → Problem/Constraints/Design/Iterations/Testing/Results/Lessons
      "research" → Research Question/Key Parameters/Methodology/Process/Analysis/Findings/Lessons */
  kind: "design" | "research";
  problem: string;
  constraints: Constraint[];
  design: string;
  iterations: string;
  testing?: string;
  results: {
    headline: string;
    body: string;
  };
  lessons: string;
  images?: ProjectImage[];
};

/* ────────────────────────────────────────────────────────────────
   Project entries
──────────────────────────────────────────────────────────────── */

export const CASE_STUDIES: CaseStudy[] = [

  /* ── Glove Doffing Device ─────────────────────────────────── */
  {
    slug: "glove-doffing-device",
    title: "Glove Doffing Device",
    subtitle: "ESC101 · Praxis I · University of Toronto",
    date: "Sep – Dec 2025",
    tags: ["Fusion 360", "LaTeX", "Prototyping", "Drafting"],
    teamSize: 5,
    status: "Completed",
    kind: "design",
    summary:
      "Reduced glove-removal contamination from 37 % to 5 % using a 0.5 g tape-tab device requiring no mounting hardware.",
    links: [
      { label: "Design Report", href: "/api/pdf/glove-doffing", type: "pdf" },
      { label: "Supplemental Video", href: "https://youtu.be/_ekc9W8wXEI", type: "external" },
    ],

    problem:
      "Healthcare workers contaminate their skin at a documented 37 % rate when using the standard pinch-pull-slide technique. The method degrades under fatigue, moisture, and time pressure — conditions that are normal for first-aid responders. Two team members volunteer with UTEFR (UofT First Responders), grounding the design challenge in real operational context from day one.",

    constraints: [
      { label: "Max Operational Force", value: "< 22.2", unit: "N", rationale: "2010 ADA Accessible Design Standard." },
      { label: "Device Weight", value: "< 500", unit: "g", rationale: "CCOHS ergonomic limit for belt-carried tools." },
      { label: "Doffing Time", value: "< 10.9", unit: "s", rationale: "95th-percentile baseline from team wet/dry experiment." },
      { label: "Contact Rate", value: "< 37", unit: "%", rationale: "Must improve on the documented healthcare baseline." },
      { label: "Durability (FOS)", value: "≥ 3×", unit: "operational load", rationale: "Must survive 3× operational force without failure." },
      { label: "Team", value: "5", unit: "members · Group 40" },
    ],

    design:
      "Before generating ideas, we analysed existing reference designs from the design brief. Fixed wall hooks work like a second finger but leave the contaminated side exposed and aren't portable. The only portable hook design required one uncontaminated hand — placing it adjacent to the contaminated glove surface, which defeats the purpose. Vacuum machines introduced pressure injury risk and required cleaning after every use. The key pattern: *no reference design inverted the glove to contain contaminants*. That became the core requirement shaping everything that followed.\n\nTo diverge without anchoring on any of these, we used a Lotus Blossom and Morph Chart to break the problem into sub-functions — doffing mechanism, mounting, disposal — before naming any concept. Five ideas emerged: Hook, Glove Slicer, Tape, Air Blower, and Water Pump. The Air Blower and Water Pump were eliminated early: a bike pump couldn't overcome glove friction, and the water pump created uncontrolled splatter.",

    iterations:
      "The **Hook** (51.47 N operational force) exceeded the ADA 22.2 N limit by more than double. Scaled-down iterations improved portability but failed the 3× load durability requirement; eliminated by Pugh chart.\n\nThe **Glove Slicer** met every criterion and matched the Tape on safety scores. We steelmanned it: blade recessed for fingertip safety, outperformed hand-doffing on all six metrics. But it required a rigid mount — restricting it to stakeholders who always wear a belt.\n\nThe **Tape design** went through three focused iterations:\n• Clear scotch tape — functional, but tab was slow to locate under time pressure\n• 3M 401+ masking tape — 1.31 s faster on average than scotch tape across trials\n• Thumb-positioned tab — 8 of 10 users reported least discomfort and fastest doffing time",

    testing:
      "Each design was evaluated against six proxy tests: dye-contact rates over 20 trials, splatter distance with coloured liquid, operational force on a kitchen scale, dual-hand doffing time averaged over 5 trials, device mass, and a 3× structural load test. Results were compiled into a Measurement Matrix and two-stage Pugh chart. A 10-student survey evaluated holistic user preference between the two finalist designs.",

    results: {
      headline: "8.82 s avg. doffing time · 70 % user preference · effectively zero manufacturing cost",
      body: "Achieved 8.82 s average doffing time against a 10.9 s requirement. In a 10-participant survey, 70 % preferred the Tape over the Slicer. Mass came in at 0.5 g — 1000× below the 500 g limit — and the device costs nothing to produce beyond the tape itself.",
    },

    lessons:
      "The most impactful single variable was tab position — placing it at the thumb cuff gave the best combination of doffing time and user comfort. Simpler solutions are harder to beat: the tape design wins because it introduces no hardware, no mount, and no new failure mode.",

    images: [
      {
        src: "/images/glove-doffing/whiteboard-sketches.png",
        alt: "Early whiteboard ideation session, Praxis Group 40, Oct 22 2025",
        caption:
          "Early ideation — Praxis Group 40, Oct 22 2025. Sketches include compliant hooks, air-powered doffers, glove cutters, a water pump, and belt-mounted variants. All five final concepts are visible here in rough form.",
      },
      {
        src: "/images/glove-doffing/lotus-blossom.png",
        alt: "Lotus Blossom diverging activity for the glove doffing opportunity",
        caption:
          "Lotus Blossom diverging activity — sub-problems include Safety, Human Factors, Sustainability, Accessibility, and Durability. Deliberately breaking the problem into isolated sub-functions before combining them reduced anchoring bias toward existing hook designs.",
      },
      {
        src: "/images/glove-doffing/hook-iterations.png",
        alt: "Four 3D-printed iterations of the hook design",
        caption:
          "Four 3D-printed hook iterations scaled down from the reference design for portability. Despite progressive geometry changes to distribute load and lower force, all iterations either failed the 3× load durability test or exceeded the 22.2 N ADA force limit.",
      },
      {
        src: "/images/glove-doffing/slicer-fusion-side.png",
        alt: "Fusion 360 CAD model of the glove slicer — side view",
        caption:
          "Fusion 360 model of the Glove Slicer (side view). Dual-blade cutting mechanism with a shielded access slot — blade depth and slit width were iterated to make accidental finger contact geometrically impossible.",
      },
      {
        src: "/images/glove-doffing/slicer-fusion-front.png",
        alt: "Fusion 360 CAD model of the glove slicer — belt-mount view",
        caption:
          "Glove Slicer — belt-mount view. The two legs straddle a belt loop; the cutting slit faces upward. The final iteration added a second blade and a side-mounted replaceable blade door. Met every evaluation criterion but required a belt to function.",
      },
      {
        src: "/images/glove-doffing/tape-final.png",
        alt: "Final tape design — green 3M 401+ masking tape on the inner wrist cuff",
        caption:
          "Final design: 18 cm of 3M 401+ masking tape positioned at the thumb cuff. Head-to-head timing trials showed a 1.31 s improvement over clear scotch tape; thumb-cuff placement was confirmed as optimal by an 8-of-10 user preference count.",
      },
      {
        src: "/images/glove-doffing/alpha-release.png",
        alt: "Group 40 at the Alpha Release mid-semester design showcase",
        caption:
          "Group 40 at the Alpha Release presentation. The poster shows the diverging process, five prototype concepts, and early proxy test data. The blue 3D-printed hook prototypes are visible on the table.",
      },
    ],
  },

  /* ── CIV102 Matboard Bridge ───────────────────────────────── */
  {
    slug: "civ102-matboard-bridge",
    title: "CIV102 Matboard Bridge Design",
    subtitle: "CIV102 · Structures & Materials · University of Toronto",
    date: "Nov – Dec 2025",
    tags: ["Python", "Structural Engineering", "Statics", "Matboard"],
    teamSize: 4,
    status: "Completed",
    kind: "design",
    summary:
      "Engineered a simply-supported matboard box-girder bridge designed to withstand a 452 N dynamic point load. Developed a Python structural analysis pipeline to evaluate 8 distinct failure modes across 5 major iterations, achieving a theoretical capacity of 1125 N and sustaining a 1250 N cumulative load in physical testing.",
    links: [
      { label: "Design Report", href: "/api/pdf/bridge", type: "pdf" },
    ],

    problem:
      "The objective was to computationally design and physically fabricate a high-capacity beam bridge operating under strict geometric and material constraints. The project demanded a rigorous balance between bending stiffness, shear resistance, and physical mass optimization using only $1.27$ mm thick matboard and contact cement.",

    constraints: [
      { label: "Matboard Thickness", value: "1.27", unit: "mm", rationale: "Standardised sheet stock — governs all section properties." },
      { label: "Load Case 1", value: "400", unit: "N", rationale: "Primary sustained load target." },
      { label: "Load Case 2", value: "452", unit: "N", rationale: "Secondary load case for final FOS analysis." },
      { label: "Final Web Height", value: "120", unit: "mm", rationale: "Converged after 5 iterations — maximises I and shear buckling resistance." },
      { label: "Max Diaphragm Spacing", value: "100", unit: "mm", rationale: "Raises critical shear buckling stress." },
      { label: "Min Factor of Safety", value: "2.49", unit: "(compression)", rationale: "Lowest of 8 FOS values under Load Case 2 — compression governs." },
    ],

    design:
      "Before touching any matboard, we parameterised the cross-section in Python: top flange width and thickness, web height, glue tab widths, diaphragm spacing, and automated all eight factor-of-safety calculations. This converted iteration from a hand-calculation marathon into a trade-off table comparison. **Design 0** (the course reference) failed immediately under Load Case 1 due to Case 1 plate buckling in the restrained top flange.",

    iterations:
      "**Iteration 1**: Doubled top flange (1.27 → 2.54 mm), removed bottom flange, extended glue tab to 80 mm across the full web span. All eight FOS ≥ 1.0. Weaknesses remaining: compression, tension, shear buckling.\n\n**Iteration 2**: Raised web height (78.73 → 100 mm); cut diaphragm spacing (400 → 100 mm). All three weaknesses improved simultaneously.\n\n**Iteration 3**: Wider flange (100 → 120 mm). Compression improved but Case 2 buckling dropped by a factor of four. Material in the horizontal plane is far less efficient than in the vertical plane. Reverted.\n\n**Iteration 4**: Flange back to 100 mm; web to 120 mm. Most metrics improved; web height locked at 120 mm.\n\n**Final design**: Zoned glue tabs; 77.46 mm centrally (bending-dominant) and 30 mm combined in the outer thirds (shear-dominant), matching the moment envelope and allowing all pieces to fit onto the physical matboard sheet.",

    testing:
      "All structural analysis was conducted in Python before any fabrication. The script plotted shear force and bending moment envelopes and outputted all eight factors of safety for any given cross-section. Each iteration was tested against both Load Case 1 (400 N) and Load Case 2 (452 N). Physical construction followed only after computational sign-off on every failure mode.",

    results: {
      headline: "Compression governed at FOS 2.49 · Physical Testing Validates 450 N Sustained Load",
      body: "The computational model predicted a theoretical failure load of $1125$ N based on a $2.49$ factor of safety. Physical load testing confirmed the structural integrity by sustaining a $1250$ N cumulative load and a $450$ N simultaneous point load. Ultimate structural failure occurred exclusively at the physical matboard splice joint, proving the primary cross-section design successfully resisted all calculated buckling and shear modes.",
    },

    lessons:
      "Physical testing revealed the absolute necessity of accounting for fabrication mechanics alongside computational models. While the continuous cross-section was mathematically rated for $1125$ N, the bridge ultimately failed under a $450$ N point load at the physical splice joint. This demonstrated that theoretical safety factors are obsolete if material joints and construction adhesives introduce unmodeled localized stress concentrations. Future structural engineering must treat physical assembly seams as primary failure points during the computational modeling phase.",

    images: [
      {
        src: "/images/bridge/onshape-model.png",
        alt: "Multi-view Onshape CAD model of the matboard box-girder bridge",
        caption:
          "Multi-view Onshape model of the final box-girder design. Internal diaphragm spacing and cross-sectional geometry were dimensioned here before cutting.",
      },
      {
        src: "/images/bridge/cutting-diagram.png",
        alt: "Matboard cutting layout diagram with dimensions in millimetres",
        caption:
          "Cutting layout for the full 1500 x 810 mm matboard sheet with all components labelled by dimension. The layout was optimized to minimize offcuts and maintain grain direction on the webs.",
      },
      {
        src: "/images/bridge/cutting-stages.png",
        alt: "Two team members scoring and cutting matboard components using a ruler and knife",
        caption:
          "Scoring and cutting matboard components to dimension using the cutting diagram. Precision at this stage directly controlled glue joint quality and web straightness.",
      },
      {
        src: "/images/bridge/bending-moment.png",
        alt: "Bending moment envelope for Load Case 2 showing failure thresholds by mode",
        caption:
          "Bending moment envelope under Load Case 2 (452 N). Compression failure governs, with the applied moment staying within all failure thresholds across the span.",
      },
      {
        src: "/images/bridge/shear-force.png",
        alt: "Shear force envelope showing absolute shear against four failure mode thresholds",
        caption:
          "Shear force envelope under Load Case 2. The applied shear (dashed blue) remains well below matboard shear, glue shear, and buckling failure limits at all cross-sections.",
      },
      {
        src: "/images/bridge/python-code.png",
        alt: "Python code defining the bridge cross-section variables",
        caption:
          "Cross-section parameterisation in Python. Changing one dimension variable automatically propagated through all 8 failure mode calculations.",
      },
      {
        src: "/images/bridge/fabrication.png",
        alt: "CIV102 bridge during fabrication showing box-girder cross-section",
        caption:
          "Box-girder cross-section during assembly. Diaphragm spacing and glue tab placement were staged to maintain squareness before the top flange was bonded.",
      },
      {
        src: "/images/bridge/team.png",
        alt: "Team 701 holding the finished bridge",
        caption:
          "Team 701 with the finished bridge. The design cleared an experimental 450N load totalling to 1250 N cumulative load.",
      },
    ],
  },

  /* ── Math IA — Dolphin Kick ───────────────────────────────── */
  {
    slug: "dolphin-kick",
    title: "Dolphin Kick Biomechanics",
    subtitle: "Mathematical Modelling · Biomechanics",
    date: "Sep 2024 – Jan 2025",
    tags: ["Mathematical Modelling", "Desmos", "Adobe After Effects", "Calculus", "Piecewise Modelling"],
    teamSize: 1,
    status: "Completed",
    kind: "research",
    summary:
      "Executed a biomechanical motion-tracking analysis to extract 72 discrete kinematic data points from underwater footage. Constructed a 39-equation piecewise model to map ankle trajectory and optimized the thrust-to-drag ratio via calculus to derive a theoretical maximum velocity of 2.64 m/s.",
    links: [
      { label: "View Paper", href: "/api/pdf/dolphin-kick", type: "pdf" },
    ],

    problem:
      "The underwater dolphin kick is heavily restricted in elite competition due to its unparalleled propulsive efficiency. The objective of this research was to extract empirical kinematic data from human athletic performance and construct a mathematical model precise enough to isolate the biomechanical variables governing optimal swimming velocity.",

    constraints: [
      { label: "Tracking Duration", value: "2.40", unit: "s · 72 frames", rationale: "GoPro at 29.97 fps; tracking ran until foot left frame." },
      { label: "Avg. Amplitude", value: "1.50", unit: "units ≈ 47.4 cm", rationale: "Mean crest-to-trough across 4 peaks. Calibrated via foot length." },
      { label: "Avg. Frequency", value: "1.7", unit: "kicks/s", rationale: "Fitted by Desmos slider; gives ~4 kicks over 2.40 s." },
      { label: "Measured Velocity", value: "1.85", unit: "m/s", rationale: "Derived from x-displacement over ~30 frames (≈ 1 s)." },
      { label: "Optimal Velocity", value: "2.64", unit: "m/s", rationale: "From setting $df/dv = 0$ on the thrust–drag objective." },
      { label: "Piecewise Segments", value: "39", unit: "functions", rationale: "Required to accurately model the full kick shape." },
    ],

    design:
      "Extracted 72 ankle coordinate pairs across a 2.40-second sample at 29.97 fps using Adobe After Effects motion tracking. Initial hypothesis testing proved a singular sinusoidal function insufficient due to multi-directional concavity reversals and near-vertical data intervals. Constructed a highly precise 39-equation piecewise continuous function using seven distinct algebraic families to map the physical geometry. This geometry was then generalized to extract mean amplitude and frequency parameters for calculus-based optimization.",

    iterations:
      "Formulated an objective function $f(v)$ to balance forward thrust against quadratic fluid drag. Thrust was derived using mass flow rate principles yielding a linear term of $163v$. Drag was modeled using literature-standard streamlined coefficients ($C_D = 0.7$) and measured cross-sectional area. Setting the derivative $f'(v) = 163 - 61.8v$ equal to zero isolated the theoretical maximum velocity threshold.",

    results: {
      headline: "Theoretical maximum velocity validated at 2.64 m/s",
      body: "Optimization of the derived thrust-drag differential equation yielded a critical point at 2.64 m/s. This mathematically proves that the current kick frequency ($b = 1.7$) is near optimal, isolating physical amplitude as the primary biomechanical bottleneck for performance gains.",
    },

    lessons:
      "Modeling human biomechanics exposed the severe limitations of idealized mathematical assumptions. The primary limiting factor of the optimization was assuming a direct proportionality between the amplitude-frequency product and actual velocity without an experimentally determined constant $k$. Future kinematic modeling must incorporate Computational Fluid Dynamics (CFD) to measure true volumetric drag and utilize 3D motion tracking to account for lateral force vectors.",

    images: [
      {
        src: "/images/math-ia/after-effects-tracking.png",
        alt: "Adobe After Effects motion tracking interface isolating ankle coordinate pairs from underwater footage",
        caption:
          "Adobe After Effects motion tracking interface isolating 72 discrete coordinate pairs from 2.40 seconds of 29.97 fps underwater footage.",
      },
      {
        src: "/images/math-ia/piecewise-model.png",
        alt: "39-piece continuous algebraic model of the dolphin kick plotted in Desmos",
        caption:
          "The 39-piece continuous algebraic model. Multi-directional concavity reversals proved that a standard sinusoidal approximation was mathematically insufficient.",
      },
      {
        src: "/images/math-ia/sinusoidal-fit.png",
        alt: "Generalised sinusoidal approximation overlaid on raw data scatter plot",
        caption:
          "Generalized sinusoidal approximation f(x) = 1.5sin(1.7x) + 0.147x + 2 superimposed on the raw data scatter plot to extract mean frequency and amplitude variables.",
      },
    ],
  },

  /* ── Math EE — DCT & JPEG ─────────────────────────────────── */
  {
    slug: "dct-jpeg",
    title: "DCT in JPEG Compression",
    subtitle: "Signal Processing · Independent Research",
    date: "May 2024 – Feb 2025",
    tags: ["Python", "Linear Algebra", "Signal Processing", "Image Compression"],
    teamSize: 1,
    status: "Completed",
    kind: "research",
    summary:
      "Executed the core JPEG compression sequence on my own raw photographic data. Computed the Discrete Cosine Transform analytically, applied standard quantization matrices, and validated reconstruction accuracy against Fast Fourier Transform benchmarks.",
    links: [
      { label: "View Paper", href: "/api/pdf/dct-jpeg", type: "pdf" },
    ],

    problem:
      "JPEG remains the global standard for image compression by relying heavily on frequency-domain transformations. The objective of this analysis was to mathematically validate the efficiency of the Discrete Cosine Transform (DCT) by isolating its core mathematical pipeline. This involved extracting pixel intensities via Python and computing the transform algorithm manually to evaluate the mechanics strictly prior to encoding.",

    constraints: [
      { label: "Pixel Depth", value: "8-bit", unit: "[0, 255]", rationale: "Level-shifted to [−127, 127] before DCT." },
      { label: "Block Size", value: "8 × 8", unit: "pixels", rationale: "JPEG standard — a 512×512 image contains 4096 such blocks." },
      { label: "JPEG Quality", value: "50", unit: "(standard)", rationale: "Balances compression ratio against perceptual fidelity." },
      { label: "DC Coefficient", value: "−777.0", unit: "(first block)", rationale: "Largest coefficient by far — confirms low-freq content dominates." },
      { label: "DCT Reconstruction", value: "[7,15,23…63]", unit: "vs original [8,16…64]", rationale: "Near-identical. FFT gave [24,12,20…48] — visible artifacts." },
      { label: "Compression Algorithm", value: "Box Filter", unit: "", rationale: "Downsampling of pixel values to reduce complexity." },
    ],

    design:
      "I converted a personal beach photo to greyscale in Python, extracted the first $8 \\times 8$ pixel block, and computed $\\text{DCT} = T \\times M \\times T'$, where $T$ is the cosine transform matrix. The pipeline included level-shifting pixel values from $[0, 255]$ to $[-127, 127]$, element-wise division by the quality-50 quantisation matrix $Q$, and reconstruction via IDCT. The derivation of the DCT from the DFT was worked through analytically in the essay body.",

    iterations:
      "The derivation began with the Discrete Fourier Transform and took only its real part, eliminating imaginary frequency nodes to arrive at a variant of the DCT. The 2D DCT-II used in JPEG follows step-by-step:\n\n$$F(i,j) = \\frac{2}{N}C(i)C(j)\\sum_{x=0}^{N-1}\\sum_{y=0}^{N-1}f(x,y)\\cos\\!\\frac{(2x+1)i\\pi}{2N}\\cos\\!\\frac{(2y+1)j\\pi}{2N}$$\n\nThis established *why* the DCT is used in JPEG rather than treating it as an arbitrary historical choice. A secondary comparison against FFT reconstruction on the same input was included to test the claim that DCT is better-suited for natural images.",

    testing:
      "The manual calculation of the first $8\\times 8$ block yielded a DC coefficient of $-777.0$. This magnitude vastly outweighed the high-frequency AC coefficients, mathematically validating the JPEG quantization strategy of aggressively zeroing out high-frequency data. IDCT reconstruction produced a near-lossless output matrix, with minor clipping artifacts $(2, 3 \\to 0)$ stemming from the explicit exclusion of Huffman encoding in this model.",

    results: {
      headline: "Low-Frequency Dominance Validated at $-777.0$ DC",
      body: "Manual computation of the primary $8\\times 8$ pixel matrix yielded a DC coefficient of $-777.0$. This metric directly proves that the vast majority of photographic energy is concentrated in low-frequency block averages. Subsequent Inverse DCT reconstruction produced a near-lossless output, mathematically validating the aggressive truncation of high-frequency AC coefficients during the quantization phase.",
    },

    lessons:
      "Bypassing the entropy coding phase exposed a critical vulnerability in the models. Without Huffman encoding, the Inverse DCT reconstruction produced minor boundary clipping artifacts, outputting negative pixel intensities that required manual zeroing. This limitation provided a direct lesson for future biomedical signal processing research: theoretical algorithm isolation is insufficient. Future compression or kinematic models must be validated through complete, end-to-end pipelines to guarantee absolute data integrity at the physical output layer.",

    images: [
      {
        src: "/images/math-ee/pixel-matrix-diagram.png",
        alt: "Box filter diagram showing a 2r×2r sliding window over adjacent pixel values",
        caption:
          "The box filter. Used to introduce local spatial averaging (filtering) before the shift to frequency-domain compression via the DCT.",
      },
      {
        src: "/images/math-ee/beach-photo-grayscale.png",
        alt: "Personal beach photo converted to greyscale in Python",
        caption:
          "The beach photo converted to greyscale. The first 8×8 pixel block (top-left) was extracted for the manual DCT calculation.",
      },
      {
        src: "/images/math-ee/python-dct-code.png",
        alt: "Python code implementing DCT matrix multiplication T × M × T'",
        caption:
          "Python implementation of the DCT pipeline computing the transform matrix T. The level-shifted pixel block M is computed as T × M × T'.",
      },
      {
        src: "/images/math-ee/dct-coefficients.png",
        alt: "8×8 DCT coefficient matrix visualised — energy concentrated in top-left",
        caption:
          "Visualised DCT coefficient matrix for the first 8×8 block. The top-left DC coefficient (−777.0) dominates, most image energy is in low frequencies.",
      },
      {
        src: "/images/math-ee/dct-vs-fft.png",
        alt: "DCT vs FFT reconstruction accuracy — black dots vs red dots on green line",
        caption:
          "DCT (black) vs FFT (red) reconstruction against the original signal (green). DCT values stay close to the line; FFT values deviate visibly.",
      },
    ],
  },
];

/** Look up a single case study by slug. Returns undefined if not found. */
export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((p) => p.slug === slug);
}
