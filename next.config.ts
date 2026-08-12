import type { NextConfig } from "next";

/*
 * Static export, for GitHub Pages.
 *
 * Opt-in through the environment so `next dev` and `next start` keep behaving
 * like a normal Next app locally. The deploy workflow sets both variables.
 *
 * `MERETH_BASE_PATH` is the sub-path the site is served from. A project page
 * lives at `<user>.github.io/<repo>/`, so every asset and internal link has to
 * be prefixed or the whole thing 404s one level up. Empty for a custom domain
 * or a user page, which is the shape this moves to if it ever goes to
 * merethroleplay.com.
 */
const staticExport = process.env.MERETH_STATIC === "1";
const basePath = process.env.MERETH_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /*
   * The base path, readable from client code. `src/lib/asset.ts` uses it for
   * the handful of paths Next does not rewrite by itself: a raw <video src>, a
   * poster, the metadata icons and the search index fetch.
   */
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(staticExport
    ? {
        output: "export" as const,
        /*
         * The image optimiser is a server. There is not one on GitHub Pages, so
         * the originals are served as they are. They are already sized and
         * compressed by `scripts/build-images.mjs`, and the blur placeholders
         * are baked into the bundle rather than generated per request, so the
         * visible difference is nil.
         */
        images: { unoptimized: true },
        /*
         * Without this, export writes `out/changelog.html` and a static host
         * answers `/changelog` with a 404. With it, every route becomes
         * `out/changelog/index.html`, which every static host resolves.
         */
        trailingSlash: true,
        ...(basePath === "" ? {} : { basePath, assetPrefix: basePath }),
      }
    : {}),
  /*
   * This project has its own git repository nested inside the mod repo, so
   * Turbopack walks up, finds the parent's lockfile, and warns that it is
   * ignoring it. Pinning the root here stops the guess.
   */
  turbopack: { root: import.meta.dirname },
  /*
   * The little circled N in the corner. It is a development-only overlay and
   * never ships in a production build, but it sits on top of the design while
   * we are looking at the design, which is exactly the wrong time for it.
   * Compile and runtime errors are still surfaced with this off.
   */
  devIndicators: false,
  /*
   * Reviewing the site from another machine on the same network.
   *
   * Two things are needed and this is the second. `package.json` binds the
   * server to every interface on port 3100; this allows the LAN origin through.
   * Next blocks cross-origin requests to dev-only assets by default, so without
   * it the page loads over the LAN address and then sits there with no chunks
   * and no hot reload, which reads as a broken site rather than a config gate.
   *
   * Port 3100 rather than 3000 on purpose: the local SkyMP server in
   * `server-local/` binds 127.0.0.1:3000, and two servers fighting over one
   * port resolves differently depending on whether a name resolves to ::1 or
   * to 127.0.0.1 first. That is a bad hour to spend twice.
   *
   * Private ranges only, and development only. This has no effect on a
   * production build, and it does not widen what the machine listens on: the
   * firewall and the network still decide who can reach the port at all.
   */
  allowedDevOrigins: [
    "192.168.*.*",
    "10.*.*.*",
    "172.16.*.*",
    "172.17.*.*",
    "172.18.*.*",
    "172.19.*.*",
    // The machine's own name, so http://lodie:3000 works without an IP that
    // changes every time the router hands out a new lease.
    "lodie",
    "lodie.local",
    "*.local",
  ],
  /*
   * Off while the route set is still being built out.
   *
   * Typed routes reject a link to a page that does not exist yet, and the
   * alternative is shipping a folder of empty "coming soon" stubs, which is
   * worse. Turn this back on once the route set settles: it will then catch
   * every broken internal link at build time.
   */
  typedRoutes: false,
};

export default nextConfig;
