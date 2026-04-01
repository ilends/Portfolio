import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./components/ThemeProvider";
import { Header } from "./components/Header";
import { DotGrid } from "./components/DotGrid";
import { SplashScreen } from "./components/SplashScreen";
import "katex/dist/katex.min.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "David Angelo — Engineering Science @ UofT",
    template: "%s | David Angelo",
  },
  description:
    "David Angelo is an Engineering Science student at the University of Toronto (UofT), specialising in biomedical research and emergency medicine. Explore projects in structural analysis, signal processing, medical device design, and mathematical modelling.",
  keywords: [
    "David Angelo",
    "Engineering Science",
    "University of Toronto",
    "UofT",
    "Biomedical Engineering",
    "Emergency Medicine",
    "Medical Device Design",
    "Signal Processing",
    "Python",
    "Fusion 360",
    "Portfolio",
  ],
  authors: [{ name: "David Angelo", url: "https://davidangelo.ca" }],
  creator: "David Angelo",
  metadataBase: new URL("https://davidangelo.ca"),
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://davidangelo.ca",
    siteName: "David Angelo",
    title: "David Angelo — Engineering Science @ UofT",
    description:
      "Engineering Science student at UofT specialising in biomedical research and emergency medicine. Projects in structural analysis, signal processing, and medical device design.",
  },
  twitter: {
    card: "summary",
    title: "David Angelo — Engineering Science @ UofT",
    description:
      "Engineering Science student at UofT specialising in biomedical research and emergency medicine.",
    creator: "@davidangelo",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      {/*
        suppressHydrationWarning prevents React hydration mismatch
        caused by the ThemeProvider toggling the "dark" class on <html>.
        The inline script below sets the correct class before hydration
        to eliminate any flash of wrong theme.
      */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-page text-ink antialiased">
        <ThemeProvider>
          {/* Splash screen — z-[9999], only plays once per session */}
          <SplashScreen />
          {/* Canvas dot grid — fixed, z-0, behind all content */}
          <DotGrid />
          {/* Site content: z-10 keeps it above the canvas */}
          <div className="relative z-10">
            <Header />
            {children}
            {/* Site footer */}
            <footer className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-rim/20 mt-4">
              <span className="font-mono text-xs text-ink-muted/40 tracking-wider select-none">
                © {new Date().getFullYear()} David Angelo
              </span>
              <a
                href="/changelog"
                className="font-mono text-xs text-ink-muted/40 hover:text-accent-hi transition-colors duration-150 tracking-wider"
              >
                changelog · v1.1.0
              </a>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
