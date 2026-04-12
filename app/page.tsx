import type { Metadata } from "next";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";

export const metadata: Metadata = {
  title: "David Angelo - Engineering Science @ UofT",
  description:
    "David Angelo is an Engineering Science student at the University of Toronto, pursuing a long-term focus on Emergency Medicine and biomedical research. NLS-certified lifeguard and certified First Aid instructor.",
  keywords: [
    "Engineering Science",
    "University of Toronto",
    "Clinical Engineering",
    "Biomedical Design",
    "Emergency Medicine",
    "Biomechanics",
  ],
  openGraph: {
    title: "David Angelo - Engineering Science @ UofT",
    description:
      "Engineering Science student at the University of Toronto — Emergency Medicine, biomedical research, and engineering design.",
    url: "https://davidangelo.ca",
  },
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
    </main>
  );
}
