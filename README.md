# Mereth Roleplay

The public site and player handbook for the Mereth Roleplay server: what the
place is, how its systems work, and the reference a current player actually uses
while playing.

Twenty-nine routes. Everything on them is either counted out of the plugins the
launcher installs or quoted from a dated release note. Where an answer has not
been decided, the page says so rather than inventing one.

```bash
npm install
npm run dev          # http://localhost:3100
npm run typecheck
npm run build
```

Port 3100, not 3000. The local SkyMP dev server holds 3000, and because dev binds
`0.0.0.0` for review from other machines, a clash there serves confusing 404s.

## Stack

Next.js 16 (App Router) with React 19, TypeScript and Tailwind v4. No UI or icon
library: the ornament, icons and controls are all local components. The site is a
**static export**, so there is no server at runtime and no route handlers.

## Where things live

| Path | What |
|---|---|
| `src/app/globals.css` | Every design token. Colour, type scale, spacing, shadow. |
| `src/lib/site.ts` | Site name, navigation, footer, legal links, Discord invite. |
| `src/lib/handbook/` | The written pages: guide, FAQ, rules, tips, start, progression, survival. |
| `src/lib/mereth.ts` | Server facts and figures, read from the exported data, not typed by hand. |
| `src/lib/world/` | Holds, factions, professions, spells, recipes and the lore shelves. |
| `src/lib/status.ts` | The live player count. The only thing fetched in the browser. |
| `src/components/ornament/` | The frame, corners and dividers. |
| `src/components/handbook/` | Chapter navigation, blocks, question lists. |
| `src/components/codex/` | The skill planner and the searchable tables. |

## Generated files, and what regenerates them

Four files are written by a script and should never be edited by hand. Each
carries a header saying so.

| Generated | Script | Reads from |
|---|---|---|
| `src/lib/images.ts` + `public/img/*.webp` | `scripts/build-images.mjs` | `MerethPics/`, the raw screenshots |
| `src/lib/world/lore.ts` | `scripts/build-lore.mjs` | the published lore documents as HTML |
| `src/data/mereth.json` | `scripts/export-mereth-data.mjs` | the devkit's plugin dumps |
| `public/brand/*` | `scripts/build-logo.mjs` | the source mark |

The derived output is committed, so a clone builds and deploys without any of the
sources above. You only need them to add a picture, a lore document, or to pick
up a new patch's data.

## Fonts

Headings are Friz Quadrata Std, supplied locally and **not committed**:
`src/fonts/` is gitignored because the face is a commercial ITC typeface. A fresh
clone will fail to build until those four `.otf` files are in place. Body and UI
text is Exo, which is freely licensed and comes from Google Fonts.

## Static export, and the four traps in it

`npm run build` with `MERETH_STATIC=1` produces a plain directory of files. Each
of the following cost real time to find, so they are worth knowing before
changing anything in this area:

- **`next/image` does not apply `basePath` to an unoptimised src.** Neither does
  a raw `<video src>`, a poster, a metadata icon or a `fetch`. All of them go
  through `src/lib/asset.ts`.
- **`images: { unoptimized: true }` disables srcset generation entirely**, so
  `sizes` is inert and a full-width file gets sent to a small card.
  `scripts/build-images.mjs` bakes the narrow copies and `Plate.tsx` uses a plain
  `<img srcSet>` instead.
- **Next writes RSC payloads to a nested directory but its client asks for a flat
  filename**, which 404s on any plain file host. `scripts/flatten-export.mjs`
  copies them into place.
- **A route handler cannot serve live data under a static export.** It could only
  bake a build-time snapshot, which would report the server "open" forever, so
  the status block reads its two upstreams from the browser instead.

## Deployment

`npm run deploy` builds and publishes. It runs from a developer machine rather
than CI on purpose: the fonts and the background video are both gitignored, so a
CI checkout cannot produce a complete build.

The deploy carries forward the previous build's hashed assets rather than
replacing them. A host that caches HTML and gives no header control will hand a
reader stale HTML that asks for chunks the new build renamed, and they get a
crash screen instead of a page. Carried files are dropped after three further
deploys, tracked in `_next/static/carried.json`. **Do not delete old hashed
assets on a host whose cache headers you cannot set.**
