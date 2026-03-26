import type { Metadata } from "next";
import { FadeIn, StaggerContainer, StaggerItem } from "../components/FadeIn";

export const metadata: Metadata = {
  title: "Contact – David Angelo",
};

/* ── Icons ────────────────────────────────────────────────────── */

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* ── Components ───────────────────────────────────────────────── */

function ContactButton({
  href,
  icon,
  label,
  sublabel,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-4 w-full rounded-xl border border-rim/50 bg-card px-5 py-4 hover:border-accent/50 hover:bg-surface transition-colors duration-200 group"
    >
      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/15 text-accent-hi group-hover:bg-accent/25 transition-colors duration-200 shrink-0">
        {icon}
      </span>
      <div>
        <p className="text-base font-semibold text-ink">{label}</p>
        <p className="text-sm text-ink-muted">{sublabel}</p>
      </div>
      <svg
        className="ml-auto text-ink-muted group-hover:text-accent-hi/50 shrink-0 transition-colors duration-200"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 7h10v10M7 17 17 7" />
      </svg>
    </a>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 pt-28 pb-24">
      {/* Heading */}
      <FadeIn>
        <h1 className="text-5xl font-bold text-ink mb-3 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-base text-ink-muted mb-10 leading-relaxed">
          I&apos;m always open to new opportunities, research collaborations,
          and interesting conversations. Feel free to reach out.
        </p>
      </FadeIn>

      {/* Contact buttons — staggered bounce-in */}
      <StaggerContainer className="flex flex-col gap-3 mb-12">
        <StaggerItem>
          <ContactButton
            href="mailto:contact@davidangelo.ca"
            icon={<MailIcon />}
            label="Email"
            sublabel="contact@davidangelo.ca"
          />
        </StaggerItem>
        <StaggerItem>
          <ContactButton
            href="https://linkedin.com/in/david-angelo"
            icon={<LinkedInIcon />}
            label="LinkedIn"
            sublabel="linkedin.com/in/david-angelo"
            external
          />
        </StaggerItem>
        <StaggerItem>
          <ContactButton
            href="https://github.com/ilends"
            icon={<GitHubIcon />}
            label="GitHub"
            sublabel="github.com/ilends"
            external
          />
        </StaggerItem>
        <StaggerItem>
          <ContactButton
            href="https://instagram.com/davidangelo.7"
            icon={<InstagramIcon />}
            label="Instagram"
            sublabel="@davidangelo.7"
            external
          />
        </StaggerItem>
      </StaggerContainer>

      {/* Divider */}
      <FadeIn delay={0.3}>
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-rim/50" />
          <span className="text-xs font-semibold tracking-widest uppercase text-ink-muted">
            Based In
          </span>
          <div className="flex-1 h-px bg-rim/50" />
        </div>
      </FadeIn>

      {/* Location card */}
      <FadeIn delay={0.4}>
        <div className="rounded-xl border border-rim/50 bg-card px-6 py-5">
          <div className="flex items-center gap-2 text-ink mb-3">
            <PinIcon />
            <span className="font-semibold text-base">
              Toronto and Mississauga, ON, Canada
            </span>
          </div>

          <p className="text-sm text-ink-muted leading-relaxed mb-4">
            Home to the University of Toronto, one of North America&apos;s
            top research universities and a thriving
            engineering and tech ecosystem.
          </p>

          <ul className="space-y-1.5">
            {[
              "UofT consistently ranked #1 in Canada for engineering research",
              "GTA population: ~7 million across a diverse, multicultural region",
              "Home to Canada's largest innovation hubs: MaRS Discovery District, DMZ, and more",
              "Home to leading academic hospitals for biomedical research and clinical care: UHN, St. Michael's Hospital, SickKids, Sunnybrook, and more",
            ].map((fact, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-ink-muted leading-relaxed"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-hi shrink-0" />
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
    </main>
  );
}
