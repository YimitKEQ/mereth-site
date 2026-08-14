// Put the built site into the team repository's `website/` folder, safely.
//
//   node scripts/publish-website.mjs <path-to-MerethRP-Website>
//
// The manual version of this was: build, then copy `out/` over `website/`. It went
// wrong the obvious way. `npm run deploy` also writes `out/`, for a different host,
// so running the two in the wrong order published the mirror's build to the live
// domain and served the site as unstyled text.
//
// So the build is not a step the caller performs any more. This runs it, for the
// domain, and refuses to copy anything that did not come out of that build.
//
// It also copies rather than replaces, on purpose, twice over:
//
//   Nothing is deleted. `website/` holds files the export does not produce and must
//   never lose, listed below, and it holds every previously deployed hashed chunk.
//   Cloudflare caches HTML for days, so a reader on a cached page will still ask for
//   the chunks that page was built against long after a deploy.
//
//   The preserved paths are checked afterwards rather than trusted, because the
//   failure they guard against is silent: the site keeps working for everyone whose
//   HTML is cached, and breaks only for the next person to arrive.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { readTarget, verifyExport } from "./export.mjs";

/** Files in `website/` that the export does not produce and must survive a publish. */
const PRESERVE = [
  "servers.json",
  "manifest.json",
  "lore",
  "scripts",
  "assets",
  "Mereth-RP-Rules.pdf",
];

const repo = process.argv[2];
if (repo === undefined) {
  console.error("usage: node scripts/publish-website.mjs <path-to-MerethRP-Website>");
  process.exit(1);
}
const website = path.join(repo, "website");
if (!fs.existsSync(website)) {
  console.error("Not a checkout of the team repository: " + website + " does not exist.");
  process.exit(1);
}

// Build it here. The caller cannot hand us the wrong one if the caller never picks.
console.log("building for the domain ...");
execFileSync(process.execPath, [path.resolve("scripts", "export.mjs"), "domain"], {
  stdio: "inherit",
  shell: false,
});

const target = readTarget();
if (target !== "domain") {
  console.error(`out/ is a "${target ?? "unknown"}" build, refusing to publish it.`);
  process.exit(1);
}
const problems = verifyExport("domain");
if (problems.length > 0) {
  console.error("Refusing to publish, the export is not valid for the domain:");
  for (const problem of problems.slice(0, 10)) console.error("  " + problem);
  process.exit(1);
}

// Note what must survive, so it can be checked rather than assumed.
const before = PRESERVE.filter((name) => fs.existsSync(path.join(website, name)));

fs.cpSync(path.resolve("out"), website, { recursive: true, force: true });
// The marker is ours and has no business being served.
fs.rmSync(path.join(website, ".build-target"), { force: true });

const missing = before.filter((name) => !fs.existsSync(path.join(website, name)));
if (missing.length > 0) {
  console.error("Publish removed files it must not have: " + missing.join(", "));
  process.exit(1);
}

const roots = ["functions", "site"];
for (const root of roots) {
  if (!fs.existsSync(path.join(repo, root))) {
    console.warn(`warning: ${root}/ is missing from the repository root`);
  }
}

console.log("");
console.log("copied out/ into " + website);
console.log("  preserved: " + (before.join(", ") || "nothing to preserve"));
console.log("  functions/ at the repo root: " + (fs.existsSync(path.join(repo, "functions")) ? "yes" : "NO"));
console.log("");
console.log("Now commit both site/ and website/ in that repository.");
