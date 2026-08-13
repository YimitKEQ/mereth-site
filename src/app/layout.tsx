import type { Metadata } from "next";
import { Exo } from "next/font/google";
import localFont from "next/font/local";

import { BackgroundStage } from "@/components/layout/BackgroundStage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/lib/site";

import "./globals.css";
import { asset, OG_IMAGE, SITE_ORIGIN } from "@/lib/asset";

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
    /* Templated like `title` above, so a shared page previews as itself. A
       fixed string here meant every lore document, the most link-shareable
       pages on the site, pasted into Discord as just "Mereth Roleplay". */
    title: {
      default: `${site.name} Roleplay | ${site.tagline}`,
      template: `%s | ${site.name} Roleplay`,
    },
    description: site.description,
    type: "website",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${friz.variable} ${ui.variable}`}
    >
      <body className="min-h-screen antialiased">
        {/* Mereth's own plate, moving. The poster is the video's own opening
            frame, pulled out of the file itself: it used to be a different
            painting altogether, so every refresh showed a keep in a snowstorm
            for a moment and then cut to a statue on a mountain. */}
        <BackgroundStage poster={asset("/art/hero-hold.webp")} video={asset("/art/mereth-bg.mp4")} />

        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main" className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
