// Make the static export's RSC payloads reachable on a plain file host.
//
//   node scripts/flatten-export.mjs
//
// Next's client prefetches a route's payload from a flat path:
//
//   /changelog/__next.changelog.__PAGE__.txt
//
// but `output: "export"` writes it as a nested directory:
//
//   out/changelog/__next.changelog/__PAGE__.txt
//
// A server with a router papers over the difference. GitHub Pages does not, so
// every prefetch 404s, every internal link falls back to a full page load, and
// the console fills with errors on a site that otherwise works. This copies
// each payload to the flat name the client actually asks for, leaving the
// nested one in place in case a future Next version starts using it.
//
// Idempotent, and it fails loudly rather than silently shipping a broken build.

import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");

if (!fs.existsSync(OUT)) {
  console.error("out/ does not exist. Run the export first.");
  process.exit(1);
}

let copied = 0;

/** Walk the export looking for `__next.<route>` directories to flatten. */
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;

    if (entry.name.startsWith("__next.")) {
      for (const payload of fs.readdirSync(full)) {
        const flat = path.join(dir, `${entry.name}.${payload}`);
        fs.copyFileSync(path.join(full, payload), flat);
        copied += 1;
      }
      continue;
    }
    walk(full);
  }
}

walk(OUT);

// GitHub Pages runs Jekyll unless told not to, and Jekyll drops every path that
// starts with an underscore. That is the whole `_next` folder.
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

if (copied === 0) {
  console.error("no payloads flattened. The export layout changed: check this script.");
  process.exit(1);
}

console.log(`flattened ${copied} route payloads, wrote .nojekyll`);
