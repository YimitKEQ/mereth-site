// Turn the raw screenshots in MerethPics/ into web assets.
//
//   node scripts/build-images.mjs
//
// The originals are 19 MB of 1920x1080 and 3440x1440 PNGs straight out of the
// game. Shipping those would be the single heaviest thing on the site by an
// order of magnitude, so this resizes and re-encodes once, at build authoring
// time, rather than leaning on runtime optimisation for assets that never
// change.
//
// Three outputs per image:
//
//   .webp        the asset, capped at 1800px wide
//   .jpg         a fallback, because a stray old browser showing nothing is a
//                worse failure than 40 KB of duplication
//   blurDataURL  a 20px base64 thumbnail, so next/image can blur up instead of
//                popping in. Screenshots are dark and heavy; a pop is jarring.
//
// The manifest it writes carries real width and height, which is what stops
// next/image from causing layout shift.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE = path.resolve("MerethPics");
const OUT = path.resolve("public", "img");
const MANIFEST = path.resolve("src", "lib", "images.ts");

/** Widest we ever render one of these. Beyond it the file grows and nothing looks better. */
const MAX_WIDTH = 1800;

/*
 * Naming, and what each picture is for.
 *
 * The game filenames are timestamps and hashes, which are useless in a page.
 * Each gets a slug and a caption written once here, so a picture can move
 * around the site without its description drifting away from it.
 */
const PLATES = [
  {
    file: "BjcKhYWG0ePWmNpp0fFRtg.png",
    slug: "aurora",
    title: "Under the aurora",
    caption: "The Sea of Ghosts throws light over the north for most of the year.",
  },
  {
    file: "TheOldWays.jpg",
    slug: "old-ways",
    title: "The old ways",
    caption: "Clevercraft is the ancestral tradition of Skyrim's people. Where you find magic and Nords together, expect a fire and a shaman.",
  },
  {
    file: "20260809160841_1.jpg",
    slug: "mead-hall",
    title: "A hall in the evening",
    caption: "Most of what happens on Mereth happens at a table, over a longfire.",
  },
  {
    file: "203B661.JPG",
    slug: "jarls-hall",
    title: "The jarl's hall",
    caption: "Court is held where the hold eats. Rank here is granted, and it can be taken back.",
  },
  {
    file: "20A02C1.JPG",
    slug: "hold-guard",
    title: "The hold guard",
    caption: "Guards are players. So is whoever they are waiting for.",
  },
  {
    file: "489830_20260803131209_1.png",
    slug: "longfire",
    title: "Around the longfire",
    caption: "Sat down, armed, and in no hurry. An ordinary evening.",
  },
  {
    file: "489830_20260806043919_1.png",
    slug: "winter-port",
    title: "A port in winter",
    caption: "Nine holds, each with its own law, its own court and its own trade.",
  },
  {
    file: "489830_20260727215644_1.png",
    slug: "palisade",
    title: "Beyond the palisade",
    caption: "The province is the whole map, and the weather in it is not on your side.",
  },
  {
    file: "image.png",
    slug: "arriving",
    title: "Arriving",
    caption: "Carry weight is a real constraint. The answer to it is crafted, not bought.",
  },
  {
    file: "Mammoth_2.jpg",
    slug: "mammoths",
    title: "The hunt",
    caption: "Hunting, herbalism, mining, fishing. Eight gathering trades, each with its own nodes.",
  },
  {
    file: "skillmenu.png",
    slug: "skill-menu",
    title: "The skill plan",
    caption: "Press K. Eighteen memory points across 51 skills, and the tier you buy is the ceiling that skill can ever reach.",
  },
  {
    file: "magic.jpg",
    slug: "spellcasting",
    title: "A spell, finally",
    caption: "Nobody starts with this. A master willing to teach you, a spellbook, and a season of study.",
  },
  {
    file: "skyrim-holds-map.png",
    slug: "holds-map",
    title: "Province of Skyrim",
    caption: "Drawn 4E 182 by Nataly Dravarol, cartographer. Nine holds, nine seats, nine sets of law.",
  },
  {
    file: "20260804054334_1.jpg",
    slug: "night-watch",
    title: "Alone on the pass",
    caption: "Some questions do not have a published answer. You find those out in character.",
  },
];

fs.mkdirSync(OUT, { recursive: true });

const entries = [];

for (const plate of PLATES) {
  const source = path.join(SOURCE, plate.file);
  if (!fs.existsSync(source)) {
    console.warn(`  missing, skipped: ${plate.file}`);
    continue;
  }

  const image = sharp(source);
  const meta = await image.metadata();
  const width = Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH);
  const height = Math.round(((meta.height ?? 1) / (meta.width ?? 1)) * width);

  await sharp(source).resize({ width }).webp({ quality: 78 }).toFile(path.join(OUT, `${plate.slug}.webp`));
  await sharp(source).resize({ width }).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(OUT, `${plate.slug}.jpg`));

  // 20px wide is enough to read as the picture once blurred, and small enough
  // that inlining it in the page costs less than a request would.
  const blur = await sharp(source).resize({ width: 20 }).webp({ quality: 40 }).toBuffer();

  const webpKb = fs.statSync(path.join(OUT, `${plate.slug}.webp`)).size / 1024;
  entries.push({
    ...plate,
    width,
    height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  });
  console.log(`  ${plate.slug.padEnd(14)} ${width}x${height}  ${webpKb.toFixed(0)} KB`);
}

const body = `import { asset } from "@/lib/asset";

/**
 * The picture manifest.
 *
 * Generated by \`scripts/build-images.mjs\` from the originals in \`MerethPics/\`.
 * Do not edit by hand: change the captions in that script and re-run it, so a
 * picture and its description can never drift apart.
 *
 * Sources go through \`asset()\` because next/image does not apply \`basePath\`
 * to an unoptimised src, and the static export for a GitHub project page is
 * served from a sub-path.
 *
 * Width and height are the real dimensions of the emitted file, which is what
 * lets next/image reserve the space and avoid layout shift. \`blurDataURL\` is a
 * 20px thumbnail inlined as base64, so a heavy screenshot blurs up rather than
 * popping in.
 */

export interface Plate {
  slug: string;
  title: string;
  caption: string;
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
}

export const plates: Record<string, Plate> = {
${entries
  .map(
    (e) => `  "${e.slug}": {
    slug: "${e.slug}",
    title: ${JSON.stringify(e.title)},
    caption: ${JSON.stringify(e.caption)},
    src: asset("/img/${e.slug}.webp"),
    width: ${e.width},
    height: ${e.height},
    blurDataURL:
      "${e.blurDataURL}",
  },`,
  )
  .join("\n")}
};

/** Throws rather than rendering a broken image, so a typo fails at build. */
export function plate(slug: string): Plate {
  const found = plates[slug];
  if (found === undefined) throw new Error(\`unknown plate "\${slug}"\`);
  return found;
}
`;

fs.writeFileSync(MANIFEST, body);
console.log(`\nwrote ${entries.length} plates and ${path.relative(process.cwd(), MANIFEST)}`);
