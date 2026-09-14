// Bake the calendar from the lore office into the bundle.
//
//   node scripts/sync-chronicle.mjs            refresh src/data/chronicle.json
//   node scripts/sync-chronicle.mjs --check    report the gap, write nothing
//
// Runs as part of `prebuild`, so every build ships the register as the office
// had it at build time. The browser then corrects that against the office live
// (`src/lib/live-chronicle.ts`), which is what makes an event published on a
// Saturday appear without a deploy.
//
// Both halves are needed and they are not redundant:
//
//   baked   the page is complete in the HTML file. A crawler indexes the
//           events, a reader with no JavaScript sees them, and the first paint
//           has them before any request goes out.
//   live    the register moves faster than the site is rebuilt. Without the
//           fetch, an event added on Friday would wait for somebody to deploy.
//
// ## Failing soft is the correct behaviour, not a compromise
//
// The office is a service on Mereth's own box and it is not reachable yet:
// three things in the console's `docs/DEPLOY.md` need somebody on their team.
// Until then this can never succeed, and a build must not break because of
// that. It also must not quietly empty the page: an unreachable office and an
// office with nothing in it are different states, and only the second one
// should ever remove a row.
//
// So the rules are:
//
//   no answer            keep the file exactly as it is, say so, exit 0.
//   an answer with rows  replace that section.
//   an answer with none  keep the seeded section. The seed is content Mereth
//                        published elsewhere; an office that has not been
//                        filled in yet must not delete it.
//
// That last rule has a consequence worth stating: once the office IS the source
// of the annals, clearing it will not clear the page. Deleting a seeded annal
// is an edit to `src/data/chronicle.json`. That is the right trade while the
// seed is the only content, and the day the office holds everything, this rule
// is the one to revisit.

import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("src", "data", "chronicle.json");
const URL_ENV = process.env.NEXT_PUBLIC_CHRONICLE_URL;
const DEFAULT_URL = "https://staff.merethroleplay.com/api/public/chronicle";
const CHRONICLE_URL = URL_ENV !== undefined && URL_ENV !== "" ? URL_ENV : DEFAULT_URL;
const TIMEOUT_MS = 8_000;

const checkOnly = process.argv.includes("--check");

/** The file as it stands. A missing one is a real error: the page imports it. */
function readCurrent() {
  if (!fs.existsSync(OUT)) {
    console.error(`sync-chronicle: ${OUT} is missing. It is imported by the calendar page.`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(OUT, "utf8"));
  } catch (error) {
    console.error(`sync-chronicle: ${OUT} is not valid JSON, refusing to overwrite it.`);
    console.error(String(error));
    process.exit(1);
  }
}

async function fetchOffice() {
  try {
    const response = await fetch(CHRONICLE_URL, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      console.log(`sync-chronicle: office answered ${response.status}, keeping the baked register`);
      return null;
    }
    const payload = await response.json();
    if (typeof payload !== "object" || payload === null) {
      console.log("sync-chronicle: office answered with something that is not a register, keeping the baked one");
      return null;
    }
    return payload;
  } catch (error) {
    // Unreachable is the expected state today, so this is a log line and not a
    // warning. It says which URL, because the first question when it does not
    // work is always "which one was it asking".
    console.log(`sync-chronicle: no answer from ${CHRONICLE_URL} (${error instanceof Error ? error.name : "failed"}), keeping the baked register`);
    return null;
  }
}

const current = readCurrent();
const office = await fetchOffice();

if (office === null) {
  console.log(
    `sync-chronicle: unchanged, ${current.annals?.length ?? 0} annals and ${current.events?.length ?? 0} events`,
  );
  process.exit(0);
}

const next = {
  syncedAt: typeof office.syncedAt === "string" ? office.syncedAt : new Date().toISOString(),
  source: typeof office.source === "string" ? office.source : "mereth-lore-office",
  annals: Array.isArray(office.annals) && office.annals.length > 0 ? office.annals : current.annals ?? [],
  events: Array.isArray(office.events) ? office.events : current.events ?? [],
  lore: Array.isArray(office.lore) ? office.lore : current.lore ?? [],
};

/*
 * Events are the one section that is replaced even when empty, and it is the
 * opposite rule to the annals on purpose. An empty events register means
 * "nothing is scheduled", which is a true and useful thing to publish. An empty
 * annals register means "the office has not been filled in", which is not a
 * reason to delete history.
 */

const before = JSON.stringify(current);
const after = JSON.stringify(next, null, 2) + "\n";

if (checkOnly) {
  console.log(
    before === JSON.stringify(next)
      ? "sync-chronicle: bundle is current"
      : `sync-chronicle: bundle would change to ${next.annals.length} annals and ${next.events.length} events`,
  );
  process.exit(0);
}

fs.writeFileSync(OUT, after);
console.log(
  `sync-chronicle: wrote ${next.annals.length} annals and ${next.events.length} events from ${CHRONICLE_URL}`,
);
