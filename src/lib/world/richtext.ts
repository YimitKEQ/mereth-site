/**
 * The rich text a lore document is written in, and the gate it passes through.
 *
 * A COPY of the console's `src/lib/lore/richtext.ts`, and deliberately so. The
 * two repositories do not share a package, and this file is the security
 * boundary on both sides: the console cleans on the way in, and this site
 * cleans again on the way out, because a consumer of a public endpoint should
 * never assume the producer was careful. If one of the two is edited, edit the
 * other.
 *
 * The editor is TipTap, so what arrives is ProseMirror document JSON. That JSON
 * comes from a browser, which means it is hostile input: it reaches the public
 * website, and the website renders it. So nothing here trusts the shape.
 *
 * **The allow-list is the whole security design, and it is written as a
 * construction rather than a deletion.** Every node and every mark is rebuilt
 * from scratch out of fields this file names. A node type nobody listed is not
 * stripped of its dangerous parts, it simply never gets built. That is the
 * difference between a filter somebody can find a gap in and a shape that can
 * only contain what it was told to contain.
 *
 * Concretely refused, and each of these is a real attack or a real mess:
 *
 * - any node type outside `NODES` (script, iframe, embed, table, anything a
 *   paste from a web page drags in)
 * - any mark outside `MARKS`, so no inline styles, colours or font sizes
 * - a link whose href is not http, https, a site-relative path, or mailto,
 *   which is what stops `javascript:` and `data:` ending up on merethroleplay.com
 * - an image whose src is not one this console served
 * - a document deeper than `MAX_DEPTH` or longer than `MAX_NODES`, because a
 *   deeply nested paste can take a renderer down without being malicious
 */

/** Marks a writer can apply to a run of text. Deliberately three. */
const MARKS = new Set(["bold", "italic", "link"]);

/** Block and inline node types the site knows how to draw. */
const NODES = new Set([
  "doc",
  "paragraph",
  "text",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "horizontalRule",
  "hardBreak",
  "image",
]);

/** A document title is the page's h1, so the body starts at h2. */
const HEADING_LEVELS = new Set([2, 3]);

const MAX_DEPTH = 8;
const MAX_NODES = 4000;
const MAX_TEXT = 20_000;

export interface RichNode {
  type: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  content?: RichNode[];
  text?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" || trimmed.length > max ? null : trimmed;
}

/**
 * Is this href safe to put on a public page?
 *
 * Allowed: a site-relative path, http, https, mailto. Everything else is
 * dropped, which is what keeps `javascript:` and `data:` out. Parsed rather
 * than pattern-matched, because `java\nscript:` defeats a pattern and does not
 * defeat a parser.
 */
