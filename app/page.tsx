import type { Metadata } from "next";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";

export const metadata: Metadata = {
  title: "David Angelo — Engineering Science @ UofT",
  description:
    "David Angelo is an Engineering Science student at the University of Toronto, pursuing a long-term focus on Emergency Medicine and biomedical research. NLS-certified lifeguard and certified First Aid instructor.",
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
    </main>
  );
}
