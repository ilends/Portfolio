/* ── Project case-study data ──────────────────────────────────────
   Each CaseStudy maps 1-to-1 with a route at /projects/[slug].

   Text formatting supported in body fields:
     **bold**          → <strong>
     *italic*          → <em>
     $...$             → KaTeX inline math
     $$...$$           → KaTeX display math (own paragraph, sep. by \n\n)
     Lines starting •  → styled bullet list

   CTMF `body` fields only (case study page):
     ==phrase==        → subtle slate→sky→cyan gradient text colour; use sparingly for key terms.

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

/** Frame · Diverge · Converge · Represent (Praxis design process strands) */
export type FdcrStrand = "Frame" | "Diverge" | "Converge" | "Represent";

export type CtmfBlock = {
  title: string;
  fdcr: FdcrStrand;
  /** Prose when not using split application/assessment. */
  body?: string;
  /** Process / what you did (pair with `assessment`). */
  application?: string;
  /** Reflection / critique / forward look (pair with `application`). */
  assessment?: string;
  /** Evidence images shown centered below the CTMF prose (optional). */
  figures?: readonly ProjectImage[];
};

/** IEEE-style bibliography entry for design case studies (number is assigned on render). */
export type ProjectReference = {
  /** Full IEEE citation text without a leading [n] prefix. */
  ieee: string;
  /** Optional PDF (e.g. `/api/pdf/…`); shown after the citation. */
  href?: string;
};

/**
 * Single chronological IEEE list for the whole portfolio (Praxis I, CIV102, Praxis II deliverables).
 * In-text bracket numbers match these global indices: [1] Praxis I report, [2] CIV handout, [3] CIV team report,
 * [4] Praxis II showcase poster, [5] Praxis II one-pager.
 */
export const CHRONOLOGICAL_PORTFOLIO_DESIGN_REFERENCES: readonly ProjectReference[] = [
  {
    ieee: `D. Angelo, J. Assad, J. Zhu, A. Park, and K. Park, "ESC101 Glove Doffing Device Design Report," design proj. rep., Praxis Group 40, Univ. Toronto, Toronto, ON, Canada, Nov. 30, 2025.`,
    href: "/api/pdf/glove-doffing",
  },
  {
    ieee: `Univ. Toronto, Fac. Appl. Sci. Eng., "CIV102 Matboard Bridge Design Project," Toronto, ON, Canada, CIV102 BDP handout, Fall 2025, Rev. 2, Oct. 30, 2025.`,
    href: "/api/pdf/civ102-handout",
  },
  {
    ieee: `D. Angelo, K. Chawla, C. Peng, and A. Xiao, "CIV102 Bridge Project Design Report," design proj. rep., Team 701, Univ. Toronto, Toronto, ON, Canada, Nov. 23, 2025.`,
    href: "/api/pdf/bridge",
  },
  {
    ieee: `X. Su, D. Shoeib, N. Puthoor, and E. Li, "RipTune: Variable Swim Resistance," showcase poster, ESC102 Praxis II Team 05, Univ. Toronto, Toronto, ON, Canada, Apr. 2026.`,
    href: "/api/pdf/praxis-ii-poster",
  },
  {
    ieee: `X. Su, D. Shoeib, N. Puthoor, and E. Li, "Variable Swim Resistance via RipTune," course one-pager, ESC102 Praxis II Team 05, Univ. Toronto, Toronto, ON, Canada, Apr. 2026.`,
    href: "/api/pdf/praxis-ii-one-pager",
  },
];

