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

const SERVERS_URL = "https://merethroleplay.com/servers.json";
const INVITE_URL = "https://discord.com/api/v10/invites/mereth?with_counts=true";

/** Mereth's own key in the feed, which also lists other servers. */
const SERVER_KEY = "bstarrp";

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

async function readServers(signal: AbortSignal): Promise<Pick<Status, "state" | "online" | "maxPlayers">> {
  try {
    const response = await fetch(SERVERS_URL, { signal, cache: "no-store" });
    if (!response.ok) throw new Error(`servers.json responded ${response.status}`);

    const rows: unknown = await response.json();
    if (!Array.isArray(rows)) throw new Error("servers.json was not a list");

    const row = (rows as ServerRow[]).find((r) => r.key === SERVER_KEY) ?? (rows as ServerRow[])[0];
    if (row === undefined) throw new Error("servers.json was empty");

    const status = (row.status ?? "").toLowerCase();
    return {
      state: status === "online" || status === "up" ? "online" : "offline",
      online: Math.max(0, Number(row.online) || 0),
      maxPlayers: Math.max(0, Number(row.maxPlayers) || 0),
    };
  } catch {
    // Fail quiet. The block renders without a count rather than with an error.
    return { state: "unknown", online: null, maxPlayers: null };
  }
}

async function readDiscord(
  signal: AbortSignal,
): Promise<Pick<Status, "discordMembers" | "discordOnline">> {
  try {
    const response = await fetch(INVITE_URL, { signal, cache: "no-store" });
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
