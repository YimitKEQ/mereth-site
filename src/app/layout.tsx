import type { Metadata } from "next";
import { Alegreya, Alegreya_Sans, Cinzel } from "next/font/google";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/lib/site";

import "./globals.css";

/*
 * Three faces, each doing one job.
 *
 * Cinzel is Trajan-derived carved Roman capitals, which is the Empire's own
 * lettering rather than a fantasy pastiche. Alegreya Sans is humanist and
 * slightly calligraphic, so UI reads as written rather than manufactured. Its
 * serif companion carries long-form document text on vellum.
 */
const display = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const ui = Alegreya_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ui",
  display: "swap",
});

const serif = Alegreya({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
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
    <html lang="en" className={`${display.variable} ${ui.variable} ${serif.variable}`}>
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
