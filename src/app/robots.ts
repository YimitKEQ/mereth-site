import type { MetadataRoute } from "next";

import { SITE_ORIGIN } from "@/lib/asset";
import { IS_MIRROR } from "@/lib/seo";

/**
 * robots.txt.
 *
 * The site was serving Cloudflare's managed file and nothing of its own, so it
 * had no `Sitemap:` line, which is the one directive that matters most on a
 * site whose navigation is rendered client side.
 *
 * Cloudflare appends its managed block to whatever the origin returns rather
 * than replacing it, so this file and theirs both end up served. Their block
 * currently disallows GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider,
 * Applebot-Extended and meta-externalagent, which is a zone setting rather than
 * anything in this repository. Nothing here can override it, and it is worth
 * the team reconsidering: a roleplay server that wants to be found when
 * somebody asks an assistant "which Skyrim multiplayer RP servers are there"
 * is currently opted out of every one of those answers.
 *
 * `force-static` for the same reason as the sitemap: the site is exported.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  /* The mirror is a duplicate of the real site on a second host. Nothing on it
     should be indexed, and it must not offer a sitemap. */
  if (IS_MIRROR) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /* Not content. The search index is a build artifact the palette fetches,
           and the RSC payloads are the same pages again in a format no reader
           sees, which is duplicate content with no canonical of its own. */
        disallow: ["/search-index/", "/_next/static/chunks/"],
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
