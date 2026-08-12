import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /*
   * This project has its own git repository nested inside the mod repo, so
   * Turbopack walks up, finds the parent's lockfile, and warns that it is
   * ignoring it. Pinning the root here stops the guess.
   */
  turbopack: { root: import.meta.dirname },
  /*
   * Off while the route set is still being built out.
   *
   * The nav and footer already link to /shop, /support, /donate and the legal
   * pages because the reference does. Typed routes reject a link to a page that
   * does not exist yet, and the alternative is shipping a folder of empty
   * "coming soon" stubs, which is worse. Turn this back on once those pages are
   * real: it will then catch every broken internal link at build time.
   */
  typedRoutes: false,
};

export default nextConfig;
