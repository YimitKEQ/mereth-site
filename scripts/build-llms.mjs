// Write public/llms.txt from the route registry.
//
//   node scripts/build-llms.mjs
//
// A build step rather than a hand-written file, for the same reason the sitemap
// is generated: a route list maintained in two places is a route list that is
// wrong in one of them. `src/lib/seo.ts` is the source; this only reformats it.
//
// llms.txt is a proposed convention (llmstxt.org) that answer engines read to
// find out what a site covers without crawling all of it. This site is a
// handbook, so it is exactly the kind of site the convention is for: the whole
// value is that somebody can be told the right page rather than made to guess.
//
// Parsed rather than imported because this is a TypeScript module and the build
// script is plain node. The shape read here is narrow and the parse fails loudly
// if the registry stops matching it, rather than silently writing a short file.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://merethroleplay.com";

/** Pull the `{ path, priority, changeFrequency, summary }` entries out of the registry. */
function readRoutes() {
  const source = fs.readFileSync(path.join(root, "src", "lib", "seo.ts"), "utf8");
  const block = source.match(/export const ROUTES: readonly RouteEntry\[\] = \[(.*?)\n\];/s);
  if (block === null) throw new Error("ROUTES not found in src/lib/seo.ts");

  const entries = [...block[1].matchAll(
    /\{\s*path:\s*"([^"]+)",\s*priority:\s*[\d.]+,\s*changeFrequency:\s*"[a-z]+",\s*summary:\s*"((?:[^"\\]|\\.)*)"\s*\}/g,
  )].map((m) => ({ path: m[1], summary: m[2].replace(/\\"/g, '"') }));

  if (entries.length === 0) throw new Error("ROUTES matched no entries; the shape changed");
  return entries;
}

/** The lore documents, from the generated lore module. */
function readLore() {
  const source = fs.readFileSync(path.join(root, "src", "lib", "world", "lore.ts"), "utf8");
  return [...source.matchAll(/"slug":\s*"([^"]+)",\s*\n\s*"title":\s*"([^"]+)",\s*\n\s*"note":\s*"((?:[^"\\]|\\.)*)"/g)].map(
    (m) => ({ slug: m[1], title: m[2], note: m[3] }),
  );
}

const routes = readRoutes();
const lore = readLore();

const url = (p) => (p === "/" ? `${ORIGIN}/` : `${ORIGIN}${p}/`);
const line = (title, p, summary) => `- [${title}](${url(p)}): ${summary}`;

/** A readable title for a path, so the file does not read as a list of slugs. */
const TITLES = {
  "/": "Mereth Roleplay",
  "/start": "Start Here",
  "/guide": "The Guide",
  "/rules": "Rules",
  "/faq": "Questions",
  "/language": "Roleplay language",
  "/teaching": "Teaching magic",
  "/qa": "Latest Q&A",
  "/skills": "Skills and memory points",
  "/progression": "Progression",
  "/magic": "Magic",
  "/survival": "Food, drink and energy",
  "/crafting": "Crafting",
  "/tips": "Tips",
  "/world": "The World",
  "/holds": "The Nine Holds",
  "/factions": "Factions",
  "/lore": "Lore",
  "/changelog": "Changelog",
  "/roadmap": "Roadmap",
  "/records": "Modlist",
  "/gallery": "Gallery",
  "/credits": "Credits",
  "/community": "The Hall",
  "/discord": "Discord",
  "/support": "Getting help",
  "/donate": "Supporting Mereth",
  "/terms": "Terms",
  "/privacy": "Privacy",
  "/refunds": "Refunds",
};

const pick = (paths) =>
  paths
    .map((p) => routes.find((r) => r.path === p))
    .filter((r) => r !== undefined)
    .map((r) => line(TITLES[r.path] ?? r.path, r.path, r.summary));

const out = `# Mereth Roleplay

> A serious roleplay Skyrim server on SkyMP, set in 4E 185, ten years after the
> White-Gold Concordat. Imperial rule is formally intact and Thalmor presence is
> growing. Play is player-driven: an economy, professions, holds with seated
> jarls, and magic that has to be taught to you by another player.

This site is the server's handbook. It is written to be looked things up in, so
each page below answers a different kind of question. Membership runs through
Discord, which is also the login.

## Start here

${pick(["/", "/start", "/guide", "/rules", "/language"]).join("\n")}

## How the systems work

${pick(["/skills", "/progression", "/magic", "/teaching", "/survival", "/crafting", "/tips"]).join("\n")}

## The setting

${pick(["/world", "/holds", "/factions", "/lore"]).join("\n")}

## Answers

${pick(["/faq", "/qa"]).join("\n")}

## Reference

${pick(["/changelog", "/roadmap", "/records", "/gallery", "/credits"]).join("\n")}

## Community

${pick(["/community", "/discord", "/support", "/donate"]).join("\n")}

## The lore library

${lore.map((d) => line(d.title, `/lore/${d.slug}`, d.note)).join("\n")}

## Optional

${pick(["/terms", "/privacy", "/refunds"]).join("\n")}
`;

const target = path.join(root, "public", "llms.txt");
fs.writeFileSync(target, out);
console.log(
  `wrote public/llms.txt: ${routes.length} pages, ${lore.length} lore documents, ${out.length} bytes`,
);

// Only when run directly. `pathToFileURL` because a bare comparison against
// `import.meta.url` fails on Windows: `file://D:/` is not `file:///D:/`.
export {};
void pathToFileURL;
