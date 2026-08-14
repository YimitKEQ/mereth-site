import type { MetadataRoute } from "next";

import { canonicalFor, IS_MIRROR, LORE_PRIORITY, ROUTES } from "@/lib/seo";
import { loreDocuments } from "@/lib/world/lore";

/**
 * The sitemap, built from the route registry.
 *
 * The site had none at all, which for forty pages behind a JavaScript-rendered
 * navigation is the difference between a crawler finding the handbook and a
 * crawler finding the homepage. Every URL here is the canonical one, on the
 * real domain, with the trailing slash the host actually serves: a sitemap that
 * lists a URL which then redirects is a sitemap Google discounts.
 *
 * `force-static` because the whole site is exported to files. Without it this
 * is treated as a dynamic route and never written.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  /* The mirror should not advertise itself. Its pages already carry noindex,
     and a sitemap is an invitation, so it gets an empty one rather than a copy
     of the real site's. */
  if (IS_MIRROR) return [];

  const pages = ROUTES.map((route) => ({
    url: canonicalFor(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const lore = loreDocuments.map((document) => ({
    url: canonicalFor(`/lore/${document.slug}`),
    changeFrequency: "yearly" as const,
    priority: LORE_PRIORITY,
  }));

  return [...pages, ...lore];
}