export function getPortfolioReferencesForCaseStudy(
  project: CaseStudy
): readonly { index: number; ref: ProjectReference }[] {
  const idxs = project.portfolioReferenceIndices;
  if (!idxs?.length) return [];
  return idxs.map((n) => {
    const ref = CHRONOLOGICAL_PORTFOLIO_DESIGN_REFERENCES[n - 1];
    if (!ref) throw new Error(`Invalid portfolio reference index: ${n}`);
    return { index: n, ref };
  });
}

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  tags: string[];
  teamSize: number;
  /** Full names for the academic attribution footer when `teamSize > 1`. Set per project below in `CASE_STUDIES`. */
  teammates?: readonly string[];
  status: "Completed" | "In Progress" | "Planned";
  summary: string;
  links?: ProjectLink[];
  /** "design" → Problem / Constraints / (Design or CTMFs) / Iterations / …
      "research" → Research Question / Key Parameters / Methodology / … */
  kind: "design" | "research";
  problem: string;
  constraints: Constraint[];
  /** Omit when `ctmfs` carries the methodology (typical for Praxis design projects). */
  design?: string;
  /** Omit when iteration narrative lives in CTMFs (e.g. CIV102) or you only need other sections. */
  iterations?: string;
  testing?: string;
  results: {
    headline: string;
    body: string;
  };
  /** How this project refined your position as an engineering designer (optional; design portfolio). */
  positionImpact?: string;
  /** Explicit CTMFs with FDCR strand; optional until populated per project. */
  ctmfs?: CtmfBlock[];
  lessons: string;
  images?: ProjectImage[];
  /** Global [1], [2], … indices into CHRONOLOGICAL_PORTFOLIO_DESIGN_REFERENCES for this case study’s References block. */
  portfolioReferenceIndices?: readonly number[];
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
    tags: ["Verification", "Human Factors", "Iterative Prototyping", "Ergonomic Design"],
    teamSize: 5,
    teammates: ["João Assad", "Jeffrey Zhu", "Alvin Park", "Keetahn Park"],
    status: "Completed",
    kind: "design",
    summary:
      "Designed a zero-hardware doffing mechanism that reduced glove-removal contamination from 37% to 5% and achieved an 8.82 s removal time, optimizing for high-stress, dynamic emergency environments with no mounting hardware. Quantitative outcomes and process detail are documented in our team design report [1].",
    links: [
      { label: "Design Report", href: "/api/pdf/glove-doffing", type: "pdf" },
      { label: "Supplemental Video", href: "https://youtu.be/_ekc9W8wXEI", type: "external" },
    ],

    problem:
      "Healthcare workers and first responders contaminate their skin at a documented 37% rate when using the standard pinch-pull-slide glove removal technique. This multi-step method degrades under fatigue, moisture, and time pressure. As a Standard First Aid instructor and lifeguard alongside another group member, we have seen how these conditions compromise safety in emergency medical responses. Grounded in this context, this project aimed to engineer a doffing method that inherently contains pathogens without demanding complex motor skills.",

    constraints: [
      { label: "Max Operational Force", value: "< 22.2", unit: "N", rationale: "2010 ADA Accessible Design Standard." },
      { label: "Device Weight", value: "< 500", unit: "g", rationale: "CCOHS ergonomic limit for belt-carried tools." },
      { label: "Doffing Time", value: "< 10.9", unit: "s", rationale: "95th-percentile baseline from team wet/dry experiment." },
      { label: "Contact Rate", value: "< 37", unit: "%", rationale: "Must improve on the documented healthcare baseline." },
      { label: "Durability (FOS)", value: "≥ 3×", unit: "operational load", rationale: "Must survive 3× operational force without failure." },
    ],

    ctmfs: [
      {
        title: "Needs → Goals → Objectives (NGOs)",
        fdcr: "Frame",
        application:
          "Needs → Goals → Objectives (NGOs) are a framework that translates ==stakeholder needs== into specific and measurable goals and objectives to evaluate design success. We used the NGO framework to structure our design brief, defining a \"safer\" doffing method through establishing constraints (shown above), which were backed by secondary research. This provided our team with shared, measurable requirements to ground our evaluations.",
        assessment:
          "However, while the NGO captured ==physical thresholds==, it failed to quantify the high-stress first responders experience during emergencies. This taught me to ensure that for future projects, ==psychological constraints== are explicitly written into the objectives early on, allowing me to grasp ==bounded rationality== in practice. This solidified my value going into the project that communities are, in fact, important, and taught me that solutions gain true meaning when validated by the ==real-world constraints== of the communities using them.",
        figures: [
          {
            src: "/images/glove-doffing/ngos.png",
            alt: "Table of Goal 2 accessibility objectives with criteria, metrics, and thresholds for force, one-hand operation, materials, and portability",
            caption:
              "Snippet of NGOs: Goal 2 accessibility criteria and acceptance thresholds. Physical and ergonomic metrics only; notice the lack of cognitive objectives.",
          },
        ],
      },
      {
        title: "Morphological charts",
        fdcr: "Diverge",
        application:
          "Morphological (Morph) charts are tools used to generate solutions based on combining sub-functions of designs. We used Lotus Blossom and \"I wish\" statements to obtain our sub-functions, then recombined them with the Morph Chart. These tools were effective in the diverging phase because they forced us to design around ==elementary actions== rather than complete mechanisms. This broke our ==anchoring bias== toward the slicer concept and introduced the ==tape approach==.",
        assessment:
          "The exercise showed me that ==accessible designs== often emerge from optimizing a single physical interaction rather than building complex machines. However, the chart also produced highly theoretical combinations that ignored realities like moisture and friction, leading to early failures such as the ==air blower prototype==. I would use this method again to expand the design space, but pair it with earlier ==low-fidelity testing== to eliminate ideas that only work on paper.",
        figures: [
          {
            src: "/images/glove-doffing/morph-chart.png",
            alt: "Hand-drawn morphological chart for glove doffing: function rows and sketched options per column",
            caption: "Morph chart: sub-functions and concept combinations from the diverge phase.",
          },
        ],
      },
      {
        title: "Decision matrices",
        fdcr: "Converge",
        application:
          "To converge on our final recommendation, we used decision matrices, tools that evaluate concepts against weighted criteria or baselines to drive convergence. We used a ==measurement matrix== to quantify prototype performance across proxy tests, followed by a ==two-stage Pugh chart== comparing concepts against the Hook baseline. Again, this mitigated ==anchoring bias== through ==data-driven decision making==.",
        assessment:
          "The matrix initially hid a critical flaw. The ==Glove Slicer== scored well numerically but introduced major risks due to its ==exposed blade==. Recognizing this limitation, we ==overrode the matrix== and opted for a holistic evaluation to select the ==tape tab==, a solution better suited to the ==time-pressured realities of emergency response==. The matrix anchored our convergence in data, but ==informed judgment== was necessary to choose the final solution, which introduced a new lens through which I approach engineering design, shifting to ==pragmatism==. In future projects, I will use decision matrices to structure convergence though never take them as sufficient enough to justify a final recommendation.",
        figures: [
          {
            src: "/images/glove-doffing/measurementmatrix.png",
            alt: "Spreadsheet measurement matrix for Tape, Slicer, and Hook against contact, splatter, force, time, mass, and load failure criteria",
            caption:
              "Measurement matrix against key evaluation criteria. Colour indicates pass or fail relative to the requirement column before Pugh comparison.",
          },
          {
            src: "/images/glove-doffing/pughchart.png",
            alt: "Pugh chart comparing Tape, Slicer, and Hook with Tape as the baseline",
            caption:
              "Pugh chart compared with Tape as datum. Green better than baseline, red worse, yellow same.",
          },
        ],
      },
    ],

    iterations:
      "The **tape-tab design** went through three focused iterations (Hook and Slicer arcs are summarized under decision matrices in the CTMFs above):\n• Clear scotch tape: Functional, but the transparent tab was slow to locate under time pressure.\n• 3M 401+ masking tape: Improved visibility and moisture resistance yielded a 1.31 s faster doffing time.\n• Thumb positioned tab: Moving the tab parallel to the thumb optimized removal mechanics and ensured the peak operational force remained a highly accessible 15.21 N.",

    results: {
      headline:
        "==8.82 s avg. doffing time== · ==15.21 N actuation force== · ==effectively zero manufacturing cost==",
      body: "Validated against rigorous proxy tests for contact rates, contaminant splatter, and operational force. The final tape-tab design achieved a ==5%== contact rate against a ==37%== healthcare baseline and an ==8.82 s== average doffing time. It requires only ==15.21 N== of actuation force, comfortably meeting the ==22.2 N== ADA Accessible Design Standard. At ==0.5 g==, it operates ==1000×== below the ergonomic weight limit and costs effectively zero to scale. Protocols, iteration history, and extended discussion appear in [1].",
    },

    lessons:
      "Going in to the project, my position on engineering design was primarily shaped from the beliefs that the community I design for is important, and that designs must account for the unpredictable nature of human behaviour. The hardest part of this project was overcoming the urge to over-engineer. First responders operate under ==bounded rationality==, they don't have the cognitive bandwidth to fumble with complex gadgets in a crisis.\n\nBy stepping back from theoretical models, we realized that optimizing a fundamental physical interaction with a simple tape-tab was the true accessible solution. This refined my notion of ==bounded rationality==, and shifted my idea that communities are important into a more refined value of ==stakeholder centricity==. It also took my value of recognizing the ==incompleteness of models== and introduced the perspective that engineering design truly begins when ==informed judgments== take over engineering models.\n\nThis begun my shift to ==pragmatism==, though it was not fully set in stone yet.",

    /* Gallery: slicer CAD, tape final (morph, measurement matrix, Pugh, and NGO snippet sit under CTMFs). */
    images: [
      {
        src: "/images/glove-doffing/slicer-fusion-side.png",
        alt: "Fusion 360 CAD model of the glove slicer, side view (Jeffrey Zhu)",
        caption:
          "Fusion 360 model of the Glove Slicer (side view) (Jeffrey Zhu). Iterated on blade depth and slit width to make accidental finger contact geometrically impossible.",
      },
      // {
      //   src: "/images/glove-doffing/slicer-fusion-front.png",
      //   alt: "Fusion 360 CAD model of the glove slicer — belt-mount view",
      //   caption:
      //     "Glove Slicer (belt-mount view). The two legs straddle a belt loop and the cutting slit faces upward.",
      // },
      {
        src: "/images/glove-doffing/tape-final.png",
        alt: "Final tape design — green 3M 401+ masking tape on the inner wrist cuff",
        caption:
          "Final design: 3M 401+ masking tape positioned at the thumb cuff.",
      },
    ],

    portfolioReferenceIndices: [1],
  },

  /* ── CIV102 Matboard Bridge ───────────────────────────────── */
  {
    slug: "civ102-matboard-bridge",
    title: "CIV102 Matboard Bridge Design",
    subtitle: "CIV102 · Structures & Materials · University of Toronto",
    date: "Nov – Dec 2025",
    tags: ["Python", "Structural Engineering", "Statics", "Safety Analysis"],
    teamSize: 4,
    teammates: ["Karan Chawla", "Chris Peng", "Angela Xiao"],
    status: "Completed",
    kind: "design",
    summary:
      "Engineered a simply-supported matboard box-girder bridge designed to withstand a 452 N dynamic point load. Developed a Python structural analysis pipeline to evaluate 8 distinct failure modes across 5 major iterations, achieving a theoretical capacity of 1125 N and sustaining a 1250 N cumulative load in physical testing.",
    links: [
      { label: "Design Report", href: "/api/pdf/bridge", type: "pdf" },
    ],

    problem:
      "The objective was to computationally design and physically fabricate a high-capacity beam bridge operating under strict geometric and material constraints. The project demanded a rigorous balance between bending stiffness, shear resistance, and physical mass optimization using only $1.27$ mm thick matboard and contact cement, as specified in the course design brief [2].",

    constraints: [
      { label: "Matboard Sheet", value: "813 × 1016", unit: "mm", rationale: "One rectangular sheet per team (32 in × 40 in); approximate mass 750 g per the course handout [2]." },
      { label: "Matboard Thickness", value: "1.27", unit: "mm", rationale: "Nominal 0.05 in stock; governs all section properties." },
      { label: "Load Case 1", value: "400", unit: "N", rationale: "Unweighted train; total weight split evenly across six axles [2]." },
      { label: "Load Case 2", value: "452", unit: "N", rationale: "Example base-case loaded train from the handout (e.g. 182 N locomotive + 2 × 135 N freight cars) [2]." },
      { label: "Final Web Height", value: "120", unit: "mm", rationale: "Converged after five iterations; maximises I and shear buckling within deck-height rules." },
      { label: "Max Diaphragm Spacing", value: "100", unit: "mm", rationale: "Raises critical shear buckling stress." },
    ],

    ctmfs: [
      {
        title: "Iteration and refinement",
        fdcr: "Converge",
        application:
          "Iteration and refinement in this case refers to the use of scripts and loops to mathematically optimize different parameters. Before fabrication, we ran five major computational iterations using a ==Python script== that re-evaluated ==eight failure modes== while plotting shear and bending envelopes as flange build-up and web height changed. This iterative loop became our ==convergence engine==, letting us immediately see how each geometric adjustment shifted the governing failure mode under Load Cases 1 and 2 [2].",
        assessment:
          "This approach advanced my ==agnostic (impartial) lens== on knowledge as it guarded our team from ==anchoring== to widening or optimizing one sole aspect of the bridge. Because every change could be evaluated quickly, we were able to refine the bridge geometry systematically instead of relying on intuition. The process ultimately converged on a configuration that balanced ==bending resistance== with ==plate buckling== limits while remaining within the material constraints of the matboard sheet.",
        figures: [
          {
            src: "/images/bridge/python-code.png",
            alt: "Python code defining the bridge cross-section variables",
            caption:
              "Cross-section parameterisation in Python. Changing one dimension variable automatically propagated through all 8 failure mode calculations.",
          },
          {
            src: "/images/bridge/bending-moment.png",
            alt: "Bending moment envelope for Load Case 2 showing failure thresholds by mode",
            caption:
              "Bending moment envelope under Load Case 2 (452 N). Compression failure governs, with the applied moment staying within all failure thresholds across the span.",
          },
        ],
      },
      {
        title: "Trade-offs",
        fdcr: "Converge",
        application:
          "To distribute material effectively, we conducted a ==parameterized trade-off analysis== mapping how widening the flange improved compression while sharply reducing Case 3 plate buckling resistance. This directly guided our decision to reallocate horizontal material into a ==120 mm vertical web==, significantly increasing ==bending stiffness== without triggering plate buckling.",
        assessment:
          "Making these relationships visible clarified how each geometric decision affected the competing failure modes. It was highly effective for our team, providing an objective way to navigate our strict material constraints. I will definitely rely on it to justify resource allocation in future projects, provided that I ensure to consider fabrication tolerances.",
        figures: [
          {
            src: "/images/bridge/tradeoffs.png",
            alt: "Trade-off analysis chart for bridge design parameters",
            caption: "Flange width vs. Case 3 plate buckling trade-off.",
          },
        ],
      },
      {
        title: "CAD (Onshape)",
        fdcr: "Represent",
        application:
          "Computer Aided Design (CAD) creates digital 2D or 3D geometric representations used to validate design aspects. Our teammate Karan used ==Onshape== to build a 3D model of the final bridge, defining diaphragm spacing and cross-sectional geometry. Translating the parameters from our Python analysis into a spatial model made the design legible and allowed us to plan the cutting layout on the ==813 × 1016 mm== matboard sheet [2].",
        assessment:
          "The CAD model was incredibly useful as it allowed us to coordinate the construction of our physical structure. This tool was the perfect fit for our representation phase, providing a ==precise digital blueprint== to guide our physical fabrication. Moving forward, ==catching spatial conflicts digitally== will be a non-negotiable step before I make any physical cuts. However, I must remain conscious of designing geometry that exceeds human precision limits, a lesson to remain ==pragmatic==.",
        figures: [
          {
            src: "/images/bridge/onshape-model.png",
            alt: "Multi-view Onshape CAD model of the matboard box-girder bridge (Karan Chawla)",
            caption:
              "Multi-view Onshape model of the final box-girder design (Karan Chawla). Internal diaphragm spacing and cross-sectional geometry were dimensioned here before cutting.",
          },
        ],
      },
    ],

    results: {
      headline:
        "==Compression governed at FOS 2.49== · ==Physical Testing Validates 450 N Sustained Load==",
      body: "The computational model predicted a theoretical failure load of ==1125 N== based on a ==2.49== factor of safety. In the lab we stepped through increasing point loads: ==133 N==, ==266 N==, ==400 N==, and ==450 N==, with failure at ==520 N== and a cumulative load total of ==1250 N==. Ultimate structural failure occurred exclusively at the physical matboard splice joint, proving the primary cross-section design successfully resisted all calculated buckling and shear modes. Full design rationale, iterations, and calculation detail appear in our team design report [3].",
    },

    lessons:
      "The physical bridge ultimately failed at a ==splice joint== that none of our models captured. Going into this project, I was already aware that models are inherently simplifications of reality, and I was exploring ==pragmatism== after our praxis project. However, I didn't truly realize the danger of relying on them until I watched our bridge collapse under the limitations of ==imperfect construction quality==.\n\nThis failure reinforced the perspective I was introduced to in ==Praxis I== [1] because it showed me that the math did not matter if we ignored human imperfections. It highlighted that true engineering design begins where the ==theoretical model== ends, turning the exploration of ==pragmatism== I had going into the project into a fundamental ==value==. It taught me that my duty as an engineering student is to apply ==human judgment== to bridge the gap between models and ==actual constructability==.",

    /* Gallery: fabrication and team photo (Python, bending envelope, and Onshape sit under CTMFs; unified lightbox order follows that sequence). */
    images: [
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
          "Team 701 with the finished bridge. The design cleared an experimental 450 N load totalling to 1250 N cumulative load.",
      },
    ],

    portfolioReferenceIndices: [2, 3],
  },

  /* ── Math IA — Dolphin Kick ───────────────────────────────── */
  {
    slug: "dolphin-kick",
    title: "Dolphin Kick Biomechanics",
    subtitle: "Mathematical Modelling · Biomechanics",
    date: "Sep 2024 – Jan 2025",
    tags: ["Mathematical Modelling", "Biomechanics", "Adobe After Effects", "Kinematic Analysis"],
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
    tags: ["Python", "Algorithm Implementation", "Signal Processing", "Image Compression"],
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
  {
    slug: "esc102-riptune",
    title: "RipTune: Variable Resistance for Swimmers",
    subtitle: "Praxis II · ESC102 · University of Toronto",
    date: "Feb – Apr 2026",
    tags: ["Engineering Design", "Human Factors", "Verification & Validation", "Stakeholder Engagement"],
    teamSize: 4,
    teammates: ["Ethan Li", "Xiahaotian (Sky) Su", "Noel Puthoor"],
    status: "Completed",
    kind: "design",
    summary:
      "Engineered RipTune, a come-along winch that clips to starting blocks so MSSAC high-performance swimmers can add individualized variable swim resistance to their training. Proxy testing measured roughly 0 to 824 N continuous resistance using a come-along, bungee line, and carabiner. Figures and summarized metrics appear on the showcase poster [4] and course one-pager [5].",
    links: [
      { label: "Showcase Poster", href: "/api/pdf/praxis-ii-poster", type: "pdf" },
      { label: "One-Pager", href: "/api/pdf/praxis-ii-one-pager", type: "pdf" },
    ],
    problem:
      "The High Performance swim team at MSSAC needs resistance-training equipment that allows incremental adjustment of load while staying safe, portable, and compatible with competitive pool environments. Competitive swimmers already use resistance tools to train explosiveness, but current options offer limited variability, which restricts individualized training.",
    constraints: [
      {
        label: "Resistance levels",
        value: "5",
        unit: "levels (110 to 250 N)",
        rationale: "≥5 discrete levels spanning the small to large parachute band [4].",
      },
      {
        label: "Setup / level change",
        value: "< 15",
        unit: "s",
        rationale: "Time to switch or reset resistance at the blocks; proxy avg ~7.87 s.",
      },
      {
        label: "Portability envelope",
        value: "< 13×13×11",
        unit: "in",
        rationale: "Pack-down size; ≤ 10 kg unloaded (brief).",
      },
      {
        label: "Safety",
        value: "No",
        unit: "electrical components",
        rationale: "Wet deck: mechanical system only.",
      },
      {
        label: "Step granularity",
        value: "< 5",
        unit: "% of max",
        rationale: "Min. step between adjacent levels vs max resistance [4].",
      },
    ],
    ctmfs: [
      {
        title: "Working environment analysis",
        fdcr: "Frame",
        application:
          "Working Environment Analysis defines the physical, chemical, and operational extremes a design must withstand in its intended context. The original RFP highlighted ==chlorine degradation==, which we carried into our reframing phase as a key constraint. However, we recognized that fully chlorine-resistant materials are rare for training equipment outside of swimwear, so we had to find a balance between ideal performance and availability. This balance was challenged as materials with less than 100% chlorine resistance may not be the most sustainable. To compensate, we drastically increased the durability requirement from the original RFP to over ==100,000 cycles==. This reframing ensured the device could withstand daily use over multiple years while still balancing ==material sustainability==.",
        assessment:
          "Performing this analysis ultimately developed my commitment to ==sustainability==. We realized that many solutions could quickly corrode in the pool chemicals, becoming expensive waste. This project proved a core concept to me: ==the more physically durable a product is against its environment, the more environmentally sustainable it becomes==. Moving forward, I will use environmental analysis not just to set technical thresholds, but as a strict guardrail to ensure my designs are economically and environmentally sustainable from day one.",
        figures: [
          {
            src: "/images/praxis-ii/sustainability.png",
            alt: "Durability slide linking 100 000 use cycles and chlorine force retention to sustainability",
            caption:
              "Durability framing: 100 000 cycles and chlorine exposure targets tied to sustainability (slide excerpt).",
          },
        ],
      },
      {
        title: "Verification vs. validation",
        fdcr: "Converge",
        application:
          "==Verification== evaluates whether a design meets its specified technical requirements (did we build the product right?), while ==validation== ensures the design actually fulfills the stakeholder's needs in context (did we build the right product?). Through ==proxy testing==, we successfully verified our device could output the required resistance at a variable level and have a fast set-up time. However, due to severe communication blockers with the MSSAC head coach, we were unable to formally validate the final prototype with our primary users, a limitation we had to address during Showcase.",
        assessment:
          "This limitation severely tested my commitment to ==stakeholder centricity==. The lack of contact led me to question if direct stakeholder input beyond the initial RFP was even necessary, given how strong our technical verification was. However, realizing that our technically sound device still risked not being entirely adoptable as the coach may want some additional features or explicitly address certain issues (like ==flip turns==) proved that verification without validation is an ==engineering failure==. This experience cemented my belief that engineering models only gain true meaning when validated by the community using them, a standard I will rigorously enforce in future client work.",
        figures: [
          {
            src: "/images/praxis-ii/verification.png",
            alt: "Nine-frame sequence of bungee resistance pulled from slack to taut on a desk proxy test",
            caption:
              "Proxy verification: sequential pulls showing resistance ramp from slack to taut (desk test).",
          },
        ],
      },
      {
        title: "Signal-to-noise ratio",
        fdcr: "Represent",
        application:
          "==Signal-to-noise ratio== is a communication principle where the signal is the essential message and the noise is any distracting, irrelevant, or overly dense information. During our ==Beta release==, our presentation was extremely high-noise. We cluttered our concept representation with a slideshow, a poster board, a whiteboard, and printouts, and our assessors were unsure where to put their focus. To fix this for the final Showcase poster and presentation, we acknowledged the ==Gutenberg diagram==, used colour to create focus, and optimized our presentation in ways to not overwhelm the assessors.",
        assessment:
          "This shift in representation perfectly aligned with my value of ==bounded rationality==. Showcase assessors operate under strict cognitive and time constraints. Assuming an assessor will perfectly digest large walls of texts during a live presentation is flawed. Moving forward, I am committed to use the ==signal-to-noise principle== in all future engineering communications, ensuring I design my arguments and visuals to accommodate the ==realistic cognitive bandwidth== of my audience rather than just dumping all my data onto the page.",
        figures: [
          {
            src: "/images/praxis-ii/beta-poster.png",
            alt: "Beta release poster layout with Variable Swim Resistance need and stakeholder sections",
            caption:
              "Beta release table setup: project sheet, Lotus Blossom, attribute listing, reverse brainstorming, SCAMPER, and NGOs (high-noise iteration before Showcase).",
          },
        ],
      },
    ],
    results: {
      headline:
        "==~7.87 s avg setup== · ==412 N/m spring constant== · ==0 to 824 N continuous resistance==",
      body:
        "Proxy testing achieved a ==~412 N/m== spring constant, ==~7.87 s== average setup (under the ==< 15 s== target), and a ==0 to 824 N== continuous resistance envelope. The recommended design is a ==come-along== on the starting block with a ==bungee cord== and a ==carabiner== attachment for fast rigging. The prototype used ==one-way spooling==. Protocols, figures, and design rationale appear on the showcase poster [4] and course one-pager [5].",
    },
    lessons:
      "My value of ==bounded rationality== applied during the representation phases of our design process, communication roadblocks challenged my value of ==stakeholder centric approaches==, and refining the RFP gave me a new perspective on ==sustainability==. This project was a bridge between my old and new values and currently shapes the framework of how I will approach future design projects.",
    positionImpact:
      "Going into the Praxis II design project, my values from the first semester were formalized into my ==old position statement==. I approached the project intending to use my values such as ==stakeholder centricity== to meet the coach's needs. However, the design began to shape my values more than my values shaped the design.",
    portfolioReferenceIndices: [4, 5],
    images: [
      {
        src: "/images/praxis-ii/pitch-to-carrick.jpg",
        alt: "Team presenting RipTune informally to the course lecturer in front of the RipTune poster",
        caption:
          "Pitch to our lecturer with the RipTune poster after the Showcase presentation.",
      },
      {
        src: "/images/praxis-ii/sketch-final-design.png",
        alt: "Ink sketch of come-along winch with hook, body, crank, and dimension callouts",
        caption: "Final come-along concept sketch (Noel Puthoor).",
      },
    ],
  },
];

/** Look up a single case study by slug. Returns undefined if not found. */
export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((p) => p.slug === slug);
}
