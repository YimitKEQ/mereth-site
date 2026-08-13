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
//   (a .jpg fallback used to be emitted beside each .webp. Nothing ever linked
//   to one: the manifest only writes .webp and no <picture> was ever wired up,
//   so it was 2.3 MB of dead weight in every deploy. WebP has been supported
//   everywhere since 2020.)
//   was: .jpg    a fallback, because a stray old browser showing nothing is a
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
    title: "Around the fire",
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
    title: "Giants on the road",
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
  {
    file: "falkreath.png",
    slug: "hold-moot",
    title: "The hold gathers",
    caption: "The jarl, the steward and every person stood in front of them are players. Nothing here is an NPC keeping a seat warm.",
  },
  {
    file: "im23e4age.png",
    slug: "the-court",
    title: "Court in session",
    caption: "Rank in a hold is granted through the holdstone, and it can be taken back the same way.",
  },
  {
    file: "Painted.jpg",
    slug: "a-jarl",
    title: "A jarl in his own hall",
    caption: "Every seat in Skyrim is held. Jarl is the most demanding whitelist on the server, and the seat can be lost as well as won.",
  },
  {
    file: "CS_2026-07-23_04-32-45_543.png",
    slug: "the-legion",
    title: "The Legion, still holding",
    caption: "It is 4E 185, ten years after the Great War. Imperial rule is formally intact and the Thalmor presence is growing.",
  },
  {
    file: "ScreenShot10.png",
    slug: "under-arms",
    title: "Under arms",
    caption: "An organisation caps at 25 members, and you may belong to one at a time. That is one per player, not one per character.",
  },
  {
    file: "20260808181123_1.jpg",
    slug: "the-muster",
    title: "The muster",
    caption: "A rank in a holdstone carries real mechanical benefits, for example a guard rank granting light armour.",
  },
  {
    file: "SS.jpg",
    slug: "the-harbour",
    title: "Longships in the shallows",
    caption: "The whole province is playable, so a harbour is somewhere people actually arrive.",
  },
  {
    file: "90xdjw8.png",
    slug: "the-arch",
    title: "Old bones in the snow",
    caption: "This site documents the systems. What waits at the bottom of a ruin is not one of them.",
  },
  {
    file: "Woods.png",
    slug: "the-camp",
    title: "A camp in the woods",
    caption: "Comfort gives fifty percent health regeneration near a camp fire, and it drops the moment you walk away.",
  },
  {
    file: "Skyrim_Special_Edition_7_26_2026_4_46_38_PM.png",
    slug: "the-lesson",
    title: "A lesson in a hall",
    caption: "A master willing to teach you, and a spellbook for the spell. Nobody here teaches themselves.",
  },
  {
    file: "image-129.png",
    slug: "the-shrine",
    title: "By candlelight",
    caption: "A blessing lasts eight hours, and you cannot take a second until the first has worn off.",
  },
  {
    file: "ScreenShot36.png",
    slug: "the-kill",
    title: "The kill, and the work after it",
    caption: "Butcher in the field before the skill is high enough and you ruin pelts and ingredients. The client says so in its own tier text.",
  },
  {
    file: "CS_2026-07-24_20-54-48_531.png",
    slug: "the-terrace",
    title: "Business, done in person",
    caption: "There is no global out-of-character channel. To find something out, you go and ask somebody.",
  },
  {
    file: "IMG_4429.png",
    slug: "the-standoff",
    title: "Something in the mist",
    caption: "Voice is proximity based. If you cannot make out who is talking, neither can your character.",
  },
  {
    file: "CS_2026-07-31_01-02-49_066.png",
    slug: "the-patrol",
    title: "Into the dark",
    caption: "A cleared dungeon seals, waits on a timer, regenerates and reopens. Keys found inside vanish after thirty minutes.",
    adjust: { crop: { left: 380, top: 280, width: 1160, height: 653 }, brightness: 1.9, contrast: 1.25 },
  },
  {
    file: "Screenshot_2026-08-11_012103.png",
    slug: "the-long-night",
    title: "The long night",
    caption: "World time is synced for everyone and runs on the Tamriel year, so night falls on the whole province at once.",
    adjust: { brightness: 1.55, contrast: 1.15 },
  },
  {
    file: "489830_20260727160518_1.png",
    slug: "the-mammoth",
    title: "The mammoth, briefly airborne",
    caption: "It is still Skyrim underneath. Some evenings the physics has opinions of its own.",
  },
  {
    file: "CS_2026-08-13_11-52-45_95.png",
    slug: "the-busker",
    title: "Playing to whoever stops",
    caption:
      "Voice carries by distance, so a song reaches the people standing close enough to hear it and nobody further. Some days that is a full market, and some days it is the rain.",
    /* Uncropped, the figure is a sixth of the frame and the whole thing reads
       as somebody standing near a tree: at card width the lute disappears and
       the rain with it. Cropping in past the empty foreground keeps the stalls
       on both sides, so the market is still legible, and a little contrast
       separates the player from the trunk through the rain haze. */
    adjust: { crop: { left: 400, top: 40, width: 1200, height: 830 }, contrast: 1.1 },
  },
  {
    file: "aurora-boards-20260813.png",
    slug: "nothing-scheduled",
    title: "Nothing scheduled",
    caption:
      "No quest marker put anybody here. Somebody walked out to the end of the boards, sat down, and watched the sky, because that is what their character would do.",
    /* Kept wide. A small figure against a large sky is the whole picture, and
       cropping in to make them bigger would throw away the thing being said.
       Lifted instead, because at card size the boards and the seated figure
       were sinking into the same darkness as the treeline. */
    adjust: { brightness: 1.3, contrast: 1.05 },
  },
  {
    file: "aurora-hall-20260813.png",
    slug: "outside-the-hall",
    title: "Sat out under the lights",
    caption:
      "Conversation happens where people are standing, so a row along a wall outside a hall is a real place to be. There is no global channel to talk in instead.",
    /* The lower third was stone wall and the right edge was cliff, so the row
       of people, which is the subject, sat small in the middle of two dead
       areas. Cropped to the hall and the wall they are sitting on, keeping the
       aurora above it because that is the light source. */
    adjust: { crop: { left: 60, top: 0, width: 1700, height: 1150 }, brightness: 1.15 },
  },
  {
    file: "hall-portrait-20260813.png",
    slug: "made-to-be-looked-at",
    title: "Made to be looked at",
    caption:
      "The paint, the scars and the build are somebody's decisions. You meet people here at speaking distance, so a character is a face long before it is a list of skills.",
  },
];

