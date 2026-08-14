import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { canonicalFor } from "@/lib/seo";

/**
 * The chronicle became the changelog.
 *
 * They were the same page with different names, and the changelog does it
 * better: searchable, filterable by kind, and carrying the whole history rather
 * than the last few. This redirect stays because the old path is linked from
 * outside the site.
 *
 * The metadata below exists because a static export cannot send a 301. What it
 * ships instead is a page that redirects in the browser, and a crawler sees
 * that page: it had no heading, no description of its own, and the identical
 * title to the home page, which is the shape of a thin duplicate. It now names
 * the changelog as its canonical and asks not to be indexed, which is as close
 * to a 301 as a file host allows.
 */
export const metadata: Metadata = {
  title: "Chronicle",
  description: "The chronicle moved to the changelog, which carries the whole history.",
  alternates: { canonical: canonicalFor("/changelog") },
  robots: { index: false, follow: true },
};

export default function ChroniclePage() {
  redirect("/changelog");
}
