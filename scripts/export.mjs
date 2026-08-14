// Build the static export for one named host, and prove it built for that host.
//
//   node scripts/export.mjs domain    -> merethroleplay.com, served at the root
//   node scripts/export.mjs pages     -> the GitHub Pages mirror, served at /mereth-site
//
// This exists because both hosts build into the same `out/` directory, so whichever
// ran last wins and the directory itself carries no evidence of which one that was.
// That is not a theoretical hazard: production was once served a Pages build, every
// asset URL prefixed with a sub-path that does not exist there, and the entire site
// rendered as unstyled text until it was rebuilt. HTML, JS and CSS all answered 200
// throughout, because the files were all present and the page was simply asking for
// them at the wrong address.
//
// Two things stop it happening again. The base path is set here rather than by
// whoever is typing, so it cannot be forgotten, and the finished output is scanned
// for the other host's prefix before anyone is allowed to publish it.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/** Where each host serves the site from. Empty means the root of a domain. */
const TARGETS = {
  domain: { basePath: "", what: "merethroleplay.com" },
  pages: { basePath: "/mereth-site", what: "the GitHub Pages mirror" },
};

/** Written beside the output so a later step can tell what it is looking at. */
export const MARKER = ".build-target";

const OUT = path.resolve("out");

export function readTarget(dir = OUT) {
  const file = path.join(dir, MARKER);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8").trim() : null;
}

/**
 * Fail if the build carries a base path belonging to a different host.
 *
 * Checks the HTML rather than the config, because the config is what we intended
 * and the HTML is what a browser will actually request.
 */
export function verifyExport(target, dir = OUT) {
  const wrong = Object.entries(TARGETS)
    .filter(([name, t]) => name !== target && t.basePath !== "")
    .map(([, t]) => t.basePath);

  const offenders = [];
  const walk = (folder) => {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const full = path.join(folder, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".html")) {
        const html = fs.readFileSync(full, "utf8");
        for (const prefix of wrong) {
          if (html.includes(`"${prefix}/`) || html.includes(`'${prefix}/`)) {
            offenders.push(path.relative(dir, full) + " references " + prefix);
            break;
          }
        }
      }
    }
  };
  if (fs.existsSync(dir)) walk(dir);

  // The domain build must also actually be at the root. A missing stylesheet link
  // would pass the check above by simply having no paths at all.
  const index = path.join(dir, "index.html");
  if (fs.existsSync(index)) {
    const html = fs.readFileSync(index, "utf8");
    const link = /<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/.exec(html);
    if (link === null) offenders.push("index.html has no stylesheet link at all");
    else if (!link[1].startsWith(TARGETS[target].basePath + "/_next/")) {
      offenders.push(`index.html stylesheet is ${link[1]}, wrong for ${target}`);
    }
  } else {
    offenders.push("index.html is missing");
  }

  return offenders;
}

// --- Run ---------------------------------------------------------------------

// `file://` plus a Windows path is not the same string as the URL Node reports,
// which starts `file:///D:/`. Comparing them by hand silently skips this whole
// block on Windows, so the comparison goes through pathToFileURL instead.
const invokedDirectly =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  const target = process.argv[2];
  if (target === undefined || !(target in TARGETS)) {
    console.error("usage: node scripts/export.mjs <" + Object.keys(TARGETS).join("|") + ">");
    console.error("");
    console.error("Pick the host deliberately. Both build into out/ and the last one wins,");
    console.error("so an untargeted build is how a mirror ends up on the live domain.");
    process.exit(1);
  }

  const { basePath, what } = TARGETS[target];
  console.log(`building for ${what}, base path "${basePath}"`);

  const node = process.execPath;
  const bin = (...parts) => path.resolve("node_modules", ...parts);
  const run = (args, env) =>
    execFileSync(node, args, { stdio: "inherit", shell: false, env: { ...process.env, ...env } });

  // Written before the build, because `public/` is copied into `out/` during it.
  // Generated rather than hand-kept so it cannot fall behind the route registry.
  run([path.resolve("scripts", "build-llms.mjs")], {});

  // Spawned through their JS entry points rather than npm: Node will not run a
  // .cmd shim without a shell on Windows, and a shell here is a quoting bug.
  run([bin("next", "dist", "bin", "next"), "build"], {
    MERETH_STATIC: "1",
    MERETH_BASE_PATH: basePath,
  });
  run([path.resolve("scripts", "flatten-export.mjs")]);

  const problems = verifyExport(target);
  if (problems.length > 0) {
    console.error("");
    console.error(`This build is not valid for ${target}:`);
    for (const problem of problems.slice(0, 10)) console.error("  " + problem);
    // The marker is removed rather than left stale, so nothing downstream can
    // read a target this output no longer deserves.
    fs.rmSync(path.join(OUT, MARKER), { force: true });
    process.exit(1);
  }

  fs.writeFileSync(path.join(OUT, MARKER), target + "\n");
  console.log(`verified, and out/${MARKER} says "${target}"`);
}
