// Build the share card that Discord, Twitter and Slack fetch when someone
// pastes a link.
//
// The banner was doing this job and was wrong for it twice over. It is 2800x722,
// an aspect ratio of 3.9:1, where every unfurler expects about 1.91:1, so it
// arrived as a thin strip in a tall box. And it is a 3.6 MB PNG of a painting,
// which is the worst possible encoding for photographic content: pasting a link
// left an empty embed for seconds while it downloaded, or long enough that
// people gave up before seeing it.
//
// The fix is a centre crop to the ratio the unfurlers actually want, at the size
// they actually display, encoded as JPEG. The painting's mark, wordmark and the
// two figures all sit in the middle, so a centre crop keeps the subject and only
// loses the outer trees.

import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";

const SOURCE = path.resolve("public", "brand", "banner.png");
const OUT = path.resolve("public", "brand", "og-card.jpg");

/* What every unfurler treats as the canonical card: 1.91:1 at 1200x630. Larger
   buys nothing, because none of them display it bigger than this. */
const WIDTH = 1200;
const HEIGHT = 630;

/* Facebook and Discord both refuse or truncate cards past a few megabytes, and
   a card that arrives late may as well not exist. This is the ceiling we hold
   the encoder to, and it is roughly twenty times smaller than the banner. */
const MAX_BYTES = 300 * 1024;

const source = sharp(SOURCE);
const { width, height } = await source.metadata();

/* Take the full height and as much width as the target ratio allows, centred. */
const cropWidth = Math.round(height * (WIDTH / HEIGHT));
if (cropWidth > width) {
  throw new Error(`banner is ${width}x${height}, too narrow to crop to ${WIDTH}x${HEIGHT}`);
}
const left = Math.round((width - cropWidth) / 2);

/* Quality is stepped down rather than guessed, so the card lands under the
   ceiling without being softer than it has to be. */
let written = null;
for (const quality of [86, 82, 78, 74, 70]) {
  const buffer = await sharp(SOURCE)
    .extract({ left, top: 0, width: cropWidth, height })
    .resize(WIDTH, HEIGHT, { fit: "fill" })
    .jpeg({ quality, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();

  written = { buffer, quality };
  if (buffer.length <= MAX_BYTES) break;
}

fs.writeFileSync(OUT, written.buffer);

const before = fs.statSync(SOURCE).size / 1024;
const after = written.buffer.length / 1024;
console.log(
  `${path.relative(process.cwd(), OUT)}: ${WIDTH}x${HEIGHT}, quality ${written.quality}, ` +
    `${after.toFixed(0)} KB, down from ${before.toFixed(0)} KB`,
);
