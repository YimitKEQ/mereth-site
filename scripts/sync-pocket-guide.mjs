// Bake the Lore Team's #tamriel-pocket-guide forum into the /peoples page.
//
//   node scripts/sync-pocket-guide.mjs            refresh src/data/pocket-guide.json
//   node scripts/sync-pocket-guide.mjs --check    report what the forum holds, write nothing
//
// Runs as part of `prebuild`. It reads the forum with the staff console's bot,
// whose token lives in ../StaffDashboard/.env (or DISCORD_BOT_TOKEN and
// DISCORD_GUILD_ID in the environment). The token is used at build time only
// and never reaches the bundle.
//
// Fails soft, the same rules as sync-chronicle.mjs: no token, no access, or a
// Discord error keeps the file exactly as it is and exits 0. A people the forum
// has not written up keeps its seeded section; nothing here ever removes a row.
//
// On 2026-10-06 the bot could list the forum's threads but got 403 Missing
// Access on their messages: it needs View Channel and Read Message History on
// #tamriel-pocket-guide. Until a Mereth admin grants that, this reports the
// 403 and the page serves the seed.

import fs from "node:fs";
import path from "node:path";

import { mergePeoples, parseThread } from "./pocket-guide-parse.mjs";

const OUT = path.resolve("src", "data", "pocket-guide.json");
const STAFF_ENV = path.resolve("..", "StaffDashboard", ".env");
const FORUM_ID = process.env.MERETH_POCKET_GUIDE_CHANNEL || "1556734228975058944";
const API = "https://discord.com/api/v10";
const TIMEOUT_MS = 8_000;

const checkOnly = process.argv.includes("--check");

if (!process.env.DISCORD_BOT_TOKEN && fs.existsSync(STAFF_ENV)) {
  try {
    process.loadEnvFile(STAFF_ENV);
  } catch (error) {
    console.log(`sync-pocket-guide: could not read ${STAFF_ENV}: ${String(error)}`);
  }
}
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD = process.env.DISCORD_GUILD_ID;

function keep(reason) {
  console.log(`sync-pocket-guide: ${reason}, keeping the baked guide`);
  process.exit(0);
}

async function discord(route) {
  const response = await fetch(API + route, {
    headers: { Authorization: `Bot ${TOKEN}` },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(`${route} answered ${response.status} ${body.message ?? ""}`.trim());
  }
  return response.json();
}

/** Active threads come from the guild, archived ones from the forum itself. */
async function threads() {
  const active = await discord(`/guilds/${GUILD}/threads/active`);
  const mine = (active.threads ?? []).filter((t) => t.parent_id === FORUM_ID);
  try {
    const archived = await discord(`/channels/${FORUM_ID}/threads/archived/public?limit=100`);
    mine.push(...(archived.threads ?? []));
  } catch (error) {
    console.log(`sync-pocket-guide: archived posts unreadable (${error.message}), using active ones`);
  }
  return mine;
}

/** The post author's own messages, oldest first. Replies from others are not the guide. */
async function authorText(thread) {
  const messages = await discord(`/channels/${thread.id}/messages?limit=100`);
  return messages
    .filter((m) => m.author?.id === thread.owner_id && typeof m.content === "string")
    .reverse()
    .map((m) => m.content);
}

function readCurrent() {
  try {
    return JSON.parse(fs.readFileSync(OUT, "utf8"));
  } catch (error) {
    console.error(`sync-pocket-guide: ${OUT} is missing or not JSON, refusing to touch it.`);
    console.error(String(error));
    process.exit(1);
  }
}

if (!TOKEN || !GUILD) keep("no bot token or guild id");

const current = readCurrent();
let fromForum = [];
try {
  for (const thread of await threads()) {
    const parsed = parseThread(thread.name, await authorText(thread));
    console.log(`sync-pocket-guide: "${thread.name}" gave ${parsed.map((p) => `${p.name} (${p.points.length})`).join(", ") || "nothing"}`);
    fromForum.push(...parsed);
  }
} catch (error) {
  keep(`forum unreadable (${error.message})`);
}

if (fromForum.length === 0) keep("the forum gave no peoples");
if (checkOnly) process.exit(0);

const next = {
  source: { forum: "tamriel-pocket-guide", fetchedAt: new Date().toISOString() },
  peoples: mergePeoples(current.peoples, fromForum),
};
fs.writeFileSync(OUT, JSON.stringify(next, null, 2) + "\n");
console.log(`sync-pocket-guide: wrote ${next.peoples.length} peoples`);
