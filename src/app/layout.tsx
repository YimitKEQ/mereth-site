import type { Metadata } from "next";
import { Exo } from "next/font/google";
import localFont from "next/font/local";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/lib/site";

import "./globals.css";

/*
 * The reference sets --font-exo and --font-friz, so those variable names are kept
 * and only the faces behind them differ.
 *
 * Exo is the reference's body face and is freely licensed, so it is exact.
 * Friz Quadrata is a commercial ITC typeface that cannot be redistributed, so
 * headings use Cinzel: the same glyphic-serif register, and correct in wide
 * uppercase tracking, which is the only way this site sets display type. Buying
 * Friz Quadrata later is a one-line swap here.
 */
const exo = Exo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-exo",
  display: "swap",
});

/*
 * Friz Quadrata Std, supplied locally. Self-hosted through next/font/local so
 * the files never leave this machine: `src/fonts/` is gitignored.
 */
const friz = localFont({
  src: [
    { path: "../fonts/FrizQuadrataStd-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/FrizQuadrataStd-Bold.otf", weight: "700", style: "normal" },
    { path: "../fonts/FrizQuadrataStd-Italic.otf", weight: "500", style: "italic" },
    { path: "../fonts/FrizQuadrataStd-BoldItalic.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-friz",
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
    <html lang="en" className={`${exo.variable} ${friz.variable}`}>
      <body className="min-h-screen antialiased">
        {/*
          One fixed backdrop behind the whole document. The reference uses a
          photographic forest plate here; this is a procedural stand-in so the
          layout reads correctly until real art is dropped in.
        */}
        <div className="page-backdrop" aria-hidden="true" />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main" className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
