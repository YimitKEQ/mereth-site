import { mereth } from "@/lib/mereth";
import chronicle from "@/data/chronicle.json";

/**
 * The calendar: what is coming, and what is already written down.
 *
 * Two registers that look alike and are not, so they are separate types rather
 * than one with a `kind` field:
 *
 *   events   things that will happen, at a real time, that a player can turn up
 *            to. A moot, a festival, a trial, a market day. They have a UTC
 *            instant because people join this server from several continents.
 *   annals   things that have happened in the province, at an in-world date.
 *            They have no real time at all and never will.
 *
 * **Neither is written here.** Both come from `src/data/chronicle.json`, which
 * `scripts/sync-chronicle.mjs` rewrites from the lore office in the staff
 * console. The seeded content in that file is only what Mereth has already
 * published somewhere else, and every annal names where. Nothing on this page is
 * ours to invent: an official surface that makes up a date is worse than an
 * official surface with a short calendar on it.
 *
 * On dates and the drift they cause. An annal carries an in-world date and a
 * `source`; an event carries a UTC instant and is rendered in the reader's own
 * zone. Where an annal is the same fact as a story told elsewhere on the site,
 * it links there instead of retelling it, so the hold pages stay the place a
 * jarl's story lives and this page stays the place its date lives.
 */

/**
 * A date in the Tamriel calendar.
 *
 * Month is an index into the client's own `TAMRIEL_MONTHS`, which arrives in the
 * bundle as `mereth.months`, so the names here and the names in the game come
 * from one place. Everything below `year` is optional, because half of what the
 * lore says is "in 4E 175" with no month attached, and a register that demands a
 * day would get one invented for it.
 */
export interface InWorldDate {
  /** 4 for the Fourth Era. Present so a First Era date is sayable, not assumed. */
  era: number;
  year: number;
  /** 0 to 11. Omitted for a year-only date. */
  month?: number;
  /** 1 to 31. Omitted when only the month is known. */
  day?: number;
  /**
   * The source gives this date relatively, so the year is our arithmetic.
   *
   * "Some sixty years ago" is a real thing a lore document says, and turning it
   * into 4E 125 with no marker publishes a precision nobody wrote. Rendered
   * with a `c.` and the original wording kept in `asWritten`.
   */
  approximate?: boolean;
  /** The phrasing the source actually used, when it is not a plain date. */
  asWritten?: string;
}

/** Something that happened in the province, with the date it happened. */
export interface Annal {
  id: string;
  title: string;
  /** One or two sentences. The long version belongs wherever it is already told. */
  summary: string;
  when: InWorldDate;
  /** Hold, order, or "The province". Used to filter. */
  scope: string;
  /**
   * Where this date comes from. Required, and the reason this page can be
   * trusted: a reader can go and check it.
   */
  source: string;
  /** Where the story is actually told, when it is told somewhere on this site. */
  link?: { href: string; label: string };
}

/** Something that will happen, at a real time, that a player can attend. */
export interface ScheduledEvent {
  id: string;
  title: string;
  summary: string;
  /** UTC instant, ISO 8601. Rendered in the reader's own zone. */
  startsAt: string;
  /** UTC instant. Omitted for something with no announced end. */
  endsAt?: string;
  /** Where in the province it happens. */
  where: string;
  /** Who is running it, as they wish to be named. */
  host?: string;
  /** The in-world date, when the organisers have given one. */
  inWorld?: InWorldDate;
  /** Where to sign up, ask, or read more. */
  link?: { href: string; label: string };
  /** Said out loud when a thing repeats, because a calendar cannot show that. */
  repeats?: string;
}

/** A lore document written in the lore office rather than published as a file. */
export interface ChronicleLoreEntry {
  slug: string;
  title: string;
  note: string;
  paragraphs: string[];
  /** The rich body, as the lore office wrote it. Absent on older records. */
  doc?: unknown;
  /** The shelf it belongs on, matching a shelf id on the lore page. */
  shelf: string;
  /** Who wrote it, when the author wants a byline. */
  byline?: string;
  updatedAt: string;
}

export interface Chronicle {
  /** When the register was last pulled from the lore office, ISO 8601. */
  syncedAt: string | null;
  /** Null until the office is reachable, which is the honest state today. */
  source: string | null;
  annals: Annal[];
  events: ScheduledEvent[];
  lore: ChronicleLoreEntry[];
}

export const chronicleRegister = chronicle as unknown as Chronicle;

/** Ordinal for a day of the month: 1st, 2nd, 3rd, 4th. */
function ordinal(day: number): string {
  const tens = day % 100;
  if (tens >= 11 && tens <= 13) return `${day}th`;
  const unit = day % 10;
  return `${day}${unit === 1 ? "st" : unit === 2 ? "nd" : unit === 3 ? "rd" : "th"}`;
}

/**
 * An in-world date as the site's prose says it: "23rd of Last Seed, 4E 185".
 *
 * The game's own HUD writes it "Last Seed 23, 4E 185", which is right for a
 * corner of a screen and wrong for a sentence. The holds pages have always used
 * the long form, so this matches them rather than the HUD.
 */
export function formatInWorld(date: InWorldDate): string {
  const year = `${date.era}E ${date.year}`;
  const prefix = date.approximate === true ? "c. " : "";
  if (date.month === undefined) return `${prefix}${year}`;

  const month = mereth.months[date.month] ?? "";
  if (month === "") return `${prefix}${year}`;
  if (date.day === undefined) return `${prefix}${month}, ${year}`;
  return `${prefix}${ordinal(date.day)} of ${month}, ${year}`;
}

/**
 * Just the day and month: "23rd of Last Seed", or "Last Seed" when no day is given.
 *
 * The annals put the year in its own column, so repeating it under the month
 * would print it twice in one gutter. Empty when the date carries no month,
 * which is most of them.
 */
export function formatDayMonth(date: InWorldDate): string {
  if (date.month === undefined) return "";
  const month = mereth.months[date.month] ?? "";
  if (month === "") return "";
  return date.day === undefined ? month : `${ordinal(date.day)} of ${month}`;
}

/** Sortable key for an in-world date. Missing month and day sort to the start of the year. */
export function inWorldOrder(date: InWorldDate): number {
  return date.era * 1_000_000 + date.year * 1_000 + (date.month ?? 0) * 40 + (date.day ?? 0);
}
