import type { Annal, Chronicle, ScheduledEvent } from "@/lib/world/calendar";

/**
 * The calendar as the lore office has it now, read in the browser.
 *
 * The register on the page is baked into the bundle by
 * `scripts/sync-chronicle.mjs` at build time, which is what makes it instant,
 * indexable and correct with JavaScript off. The cost of baking is that it
 * freezes when the build finishes, and a calendar that freezes is a calendar
 * that tells somebody an event is next Tuesday three weeks after it happened.
 *
 * This is the same shape as `live-changelog.ts` and for the same reason: bake
 * for the crawler and the first paint, correct in the browser for the reader.
 * The difference is the deploy cadence. The site is rebuilt when somebody
 * deploys it, which is not nightly, so **for the calendar this is not a gap
 * closer, it is the delivery mechanism.** The lore team publishes an event and
 * it appears for readers within a cache TTL, with no deploy and nobody waiting
 * on Kees.
 *
 * ## Why the staff console and not a file in a repository
 *
 * The lore team are writers. Asking them to open a pull request is asking them
 * not to bother. The console already has Discord sign in, the real staff roles,
 * per action permissions and an audit trail, so the editor belongs there and
 * building a second authenticated surface would be building a second thing to
 * secure.
 *
 * What it publishes here is **only what has been marked published**, with no
 * ids, no staff names and no drafts. That is enforced at the console end, in
 * the route that serves this, rather than trusted here.
 *
 * ## Failure is the normal state, not an error
 *
 * The console runs on Mereth's own box behind a Cloudflare tunnel and is not
 * reachable yet: three things in `docs/DEPLOY.md` need somebody on the Mereth
 * team. Until then every call here fails and the page shows the baked register,
 * which is complete and correct. So this **never throws, never retries and
 * never reports an error to the reader.** A calendar that says "could not
 * reach the server" to a player has told them something about our
 * infrastructure and nothing about the province.
 */

const DEFAULT_URL = "https://staff.merethroleplay.com/api/public/chronicle";

/** Overridable, so moving the office does not need a code change. */
export const CHRONICLE_URL = process.env.NEXT_PUBLIC_CHRONICLE_URL ?? DEFAULT_URL;

const TIMEOUT_MS = 6_000;

/**
 * A ceiling on what one answer may contain.
 *
 * Not a performance guard. It is what stops a compromised or simply broken
 * endpoint from replacing the page with ten thousand rows, and it bounds the
 * work done on a phone before first paint.
 */
const MAX_ROWS = 400;

/** One request per page view, however many components ask. */
let inFlight: Promise<unknown> | null = null;

function payloadOnce(): Promise<unknown> {
  inFlight ??= fetch(CHRONICLE_URL, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { Accept: "application/json" },
  })
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);
  return inFlight;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

/**
 * Validate one event, and drop it rather than repair it.
 *
 * This is a network boundary, so nothing here trusts a field because it is
 * usually there. An event with no title or no valid start is not shown with a
 * placeholder: it is not shown, because a calendar row saying "Untitled" at an
 * unparseable time is worse than one row fewer.
 */
function readEvent(value: unknown): ScheduledEvent | null {
  if (!isRecord(value)) return null;
  const id = str(value.id);
  const title = str(value.title);
  const startsAt = str(value.startsAt);
  if (id === undefined || title === undefined || startsAt === undefined) return null;
  if (Number.isNaN(Date.parse(startsAt))) return null;

  const endsAt = str(value.endsAt);
  const link = isRecord(value.link) ? value.link : null;
  const href = link === null ? undefined : str(link.href);
  const label = link === null ? undefined : str(link.label);

  return {
    id,
    title,
    summary: str(value.summary) ?? "",
    startsAt,
    ...(endsAt !== undefined && !Number.isNaN(Date.parse(endsAt)) ? { endsAt } : {}),
    where: str(value.where) ?? "",
    ...(str(value.host) !== undefined ? { host: str(value.host) as string } : {}),
    ...(href !== undefined && label !== undefined ? { link: { href, label } } : {}),
    ...(str(value.repeats) !== undefined ? { repeats: str(value.repeats) as string } : {}),
  };
}

function readAnnal(value: unknown): Annal | null {
  if (!isRecord(value)) return null;
  const id = str(value.id);
  const title = str(value.title);
  const when = isRecord(value.when) ? value.when : null;
  if (id === undefined || title === undefined || when === null) return null;

  const year = typeof when.year === "number" ? when.year : null;
  if (year === null) return null;
  const era = typeof when.era === "number" ? when.era : 4;
  const month = typeof when.month === "number" && when.month >= 0 && when.month <= 11 ? when.month : undefined;
  const day = typeof when.day === "number" && when.day >= 1 && when.day <= 31 ? when.day : undefined;

  const link = isRecord(value.link) ? value.link : null;
  const href = link === null ? undefined : str(link.href);
  const label = link === null ? undefined : str(link.label);

  return {
    id,
    title,
    summary: str(value.summary) ?? "",
    when: {
      era,
      year,
      ...(month !== undefined ? { month } : {}),
      ...(day !== undefined ? { day } : {}),
      ...(when.approximate === true ? { approximate: true } : {}),
      ...(str(when.asWritten) !== undefined ? { asWritten: str(when.asWritten) as string } : {}),
    },
    scope: str(value.scope) ?? "The province",
    source: str(value.source) ?? "",
    ...(href !== undefined && label !== undefined ? { link: { href, label } } : {}),
  };
}

export interface LiveChronicle {
  annals: Annal[];
  events: ScheduledEvent[];
  syncedAt: string | null;
}

/**
 * The register the office is serving, or null if it cannot be reached.
 *
 * Null rather than an empty register, and the distinction is load bearing: an
 * empty answer would mean "the lore team has deleted everything" and would wipe
 * the baked page. Null means "no answer", and the caller keeps what it has.
 */
export async function fetchChronicle(signal: AbortSignal): Promise<LiveChronicle | null> {
  try {
    const payload = await payloadOnce();
    if (signal.aborted || !isRecord(payload)) return null;

    const annals = Array.isArray(payload.annals)
      ? payload.annals.slice(0, MAX_ROWS).map(readAnnal).filter((a): a is Annal => a !== null)
      : [];
    const events = Array.isArray(payload.events)
      ? payload.events.slice(0, MAX_ROWS).map(readEvent).filter((e): e is ScheduledEvent => e !== null)
      : [];

    // An answer carrying neither register is a wrong shape, not an empty one.
    if (!Array.isArray(payload.annals) && !Array.isArray(payload.events)) return null;

    return { annals, events, syncedAt: str(payload.syncedAt) ?? null };
  } catch {
    return null;
  }
}

/**
 * The baked register, corrected by a live one where the live one has an answer.
 *
 * Rules, in order:
 *
 *   an empty live register for a section leaves the baked section alone, so a
 *   half-built endpoint cannot blank the page;
 *   otherwise the live section replaces the baked one outright, because the
 *   office is the source of truth and a deletion there must reach readers.
 *
 * That second rule is why this is a replace rather than a merge. A merge cannot
 * express "this event was cancelled", and a calendar that cannot cancel an
 * event is worse than no calendar.
 */
export function mergeChronicle(baked: Chronicle, live: LiveChronicle | null): Chronicle {
  if (live === null) return baked;
  return {
    ...baked,
    annals: live.annals.length > 0 ? live.annals : baked.annals,
    events: live.events.length > 0 ? live.events : baked.events,
    syncedAt: live.syncedAt ?? baked.syncedAt,
  };
}
