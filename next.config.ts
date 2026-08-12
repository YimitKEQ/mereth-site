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
