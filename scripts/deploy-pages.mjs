// Build the site and publish it to GitHub Pages.
//
//   npm run deploy
//
// Deploys from this machine rather than from CI, and that is deliberate rather
// than lazy. Two things the build needs are gitignored and cannot be in a
// public repository:
//
//   src/fonts/        Friz Quadrata Std, a commercial typeface. Ours to use
//                     locally, not ours to redistribute as repository files.
//   public/art/*.mp4  the 24 MB background plate.
//
// A CI job would check out a tree without either and fail on the first import.
// Building here and pushing only the finished `out/` folder keeps the source of
// those files off GitHub while still publishing a complete site.
//
// The branch is force-pushed with a single commit each time. This is build
// output: its history is the source repository's history, and keeping every
// past build would grow the repository by the size of the video on every deploy.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO = process.env.MERETH_PAGES_REPO ?? "YimitKEQ/mereth-site";
const BRANCH = "gh-pages";
const BASE_PATH = process.env.MERETH_BASE_PATH ?? "/mereth-site";

const run = (file, args, options = {}) =>
  execFileSync(file, args, { stdio: "inherit", shell: false, ...options });

const capture = (file, args, options = {}) =>
  execFileSync(file, args, { encoding: "utf8", shell: false, ...options }).trim();

/*
 * `git config <key>` exits 1 when the key is unset, and execFileSync turns a
 * non-zero exit into a throw. The `|| "Mereth"` fallbacks below could never
 * run: on a machine with no configured identity the deploy died at the commit
 * with a raw "Command failed" instead.
 */
const captureOrEmpty = (file, args, options = {}) => {
  try {
    return capture(file, args, options);
  } catch {
    return "";
  }
};

/*
 * The build steps are run through their own JS entry points rather than through
 * npm. Node will not spawn a .cmd shim without a shell on Windows, and reaching
 * for a shell to work around that is how a path with a space in it becomes a
 * bug. These are the same binaries `npm run export` would reach.
 */
const node = process.execPath;
const bin = (...parts) => path.resolve("node_modules", ...parts);

console.log(`building for ${REPO} at base path "${BASE_PATH}"`);

run(node, [bin("typescript", "bin", "tsc"), "--noEmit"]);
run(node, [bin("next", "dist", "bin", "next"), "build"], {
  env: { ...process.env, MERETH_STATIC: "1", MERETH_BASE_PATH: BASE_PATH },
});
run(node, [path.resolve("scripts", "flatten-export.mjs")]);

const out = path.resolve("out");
if (!fs.existsSync(path.join(out, "index.html"))) {
  throw new Error("out/index.html is missing. The export did not produce a site.");
}

// Refuse to publish a build that still carries a dash. The export normalises
// the data, but a page could always introduce one by hand.
let dashes = 0;
const DASH = new RegExp("[\\u2014\\u2013]", "g");
const scan = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(full);
      continue;
    }
    if (!/\.(html|txt|js)$/.test(entry.name) && entry.name !== "search") continue;
    dashes += (fs.readFileSync(full, "utf8").match(DASH) ?? []).length;
  }
};
scan(out);
if (dashes > 0) throw new Error(`${dashes} em or en dashes in the built site. Not publishing.`);
console.log("no dashes in the built site");

const staging = fs.mkdtempSync(path.join(os.tmpdir(), "mereth-pages-"));
console.log(`staging in ${staging}`);

fs.cpSync(out, staging, { recursive: true });

const git = (...args) => run("git", args, { cwd: staging });

git("init", "-q", "-b", BRANCH);
git("config", "user.name", captureOrEmpty("git", ["config", "user.name"]) || "Mereth");
git("config", "user.email", captureOrEmpty("git", ["config", "user.email"]) || "noreply@example.com");
git("add", "-A");
git("commit", "-q", "-m", `deploy: ${capture("git", ["rev-parse", "--short", "HEAD"])}`);
git("remote", "add", "origin", `https://github.com/${REPO}.git`);
git("push", "-q", "--force", "origin", BRANCH);

fs.rmSync(staging, { recursive: true, force: true });

const [owner, name] = REPO.split("/");
console.log(`\npublished to https://${owner.toLowerCase()}.github.io/${name}/`);
