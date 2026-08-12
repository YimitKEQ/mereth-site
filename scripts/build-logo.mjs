// Recolour Mereth's own mark for a dark page.
//
//   node scripts/build-logo.mjs
//
// `public/brand/logo.png` is the real logo and it already carries a proper
// alpha channel: what looks like a white background in a viewer is the viewer
// showing through. So the shape needs no cutting out. What it does need is a
// colour change, because the artwork is a blue-to-black gradient designed to
// sit on light, and on this site's near-black it reads as a dark smudge.
//
// Keep the alpha exactly as drawn, including the soft outer glow, and replace
// the colour with a flat brand tint. Recolouring is then one hex here rather
// than a re-cut of the art.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE = path.resolve("public", "brand", "logo.png");
const OUT = path.resolve("public", "brand");

/** Frost, the site's primary accent. The mark is chrome, so it matches chrome. */
const TINT = { r: 0xc2, g: 0xd6, b: 0xdf };

/*
 * Crop boxes, measured off the 1920x1080 original, then trimmed to the real
 * ink. The glyph and the wordmark are cut separately because they are used at
 * very different sizes: the glyph alone carries the navbar at ~34px, where the
 * wordmark would be an illegible smear.
 */
const CUTS = [
  { name: "mark", left: 560, top: 130, width: 820, height: 660 },
  { name: "lockup", left: 380, top: 130, width: 1180, height: 800 },
];

async function tinted(cut) {
  const cropped = sharp(SOURCE).extract(cut);

  // The alpha the artist drew, untouched.
  const alpha = await cropped.clone().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const { width, height } = alpha.info;

  const flat = await sharp({
    create: { width, height, channels: 3, background: TINT },
  })
    .raw()
    .toBuffer();

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = flat[i * 3] ?? 0;
    rgba[i * 4 + 1] = flat[i * 3 + 1] ?? 0;
    rgba[i * 4 + 2] = flat[i * 3 + 2] ?? 0;
    rgba[i * 4 + 3] = alpha.data[i] ?? 0;
  }

  return sharp(rgba, { raw: { width, height, channels: 4 } }).trim({ threshold: 4 });
}

for (const cut of CUTS) {
  const image = await tinted(cut);
  const file = path.join(OUT, `mereth-${cut.name}.png`);
  await image.clone().png({ compressionLevel: 9 }).toFile(file);
  const meta = await sharp(file).metadata();
  console.log(`  mereth-${cut.name.padEnd(8)} ${meta.width}x${meta.height}  ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
}

// Favicon: the mark on the page's own dark, so it reads in a light tab strip.
const markForIcon = await (await tinted(CUTS[0]))
  .resize({ width: 52, height: 52, fit: "inside" })
  .png()
  .toBuffer();

await sharp({
  create: { width: 64, height: 64, channels: 4, background: { r: 0x10, g: 0x16, b: 0x1a, alpha: 1 } },
})
  .composite([{ input: markForIcon, gravity: "centre" }])
  .png()
  .toFile(path.join(OUT, "icon.png"));
console.log("  icon.png       64x64");
