#!/usr/bin/env bash
# Rebuild every media asset the composition needs, from sources already in this
# repository. Run from `brag-output/`.
#
# The assets themselves are gitignored: two of them are graded video, one is a
# licensed typeface that may not be redistributed, and all of them are derived.
# This script is the source of truth for how each was made, so the film can be
# rebuilt from a clean checkout rather than from a folder somebody has to keep.
#
#   bash build-assets.sh && bash build-audio.sh
set -euo pipefail

ART=../public/art
IMG=../public/img
FONTS=../src/fonts
OUT=composition/assets

mkdir -p "$OUT/fonts"

# The licensed display face. Gitignored here for the same reason it is gitignored
# in the site: Friz Quadrata Std is ITC's, licensed to Mereth, and not ours to
# redistribute. Without it every title falls back to a serif and looks like a
# decision rather than a missing file.
if [ ! -f "$FONTS/FrizQuadrataStd-Medium.otf" ]; then
  echo "build-assets: $FONTS is empty. Supply the font archive first, the site needs it too." >&2
  exit 1
fi
cp "$FONTS/FrizQuadrataStd-Medium.otf" "$FONTS/FrizQuadrataStd-Bold.otf" "$OUT/fonts/"

# Scene 1. A player walking a mountain path in a blizzard with nothing telling
# them where to go, which is the whole point of the line over it. Graded cold and
# down hard: the source is bright snow and the type has to carry.
ffmpeg -hide_banner -v error -ss 1.5 -t 4.6 -i "$ART/the-long-walk.mp4" \
  -vf "scale=1920:1080:flags=lanczos,eq=brightness=-0.16:contrast=1.10:saturation=0.45,colorbalance=rs=-0.06:bs=0.10:gm=-0.02" \
  -an -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -r 30 -y "$OUT/hook.mp4"

# Scene 5. The commissioned hero painting the site runs behind every page, so the
# film closes on the image the site opens on.
ffmpeg -hide_banner -v error -ss 5 -t 4.2 -i "$ART/mereth-bg.mp4" \
  -vf "scale=1920:1080:flags=lanczos,eq=brightness=-0.22:contrast=1.06:saturation=0.55" \
  -an -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -r 30 -y "$OUT/outro.mp4"

# The plates. Each is graded to sit under type at full contrast, and the three
# that carry evidence rather than mood are lifted rather than crushed: if the
# line says the guard is a person, the person has to be visible.
grade() {
  ffmpeg -hide_banner -v error -i "$IMG/$1.webp" \
    -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,eq=brightness=$2:contrast=$3:saturation=$4" \
    -q:v 3 -y "$OUT/$1.jpg"
}
grade a-jarl     -0.10 1.06 0.70
grade the-patrol  0.09 1.02 0.80
grade old-ways    0.05 1.02 0.85
grade under-arms  0.02 1.04 0.78

# Scene 4 needs a frame of the real site. Captured from the live domain rather
# than a local build, because what the film claims to show is what a visitor
# actually gets. Cropped to the top of the page so the nav, the wordmark and the
# live counts fill the plate instead of sitting in a thumbnail.
if [ ! -f capture/screenshots/scroll-000.png ]; then
  echo "build-assets: capturing merethroleplay.com"
  npx -y hyperframes capture https://merethroleplay.com/ -o capture --skip-vision --max-screenshots 8 >/dev/null
fi
ffmpeg -hide_banner -v error -i capture/screenshots/scroll-000.png \
  -vf "crop=1920:800:0:0,scale=1920:1080" -q:v 2 -y "$OUT/site-hero.jpg"

echo "build-assets: wrote $(ls "$OUT" | wc -l) files to $OUT"
