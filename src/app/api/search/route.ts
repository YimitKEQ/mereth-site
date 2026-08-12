import { buildSearchIndex } from "@/lib/search-index";

/**
 * The palette's index, as one static document.
 *
 * `force-static` so it is generated once at build time and served as a file:
 * the index is derived entirely from committed content, so there is nothing to
 * recompute per request, and it keeps working under a static export.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return Response.json(buildSearchIndex(), {
    headers: { "cache-control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}
