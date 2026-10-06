// Turn the Lore Team's #tamriel-pocket-guide forum posts into site data.
//
// Pure: no network, no file system. `sync-pocket-guide.mjs` feeds it what the
// bot read, and `tests/pocket-guide.test.mjs` feeds it fixtures.
//
// The posts are written for Discord, not for a parser, so this reads them the
// way a person does: a line that is just a people's name starts that people,
// a line with a UESP link is further reading, every other line is a point.
// One thread can hold several peoples ("Beast Races" holds Argonians and
// Khajiit), and a thread with no heading inside it is about its own title.

/** Every people the guide can cover, in the order the page shows them. */
export const PEOPLES = [
  { id: "nords", name: "Nords", aliases: ["nord", "nords"] },
  { id: "imperials", name: "Imperials", aliases: ["imperial", "imperials"] },
  { id: "bretons", name: "Bretons", aliases: ["breton", "bretons"] },
  { id: "redguard", name: "Redguard", aliases: ["redguard", "redguards"] },
  { id: "altmer", name: "Altmer", aliases: ["altmer", "high elves", "high elf"] },
  { id: "bosmer", name: "Bosmer", aliases: ["bosmer", "wood elves", "wood elf"] },
  { id: "dunmer", name: "Dunmer", aliases: ["dunmer", "dark elves", "dark elf"] },
  { id: "orcs", name: "Orcs", aliases: ["orc", "orcs", "orsimer"] },
  { id: "argonians", name: "Argonians", aliases: ["argonian", "argonians"] },
  { id: "khajiit", name: "Khajiit", aliases: ["khajiit"] },
];

const URL_RE = /https?:\/\/\S+/g;

/** `## **Orcs**:` is a heading for `orcs`. Anything longer than a name is not. */
function headingOf(line) {
  const bare = line
    .replace(/^#+\s*/, "")
    .replace(/[*_~]/g, "")
    .replace(/:$/, "")
    .trim()
    .toLowerCase();
  return PEOPLES.find((p) => p.aliases.includes(bare)) ?? null;
}

/** `https://en.uesp.net/wiki/Lore:Code_of_Malacath` reads as `Code of Malacath`. */
export function readingLabel(url) {
  const last = decodeURIComponent(url.split("/").pop() ?? url);
  return last.replace(/^Lore:/, "").replace(/_/g, " ");
}

/** Discord markdown down to the site's own grammar: bold and code survive, the rest goes. */
function cleanPoint(line) {
  return line
    .replace(/^\s*(?:[-*•]|\d+\.)\s+/, "")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/(?<![*])\*(?![*\s])([^*]+?)\*(?![*])/g, "$1")
    .replace(/\s+[\u2013\u2014]\s+/g, ": ")
    .replace(/[\u2013\u2014]/g, ", ")
    .trim();
}

/**
 * @param threadName the forum post's title
 * @param contents   the text of the author's own messages, oldest first
 * @returns          one entry per people found, points and reading in order
 */
export function parseThread(threadName, contents) {
  const found = new Map();
  let current = headingOf(threadName);

  const entry = (people) => {
    if (!found.has(people.id)) found.set(people.id, { id: people.id, name: people.name, points: [], reading: [] });
    return found.get(people.id);
  };

  for (const content of contents) {
    for (const raw of content.split(/\r?\n/)) {
      const line = raw.trim();
      if (line === "") continue;

      const heading = headingOf(line);
      if (heading !== null) {
        current = heading;
        continue;
      }
      if (current === null) continue;
      if (/^<?@/.test(line) || /^useful reading:?$/i.test(line.replace(/[*_]/g, ""))) continue;

      const urls = line.match(URL_RE);
      if (urls !== null) {
        const target = entry(current);
        for (const url of urls) {
          if (!target.reading.some((r) => r.url === url)) target.reading.push({ label: readingLabel(url), url });
        }
        continue;
      }

      const point = cleanPoint(line);
      if (point !== "") entry(current).points.push(point);
    }
  }

  return [...found.values()].filter((p) => p.points.length > 0);
}

/**
 * Replace seeded peoples with what the forum says, keep the rest, and put them
 * in page order. A people the forum has not written yet keeps its seed; an
 * empty forum never removes a row.
 */
export function mergePeoples(seeded, fromForum) {
  const byId = new Map(seeded.map((p) => [p.id, p]));
  for (const p of fromForum) byId.set(p.id, p);
  const order = PEOPLES.map((p) => p.id);
  return [...byId.values()].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}
