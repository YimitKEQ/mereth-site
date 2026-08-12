/**
 * The block vocabulary the handbook pages are written in.
 *
 * Long-form pages here are data, not JSX. Two reasons: the prose stays readable
 * in source instead of drowning in tags, and every page gets the same table of
 * contents, anchor and search behaviour for free because they all share one
 * renderer (`@/components/handbook/Blocks`).
 *
 * `cite` and `quote` are the honesty mechanism. A claim about how the server
 * behaves either quotes a message the client prints or cites a dated release
 * note, and the renderer shows which. Nothing on these pages is asserted
 * without a source the reader can check.
 */

export type Block =
  /** Paragraphs in the inline markup grammar from `@/lib/markup`. */
  | { kind: "prose"; paragraphs: string[] }
  /** A pulled-out point. `key` for the thing to remember, `warn` for the trap. */
  | { kind: "note"; tone: "key" | "warn"; title?: string; body: string }
  /** A message the client itself prints, verbatim. */
  | { kind: "quote"; text: string }
  | { kind: "list"; items: string[]; style?: "bullet" | "bare" }
  | { kind: "table"; head: string[]; rows: string[][] }
  /** Release notes matching a pattern, rendered as dated citations. */
  | { kind: "cite"; pattern: RegExp; limit?: number }
  /** A rendered dataset that would be unreadable as a literal table. */
  | { kind: "data"; name: DataBlock };

export type DataBlock =
  | "binds"
  | "tiers"
  | "needs"
  | "access"
  | "races"
  | "months"
  | "troubles"
  | "slash"
  | "menus";

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

export interface HandbookPage {
  title: string;
  lede: string;
  sections: Section[];
}
