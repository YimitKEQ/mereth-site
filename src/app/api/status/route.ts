/**
 * Live server status, fetched on our side rather than the reader's.
 *
 * Two upstreams, neither of which sends CORS headers, so a browser cannot read
 * either of them directly. Fetching here and re-serving is the whole reason
 * this route exists.
 *
 *   servers.json     the live player count and whether the server is up.
 *   Discord invite   member and online counts, from the public invite endpoint.
 *
 * Deliberately narrow: the upstream feed also carries the server's IP and port,
 * and there is no reason for a marketing page to publish those, so they are
 * dropped here rather than filtered in the component.
 *
 * Revalidated every 60 seconds. A player count that is a minute stale is fine;
 * hammering somebody else's endpoint on every page view is not.
 */

export const revalidate = 60;

const SERVERS_URL = "https://merethroleplay.com/servers.json";
const INVITE_URL = "https://discord.com/api/v10/invites/mereth?with_counts=true";

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
  name?: string;
  status?: string;
  online?: number;
  maxPlayers?: number;
}

async function readServers(): Promise<Pick<Status, "state" | "online" | "maxPlayers">> {
  try {
    const response = await fetch(SERVERS_URL, { next: { revalidate } });
    if (!response.ok) throw new Error(`servers.json responded ${response.status}`);

    const rows = (await response.json()) as unknown;
    if (!Array.isArray(rows)) throw new Error("servers.json was not a list");

    const row = (rows as ServerRow[]).find((r) => r.key === "bstarrp") ?? (rows as ServerRow[])[0];
    if (row === undefined) throw new Error("servers.json was empty");

    const status = (row.status ?? "").toLowerCase();
    return {
      state: status === "online" || status === "up" ? "online" : "offline",
      online: Math.max(0, Number(row.online) || 0),
      maxPlayers: Math.max(0, Number(row.maxPlayers) || 0),
    };
  } catch {
    // Fail quiet. The page renders without a count rather than with an error.
    return { state: "unknown", online: null, maxPlayers: null };
  }
}

async function readDiscord(): Promise<Pick<Status, "discordMembers" | "discordOnline">> {
  try {
    const response = await fetch(INVITE_URL, { next: { revalidate } });
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

export async function GET(): Promise<Response> {
  const [servers, discord] = await Promise.all([readServers(), readDiscord()]);
  const status: Status = { ...servers, ...discord };

  return Response.json(status, {
    headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
