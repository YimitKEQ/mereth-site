// Turn the raw captures in MerethPics/ into web video.
//
//   node scripts/build-video.mjs
//
// The originals come straight out of the game at 1080p and about 21 Mbps, which
// is roughly 2.7 MB per second of footage. Nothing on a web page should carry
// that, and unlike the screenshots there is no runtime optimiser that would ever
// fix it, so the encode happens here once and the result is what ships.
//
// The output is gitignored, the same as the background plate, because video does
// not belong in this repository's history. That is exactly why this file exists:
// the asset cannot be recovered from a clone, so the recipe has to be.
//
// Choices worth knowing:
//
//   no audio    Every clip is a silent loop on the page. Dropping the track saves
//               bytes and, more usefully, keeps autoplay permitted: a browser will
//               refuse to autoplay anything with sound.
//   crf 33      Compared frame to frame against the source at 1:1 on the hardest
//               part of the picture, which is blowing snow. The difference is a
//               little softening on fur and cloth and is not visible at page size.
//               Blown snow is high entropy, so a lower crf costs megabytes fast.
//   faststart   Moves the index to the front of the file so playback can begin
//               before the whole thing has arrived.
//   1280 wide   The band it renders in is about 1200px at the widest layout.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SOURCE = path.resolve("MerethPics");
const OUT = path.resolve("public", "art");

const CLIPS = [
  {
    file: "walking.mp4",
    slug: "the-long-walk",
    width: 1280,
    crf: 33,
    /** Seconds into the clip to lift the still from. Wants a frame that reads
        on its own, since it is what anyone with reduced motion is left with. */
    posterAt: 24,
  },
];

function run(args) {
  return execFileSync("ffmpeg", args, { stdio: ["ignore", "pipe", "pipe"] });
}

const findSource = (file) => {
  for (const dir of [SOURCE, path.join(SOURCE, "Used")]) {
    const candidate = path.join(dir, file);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
};

fs.mkdirSync(OUT, { recursive: true });

for (const clip of CLIPS) {
  const source = findSource(clip.file);
  if (source === null) {
    console.warn("  missing, skipped: " + clip.file);
    continue;
  }

  const video = path.join(OUT, `${clip.slug}.mp4`);
  run([
    "-v", "error", "-i", source,
    "-an",
    "-vf", `scale=${clip.width}:-2`,
    "-c:v", "libx264", "-preset", "slow", "-crf", String(clip.crf),
    "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    video, "-y",
  ]);

  const poster = path.join(OUT, `${clip.slug}.webp`);
  run([
    "-v", "error", "-ss", String(clip.posterAt), "-i", source,
    "-frames:v", "1",
    "-vf", `scale=${clip.width}:-2`,
    "-quality", "78",
    poster, "-y",
  ]);

  const mb = (n) => Math.round(fs.statSync(n).size / 1024) + " KB";
  console.log(`  ${clip.slug}  ${clip.width}w  video ${mb(video)}  poster ${mb(poster)}`);
}

console.log("wrote " + OUT);