fs.mkdirSync(OUT, { recursive: true });

/** Extra widths emitted beside the full-size plate, for the srcset. */
const NARROW_WIDTHS = [640, 1024];

/*
 * Pictures that are on the site but are not plates.
 *
 * They get the same resize and re-encode as everything else, and deliberately
 * never enter the manifest below. `plates` is what the gallery iterates, so an
 * entry there puts a picture on the gallery page whether or not that was the
 * intention. Anything here is loaded by an explicit path instead.
 */
const EXTRAS = [
  { file: "content.jpg", slug: "chudmor", width: 900 },
];

const entries = [];

/*
 * Originals live either loose in MerethPics or in its `Used` folder, which is
 * where a picture gets filed once it is on the site. Looking in both means
 * tidying the folder never silently drops a plate from the manifest.
 */
const findSource = (file) => {
  for (const dir of [SOURCE, path.join(SOURCE, "Used")]) {
    const candidate = path.join(dir, file);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
};

for (const plate of PLATES) {
  const source = findSource(plate.file);
  if (source === null) {
    console.warn(`  missing, skipped: ${plate.file}`);
    continue;
  }

  const image = sharp(source);
  const meta = await image.metadata();

  /*
   * An optional crop and exposure lift, declared per plate.
   *
   * One shot was taken in an unlit mine: the subject sat in a small lit patch
   * with half the frame given over to black rock, and at card size it was a
   * black rectangle. Cropping to the subject and lifting the shadows is the
   * same order of handling as the resize every other plate gets, and it is
   * opt-in so nothing correctly exposed is touched.
   *
   * `gamma` is the wrong tool here despite the name: it exists to preserve
   * appearance across a resize, and it came back darker and redder.
   */
  const adjust = (pipeline) => {
    const tweak = plate.adjust;
    if (tweak === undefined) return pipeline;
    let out = pipeline;
    if (tweak.crop !== undefined) out = out.extract(tweak.crop);
    if (tweak.brightness !== undefined) out = out.modulate({ brightness: tweak.brightness });
    if (tweak.contrast !== undefined) out = out.linear(tweak.contrast, -8);
    return out;
  };

  /* The crop changes the frame, so it has to happen before the resize. */
  const sourceWidth = plate.adjust?.crop?.width ?? meta.width ?? MAX_WIDTH;
  const sourceHeight = plate.adjust?.crop?.height ?? meta.height ?? 1;
  const width = Math.min(sourceWidth, MAX_WIDTH);
  const height = Math.round((sourceHeight / sourceWidth) * width);

  await adjust(sharp(source)).resize({ width }).webp({ quality: 78 }).toFile(path.join(OUT, `${plate.slug}.webp`));

  /*
   * Narrower copies, for the srcset.
   *
   * `images: { unoptimized: true }` is required on a host with no image
   * server, and it makes next/image skip srcset generation entirely: the
   * `sizes` prop on every picture was inert and a 1800px file was being sent
   * to a 400px card. Three of the home page's cards alone shipped 533 KB where
   * 94 KB would do. So the widths are baked here instead, at build time, where
   * sharp is already running.
   */
  for (const w of NARROW_WIDTHS) {
    if (w >= width) continue;
    await adjust(sharp(source)).resize({ width: w }).webp({ quality: 74 })
      .toFile(path.join(OUT, `${plate.slug}-${w}.webp`));
  }

  // 20px wide is enough to read as the picture once blurred, and small enough
  // that inlining it in the page costs less than a request would.
  const blur = await adjust(sharp(source)).resize({ width: 20 }).webp({ quality: 40 }).toBuffer();

  const webpKb = fs.statSync(path.join(OUT, `${plate.slug}.webp`)).size / 1024;
  entries.push({
    ...plate,
    width,
    height,
    widths: NARROW_WIDTHS.filter((w) => w < width),
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  });
  console.log(`  ${plate.slug.padEnd(14)} ${width}x${height}  ${webpKb.toFixed(0)} KB`);
}

for (const extra of EXTRAS) {
  const source = findSource(extra.file);
  if (source === null) {
    console.warn("  extra missing, skipped: " + extra.file);
    continue;
  }
  const out = path.join(OUT, `${extra.slug}.webp`);
  await sharp(source).resize({ width: extra.width }).webp({ quality: 80 }).toFile(out);
  console.log("  extra " + extra.slug + ".webp  " + Math.round(fs.statSync(out).size / 1024) + " KB");
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
  /** Narrower copies that exist on disk, for the srcset. */
  widths: number[];
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
    widths: [${e.widths.join(", ")}],
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
