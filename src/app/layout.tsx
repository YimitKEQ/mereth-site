import type { Metadata } from "next";
import { Exo } from "next/font/google";
import localFont from "next/font/local";

import { BackgroundStage } from "@/components/layout/BackgroundStage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/lib/site";

import "./globals.css";

/*
 * Back to the reference's pairing, because it is simply better here.
 *
 * Friz Quadrata is a glyphic serif with flared, chiselled stems: it reads as
 * carved rather than typeset, and it carries a fantasy register without tipping
 * into costume. Cinzel was the safe substitute and safe was the problem, it
 * reads as a wedding invitation next to this.
 *
 * Supplied locally and self-hosted through next/font/local. `src/fonts/` is
 * gitignored, so the files never leave this machine.
 */
const friz = localFont({
  src: [
    { path: "../fonts/FrizQuadrataStd-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/FrizQuadrataStd-Bold.otf", weight: "700", style: "normal" },
    { path: "../fonts/FrizQuadrataStd-Italic.otf", weight: "500", style: "italic" },
    { path: "../fonts/FrizQuadrataStd-BoldItalic.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

/* Exo for UI: geometric, slightly condensed, and it stays legible at the small
 * tracked sizes this design uses everywhere. */
const ui = Exo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${friz.variable} ${ui.variable}`}>
      <body className="min-h-screen antialiased">
        {/* Mereth's own plate, moving. Falls back to a still frame when autoplay
            is refused or motion is not wanted. */}
        <BackgroundStage poster="/art/hero-hold.png" video="/art/mereth-bg.mp4" />

        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main" className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
