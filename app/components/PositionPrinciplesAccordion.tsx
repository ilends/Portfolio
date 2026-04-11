import type { ReactNode } from "react";
import { AccentGlow } from "./AccentGlow";

type PositionSection = { title: string; content: ReactNode };

const SECTIONS: PositionSection[] = [
  {
    title: "The Thesis: How I engineer for communities through different lenses",
    content: (
      <div className="space-y-4">
        <p>
          My practice as an <em>engineering student</em> is driven by a single core
          principle: engineering solutions only gain meaning when they are{" "}
          <AccentGlow>validated by the communities they serve</AccentGlow>. I
          strive to remain a <AccentGlow>learner and student first</AccentGlow>, bridging the
          gap between rigorous technical constraints and how human behaviour is,
          in nature, unpredictable.
        </p>
        <p>
          My knowledge is always impartial, or <em>agnostic</em>, and this is
          reflected in the interpretive lens and humility I carry into
          engineering design. I <em>currently</em> see engineering design as an
          intersection between the <AccentGlow>models</AccentGlow> and{" "}
          <AccentGlow>constraints</AccentGlow> seen
          in my understanding of <em>engineering</em> and the value-driven
          decisions that end up shaping design. I also acknowledge that my
          position and understanding is continually growing and developing.
        </p>
        <p>
          Models and verification are essential tools in progressing our
          understanding of our designs and the world, however they are inherently
          incomplete. I see true engineering design as when{" "}
          <AccentGlow>informed, human judgment</AccentGlow> takes over the
          limitations of these theoretical models.
        </p>
        <p>
          I recognize that a design&apos;s ultimate success is determined by its
          real-world practicality and <em>validating</em> it with{" "}
          <AccentGlow>stakeholders</AccentGlow>. Prioritizing{" "}
          <AccentGlow>iterative feedback</AccentGlow> and{" "}
          <AccentGlow>consistent communication</AccentGlow> between the designer
          and stakeholders
          is essential to how I approach engineering.
        </p>
        <p>
          Through new design work, my position has <em>evolved</em> to understand
          that a solution, amongst all other requirements, should be{" "}
          <AccentGlow>sustainable</AccentGlow> in order to function as a
          successful design.
          Society depends on sustainable practices and low-cost methods as our
          world&apos;s environmental longevity is slowly declining.
        </p>
      </div>
    ),
  },
  {
    title:
      "A Pragmatic Approach: How I balance models with real-world practicality",
    content: (
      <div className="space-y-4">
        <p>
          In my academic path within the University of Toronto, we rely heavily
          on structural models to quantify reality. However, as the statistician
          George Box noted,{" "}
          <AccentGlow>models are inherently incomplete simplifications</AccentGlow>
          . This was especially noted within a group project for our structural
          engineering course. While our mathematical models could calculate the
          precise shear and bending moments of our bridge design, the physical
          construction of our bridge introduced material imperfections and human
          construction constraints which calculations ignored.
        </p>
        <p>
          I recognize that models only exist in a vacuum. True engineering design{" "}
          <em>begins</em> precisely when the <em>model</em> fails to capture the
          whole picture, requiring me to step in and engineer for{" "}
          <AccentGlow>practical realities</AccentGlow> rather than theoretical
          perfection.
        </p>
      </div>
    ),
  },
  {
    title:
      "Bounded Rationality: What frontline care taught me about designing for cognitive load",
    content: (
      <div className="space-y-4">
        <p>
          Many classical engineering and economic models assume stakeholders
          possess perfect knowledge and infinite time to make optimal decisions.
          My frontline experience has constantly shown me otherwise.
        </p>
        <p>
          When I supervise aquatic environments or teach first aid protocols, I
          am reminded that humans operate under{" "}
          <AccentGlow>bounded rationality</AccentGlow>. In a crisis,
          first responders do not always have the bandwidth to optimize. Instead,
          they must &ldquo;<AccentGlow>satisfice</AccentGlow>&rdquo; (Tragakes 74),
          finding adequate,
          rapid solutions to stabilize emergencies until hospital care.
        </p>
        <p>
          Therefore, the systems I design cannot perfectly assume rational users,
          I must acknowledge the unpredictability in human nature. They must be{" "}
          <AccentGlow>intuitive</AccentGlow>, allowing stakeholders to act
          effectively even when time,
          information, and cognitive capacity are limited.
        </p>
        <p className="mt-4 pt-4 border-t border-rim/40 text-[13px] text-ink/70 leading-relaxed">
          Tragakes, Ellie.{" "}
          <cite className="not-italic">
            <em>Economics for the IB Diploma Coursebook</em>
          </cite>
          . 3<sup>rd</sup> ed., Cambridge University Press, 2020. pp. 72–75.
        </p>
      </div>
    ),
  },
  {
    title: "The Agnostic Lens: How I embrace partial knowledge",
    content: (
      <div className="space-y-4">
        <p>
          My philosophy involves holding my assumptions very lightly. Growing up
          around conflicting belief systems, I learned early in my life to
          reflect rather than follow. Many of my current understandings also
          trace back to the habits and open minded thinking my English teacher
          encouraged in his classrooms.
        </p>
        <p>
          This cultivated what I consider an{" "}
          <AccentGlow>agnostic lens on life</AccentGlow>, not as a rejection of
          meaning, but as a humble acceptance that my knowledge is always
          partial. I carry this exact humility into my engineering practice. I
          am drawn to problems where{" "}
          <AccentGlow>precision directly affects people</AccentGlow>.
        </p>
      </div>
    ),
  },
  {
    title:
      "Composure: How I translate musical discipline into technical execution",
    content: (
      <div className="space-y-4">
        <p>
          Through four years of playing the bass guitar for a concert band, and
          recently making my transition from the bass to an acoustic guitar,
          it&apos;s clear that technical precision is fundamental in developing
          good technique and sounds. However, musical ability exists to be shared.
          The goal is not simply just to play correctly, but to perform for an
          audience, something I have done countless times.
        </p>
        <p>
          I have also been on the receiving end of a performance, having attended
          Taylor Swift&apos;s Eras Tour back in late 2024. The performance brought
          together thousands of people who shared a common expectation: to be
          moved, entertained, and immersed in the music. It made me realize how
          strongly an audience&apos;s expectations shape the success of any
          performance.
        </p>
        <p>
          Ultimately, this has shown me that executing a successful design
          requires the same discipline as mastering a complex physical skill.
          Technical proficiency, much like musical performance, only gains true
          meaning when it{" "}
          <AccentGlow>resonates with its audience</AccentGlow>. In engineering,
          this is the <AccentGlow>community of stakeholders</AccentGlow> who rely
          on it.
        </p>
      </div>
    ),
  },
];

export function PositionPrinciplesAccordion() {
  return (
    <div className="space-y-2 max-w-3xl">
      {SECTIONS.map(({ title, content }) => (
        <details
          key={title}
          className="group rounded-lg border border-rim/50 bg-ink/[0.02] open:border-accent-hi/35 open:bg-accent/[0.04] transition-colors"
        >
          <summary className="cursor-pointer list-none px-4 py-3 pr-10 font-medium text-ink tracking-tight relative select-none [&::-webkit-details-marker]:hidden">
            <span className="text-[15px]">{title}</span>
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-accent-hi/80 transition-transform group-open:rotate-180"
              aria-hidden
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </summary>
          <div
            className="px-4 pb-4 pt-0 text-[15px] text-ink/85 border-t border-rim/30 mt-0 pt-3 [&_p]:leading-relaxed [&_em]:px-[0.07em] [&_cite_em]:px-0"
          >
            {content}
          </div>
        </details>
      ))}
    </div>
  );
}
