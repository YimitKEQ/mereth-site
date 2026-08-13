/**
 * Live server status, read straight from the two public feeds.
 *
 *   servers.json     whether the server is up, and the player count.
 *   Discord invite   member and online counts, from the public invite endpoint.
 *
 * This used to be a route handler that fetched both on our side and re-served
 * them, on the assumption that neither upstream allowed a cross-origin read.
 * That assumption was wrong: `merethroleplay.com` answers with
 * `Access-Control-Allow-Origin: *` and Discord echoes the requesting origin, so
 * the browser can read both itself.
 *
 * Reading them in the browser is what lets the site be a pile of static files
 * and still show a live figure. A route handler on static hosting can only bake
 * a snapshot at build time, and a page confidently reporting "open" because that
 * was true when it was built is worse than one that says it could not check.
 *
 * Deliberately narrow. `servers.json` also carries the server's IP and port. We
 * read four numbers and a state out of it and keep nothing else, so the address
 * never reaches a rendered surface.
 */

/*
 * Two feeds for the same fact, tried in order, and the order is the whole point.
 *
 * `/api/servers` is a Cloudflare Pages Function on our own origin that proxies
 * `api.bstarrp.com` and is therefore the live figure the launcher and the game
 * see. It is first because it is the only one that is actually true.
 *
 * `servers.json` is a static file committed beside the site. It is a fallback for
 * one field only, whether we are up, and its counts are deliberately ignored: the
 * committed copy reads `"online": 0, "maxPlayers": 666` and has since it was
 * written, so trusting it would put a confident and permanent "0 souls abroad" on
 * the front page of a server with a hundred people on it. A stale state is a
 * small lie; a stale count is a number a reader will believe.
 */
const PROXY_URL = "https://merethroleplay.com/api/servers";
const SERVERS_URL = "https://merethroleplay.com/servers.json";
const INVITE_URL = "https://discord.com/api/v10/invites/mereth?with_counts=true";

/** Mereth's own key in the feed, which also lists other servers. */
const SERVER_KEY = "bstarrp";

/*
 * A deadline on every request.
 *
 * A hung connection, one where the socket is accepted and no bytes ever
 * arrive, does not reject. Without this the poller simply starts another
 * request on the next tick and keeps doing that, so a stalled upstream turns
 * into a growing pile of open sockets in the reader's browser.
 */
const TIMEOUT_MS = 8_000;

const deadline = (signal: AbortSignal): AbortSignal =>
  AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]);

export interface Status {
  /** "online", "offline", or "unknown" when the feed could not be read. */
  state: "online" | "offline" | "unknown";
  online: number | null;
  maxPlayers: number | null;
  discordMembers: number | null;
  discordOnline: number | null;
}

interface ServerRow {
  key?: string;
  status?: string;
  online?: number;
  maxPlayers?: number;
}

type ServerFacts = Pick<Status, "state" | "online" | "maxPlayers">;

const UNKNOWN: ServerFacts = { state: "unknown", online: null, maxPlayers: null };

/** Mereth's own row, or null. Never the first row: rename the key upstream and
 *  this page would publish somebody else's uptime as ours. */
async function readFeed(url: string, signal: AbortSignal): Promise<ServerRow | null> {
  const response = await fetch(url, { signal: deadline(signal), cache: "no-store" });
  if (!response.ok) throw new Error(`${url} responded ${response.status}`);
  const rows: unknown = await response.json();
  if (!Array.isArray(rows)) throw new Error(`${url} was not a list`);
  return (rows as ServerRow[]).find((r) => r.key === SERVER_KEY) ?? null;
}

/**
 * Three states, and the third one matters. An unrecognised value is "we could not
 * tell", never "offline": a renamed field or a changed shape upstream would
 * otherwise put "Offline for maintenance" on the front page of a server that is
 * running perfectly well.
 */
function stateOf(row: ServerRow): Status["state"] {
  const status = (row.status ?? "").toLowerCase();
  if (status === "online" || status === "up") return "online";
  if (status === "offline" || status === "down") return "offline";
  return "unknown";
}

async function readServers(signal: AbortSignal): Promise<ServerFacts> {
  // The live proxy, which carries a real count.
  try {
    const row = await readFeed(PROXY_URL, signal);
    if (row !== null) {
      const state = stateOf(row);
      if (state !== "unknown") {
        return {
          state,
          online: Math.max(0, Number(row.online) || 0),
          maxPlayers: Math.max(0, Number(row.maxPlayers) || 0),
        };
      }
    }
  } catch {
    // Falls through to the static file below.
  }

  // The static file, for the state only. Its counts are not read on purpose.
  try {
    const row = await readFeed(SERVERS_URL, signal);
    if (row === null) return UNKNOWN;
    return { state: stateOf(row), online: null, maxPlayers: null };
  } catch {
    // Fail quiet. The block renders without a count rather than with an error.
    return UNKNOWN;
  }
}

async function readDiscord(
  signal: AbortSignal,
): Promise<Pick<Status, "discordMembers" | "discordOnline">> {
  try {
    const response = await fetch(INVITE_URL, { signal: deadline(signal), cache: "no-store" });
    if (!response.ok) throw new Error(`invite endpoint responded ${response.status}`);

    const invite = (await response.json()) as {
      approximate_member_count?: number;
      approximate_presence_count?: number;
    };
    return {
      discordMembers: invite.approximate_member_count ?? null,
      discordOnline: invite.approximate_presence_count ?? null,
    };
  } catch {
    return { discordMembers: null, discordOnline: null };
  }
}

/** Never rejects. An unreadable feed comes back as nulls, not as an error. */
export async function fetchStatus(signal: AbortSignal): Promise<Status> {
  const [servers, discord] = await Promise.all([readServers(signal), readDiscord(signal)]);
  return { ...servers, ...discord };
}
