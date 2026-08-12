import type { Metadata } from "next";
import { Exo } from "next/font/google";
import localFont from "next/font/local";

import { BackgroundStage } from "@/components/layout/BackgroundStage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/lib/site";

import "./globals.css";
import { asset, SITE_ORIGIN } from "@/lib/asset";
import { CALM_BOOT } from "@/lib/calm";

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
  /*
   * Where relative metadata URLs resolve from. Without it the Open Graph image
   * resolves against localhost, so a link pasted into Discord previews with a
   * broken image from whichever machine built the page. `SITE_ORIGIN` is where
   * the built site is served from.
   */
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `${site.name} Roleplay | ${site.tagline}`,
    template: `%s | ${site.name} Roleplay`,
  },
  description: site.description,
  icons: { icon: asset("/brand/icon.png"), apple: asset("/brand/icon.png") },
  openGraph: {
    title: `${site.name} Roleplay`,
    description: site.description,
    type: "website",
    images: [{ url: asset("/brand/banner.png"), width: 2800, height: 722 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${friz.variable} ${ui.variable}`}
      /* The boot script stamps data-calm on this element before React
         hydrates, so the server markup and the client tree differ here by
         design. Without this, React reports it as a hydration mismatch. */
      suppressHydrationWarning
    >
      <head>
        {/* Sets quiet mode before first paint. In React it would cost every
            reader who wants it one frame of the decorated page, which is the
            jolt the mode exists to prevent. */}
        <script dangerouslySetInnerHTML={{ __html: CALM_BOOT }} />
      </head>
      <body className="min-h-screen antialiased">
        {/* Mereth's own plate, moving. Falls back to a still frame when autoplay
            is refused or motion is not wanted. */}
        <BackgroundStage poster={asset("/art/hero-hold.png")} video={asset("/art/mereth-bg.mp4")} />

        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main" className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
