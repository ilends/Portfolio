import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./components/ThemeProvider";
import { Header } from "./components/Header";
import { DotGrid } from "./components/DotGrid";
import { SplashScreen } from "./components/SplashScreen";
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
  title: "David Angelo – Portfolio",
  description:
    "Engineering Science student at UofT. Aspiring Emergency Medicine physician and biomedical researcher.",
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
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
