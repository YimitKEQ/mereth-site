// Turn Mereth's published lore documents into a data module for the site.
//
//   node scripts/build-lore.mjs <path-to-official-website-repo>
//
// The source is the lore folder of Mereth's own website repository, which is
// where these documents are actually published. Reading them from there rather
// than retyping them means the site cannot quietly diverge from the text the
// team wrote, and re-running this picks up any edit they make.
//
// Everything here is somebody's writing. Nothing is summarised, reworded or
// abridged: the extractor pulls the heading and the paragraphs and stops.

import fs from "node:fs";
import path from "node:path";

const SOURCE = path.resolve(process.argv[2] ?? "../mereth-official/website/lore");
const OUT = path.resolve("src", "lib", "world", "lore.ts");

/*
 * Which shelf each document sits on, and the one line that tells a reader why
 * they would open it. Written here rather than derived, because a shelf is an
 * editorial judgement and the documents do not carry one.
 *
 * `college-of-winterhold.html` is a duplicate of `college-winterhold.html` in
 * the source repository and is deliberately not listed.
 */
const SHELVES = [
  {
    id: "orders",
    title: "The orders",
    blurb: "The three lore factions, in their own words and in the words of people who left them.",
    documents: [
      { file: "companions.html", slug: "companions", note: "The hall at Whiterun, and the mantle nobody has claimed for forty years." },
      { file: "harbinger-reflections.html", slug: "harbinger-reflections", note: "A Harbinger writing on how the Companions declined." },
      { file: "greymane-skyforge-letter.html", slug: "greymane-skyforge-letter", note: "The custodian of the Skyforge, on why his hammer is still." },
      { file: "shield-brother-letters.html", slug: "shield-brother-letters", note: "Letters between shield brothers during the turmoil." },
      { file: "college-winterhold.html", slug: "college-winterhold", note: "The College, its semesters, and what it asks of applicants." },
      { file: "thieves-guild.html", slug: "thieves-guild", note: "What the Guild is in Skyrim, told plainly." },
    ],
  },
  {
    id: "faith",
    title: "Magic and faith",
    blurb: "Where the province's magic comes from, and who is permitted to teach it.",
    documents: [
      { file: "atmoran-clevercraft.html", slug: "atmoran-clevercraft", note: "Clevercraft, and what Shalidor left behind." },
      { file: "bron-laahdan-treatise.html", slug: "bron-laahdan-treatise", note: "A treatise dictated by a master, on the learnings of Bron Laah'dan." },
      { file: "vigilant-rule-4e35.html", slug: "vigilant-rule-4e35", note: "The rule written for the newly founded Knights Vigilant." },
    ],
  },
  {
    id: "power",
    title: "Law and power",
    blurb: "Who holds the province, and who is working against them.",
    documents: [
      { file: "imperial-legion-4e185.html", slug: "imperial-legion-4e185", note: "An account of Imperial order and dominance, dated to the present year." },
      { file: "penitus-skyrim-report.html", slug: "penitus-skyrim-report", note: "A report on criminal enterprises, compiled for the Emperor." },
    ],
  },
];

/*
 * Decode entities.
 *
 * Named ones first, then any numeric one, because their documents carry hair
 * spaces and thin spaces (&#8202;, &#8201;) that a hand-written list misses and
 * that render as literal text on the page.
 */
const decode = (text) =>
  text
    .replace(/&#8212;/g, ", ")
    .replace(/&#8211;/g, ", ")
    .replace(/&mdash;/g, ", ")
    .replace(/&ndash;/g, ", ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&#(\d+);/g, (_match, code) => {
      const point = Number(code);
      /* Dashes become commas like the rest; every other codepoint is kept. */
      if (point === 8212 || point === 8211) return ", ";
      return String.fromCodePoint(point);
    })
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/[—–]/g, ", ")
    .replace(/\s+/g, " ")
    .trim();

function read(file) {
  const html = fs.readFileSync(path.join(SOURCE, file), "utf8");
  const body = html.slice(html.indexOf("<body"));

  const heading = /<h1[^>]*>(.*?)<\/h1>/s.exec(body);
  if (heading === null) throw new Error(`no <h1> in ${file}`);

  /*
   * A <br> inside a signature line runs two lines together, so it becomes a
   * paragraph break before the tags are stripped.
   */
  const paragraphs = [...body.matchAll(/<p[^>]*>(.*?)<\/p>/gs)]
    .flatMap((match) => match[1].split(/<br\s*\/?>/i))
    .map((chunk) => decode(chunk.replace(/<[^>]+>/g, "")))
    .filter((text) => text.length > 0);

  return { title: decode(heading[1].replace(/<[^>]+>/g, "")), paragraphs };
}

const shelves = SHELVES.map((shelf) => ({
  ...shelf,
  documents: shelf.documents.map((entry) => {
    const { title, paragraphs } = read(entry.file);
    return { slug: entry.slug, title, note: entry.note, paragraphs };
  }),
}));

const total = shelves.reduce((sum, shelf) => sum + shelf.documents.length, 0);
const words = shelves
  .flatMap((shelf) => shelf.documents)
  .reduce((sum, doc) => sum + doc.paragraphs.join(" ").split(/\s+/).length, 0);

const body = `/**
 * Mereth's published lore, as written.
 *
 * Generated by \`scripts/build-lore.mjs\` from the lore folder of Mereth's own
 * website repository. Do not edit by hand: change the source documents and
 * re-run it, so this site can never drift from the text the team published.
 *
 * The documents are reproduced in full. They are somebody's writing, and the
 * point of putting them here is that a player can read them, not that the site
 * can summarise them.
 */

export interface LoreDocument {
  slug: string;
  title: string;
  /** One line on why a reader would open this one. */
  note: string;
  paragraphs: string[];
}

export interface LoreShelf {
  id: string;
  title: string;
  blurb: string;
  documents: LoreDocument[];
}

export const loreShelves: LoreShelf[] = ${JSON.stringify(shelves, null, 2)};

export const loreDocuments: LoreDocument[] = loreShelves.flatMap((shelf) => shelf.documents);

/** Throws at build rather than rendering an empty page. */
export function loreDocument(slug: string): LoreDocument {
  const found = loreDocuments.find((document) => document.slug === slug);
  if (found === undefined) throw new Error(\`unknown lore document: \${slug}\`);
  return found;
}
`;

fs.writeFileSync(OUT, body);
console.log(`wrote ${total} documents, ${words.toLocaleString("en-GB")} words, to ${path.relative(process.cwd(), OUT)}`);