export function safeHref(value: unknown): string | null {
  const href = str(value, 2000);
  if (href === null) return null;
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  try {
    const url = new URL(href);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

/**
 * Is this an image we serve ourselves?
 *
 * Two shapes, and both are ours. A document arrives from the office pointing at
 * the console's image route; the build then copies the bytes into this
 * repository and rewrites the reference to `/lore/<hash>.<ext>`. Both are
 * content-addressed paths on a host we control.
 *
 * Accepting only the first is a bug this file had for exactly one render: the
 * build rewrote the reference and then this function, running on the site,
 * dropped the picture it had just fetched. Anything pointing at another host is
 * still refused, because that would leak every reader's address to whoever owns
 * it and would break the moment that host went away.
 */
const CONSOLE_IMAGE = /^\/api\/public\/lore-images\/[0-9a-f]{64}\.(png|jpe?g|webp)$/;
const LOCAL_IMAGE = /^\/lore\/[0-9a-f]{64}\.(png|jpe?g|webp)$/;

export function safeImageSrc(value: unknown): string | null {
  const src = str(value, 300);
  if (src === null) return null;
  return CONSOLE_IMAGE.test(src) || LOCAL_IMAGE.test(src) ? src : null;
}

function cleanMarks(value: unknown): RichNode["marks"] {
  if (!Array.isArray(value)) return undefined;
  const marks: NonNullable<RichNode["marks"]> = [];
  for (const raw of value.slice(0, 8)) {
    if (!isRecord(raw) || typeof raw.type !== "string" || !MARKS.has(raw.type)) continue;
    if (raw.type === "link") {
      const href = safeHref(isRecord(raw.attrs) ? raw.attrs.href : null);
      if (href === null) continue;
      /* Every outbound link opens in a new tab with a referrer policy the
         reader did not have to think about. Set here, not in the editor, so a
         hand-edited payload cannot opt out of it. */
      marks.push({
        type: "link",
        attrs: { href, target: href.startsWith("/") ? null : "_blank", rel: "noopener noreferrer" },
      });
      continue;
    }
    marks.push({ type: raw.type });
  }
  return marks.length > 0 ? marks : undefined;
}

/**
 * Rebuild one node, or return null to drop it.
 *
 * `budget` is shared by reference across the whole walk so a wide document is
 * capped as hard as a deep one.
 */
function cleanNode(raw: unknown, depth: number, budget: { left: number }): RichNode | null {
  if (depth > MAX_DEPTH || budget.left <= 0 || !isRecord(raw)) return null;
  if (typeof raw.type !== "string" || !NODES.has(raw.type)) return null;
  budget.left -= 1;

  if (raw.type === "text") {
    const text = typeof raw.text === "string" ? raw.text.slice(0, MAX_TEXT) : "";
    if (text === "") return null;
    const marks = cleanMarks(raw.marks);
    return { type: "text", text, ...(marks !== undefined ? { marks } : {}) };
  }

  if (raw.type === "image") {
    const src = safeImageSrc(isRecord(raw.attrs) ? raw.attrs.src : null);
    if (src === null) return null;
    const alt = isRecord(raw.attrs) ? str(raw.attrs.alt, 300) : null;
    const title = isRecord(raw.attrs) ? str(raw.attrs.title, 300) : null;
    return {
      type: "image",
      attrs: { src, alt: alt ?? "", ...(title !== null ? { title } : {}) },
    };
  }

  const content: RichNode[] = [];
  if (Array.isArray(raw.content)) {
    for (const child of raw.content) {
      const cleaned = cleanNode(child, depth + 1, budget);
      if (cleaned !== null) content.push(cleaned);
    }
  }

  if (raw.type === "heading") {
    const level = isRecord(raw.attrs) && typeof raw.attrs.level === "number" ? raw.attrs.level : 2;
    if (content.length === 0) return null;
    return { type: "heading", attrs: { level: HEADING_LEVELS.has(level) ? level : 2 }, content };
  }

  if (raw.type === "horizontalRule" || raw.type === "hardBreak") return { type: raw.type };

  /* An empty paragraph is how a writer makes space, and the renderer collapses
     it, so it is kept. Every other container with nothing in it is noise. */
  if (content.length === 0 && raw.type !== "paragraph") return null;
  return { type: raw.type, ...(content.length > 0 ? { content } : {}) };
}

/**
 * Clean a whole document. Returns null when nothing survives.
 */
export function cleanRichText(raw: unknown): RichNode | null {
  const budget = { left: MAX_NODES };
  const doc = cleanNode(raw, 0, budget);
  if (doc === null || doc.type !== "doc") return null;
  const content = doc.content ?? [];
  if (content.length === 0) return null;
  return { type: "doc", content };
}

/**
 * The document as plain paragraphs.
 *
 * Kept alongside the rich version rather than replacing it, and that is not
 * duplication for its own sake: the eleven documents already generated into the
 * site have no rich version, the search index wants text and not a tree, and a
 * reader whose browser fails to render the rich body still gets the words. One
 * of the two is derived from the other on every save, so they cannot drift.
 */
export function richTextToParagraphs(doc: RichNode | null): string[] {
  if (doc === null) return [];
  const out: string[] = [];

  const textOf = (node: RichNode): string => {
    if (node.type === "text") return node.text ?? "";
    if (node.type === "hardBreak") return " ";
    return (node.content ?? []).map(textOf).join("");
  };

  const walk = (node: RichNode): void => {
    if (node.type === "image") {
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      if (alt !== "") out.push(alt);
      return;
    }
    /* Only the nodes that hold text emit it. A blockquote and a list item are
       containers whose children are paragraphs, so emitting their text as well
       as recursing into them printed every quoted line twice. */
    if (node.type === "paragraph" || node.type === "heading") {
      const text = textOf(node).trim();
      if (text !== "") out.push(text);
      return;
    }
    for (const child of node.content ?? []) walk(child);
  };

  for (const child of doc.content ?? []) walk(child);
  return out;
}

/** Words in the document, for the editor's counter. */
export function wordCount(doc: RichNode | null): number {
  return richTextToParagraphs(doc)
    .join(" ")
    .split(/\s+/)
    .filter((word) => word !== "").length;
}
