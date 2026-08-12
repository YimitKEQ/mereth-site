# Mereth web

Next.js site and wiki for the server. This first pass is a deliberate
reproduction of a reference design (Miststorm) so the layout, component set and
responsive behaviour can be tested before any rebranding happens.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

## Stack

Next.js (App Router) + React + TypeScript + Tailwind v4, matching the reference,
which is itself Tailwind v4 with `next/font`. No UI or icon dependencies: the
ornament, icons and controls are all local components.

## Where things live

| Path | What |
|---|---|
| `src/app/globals.css` | Every design token. Rebranding starts and mostly ends here. |
| `src/lib/site.ts` | Name, navigation, footer columns, legal links. |
| `src/lib/content.ts` | Page copy, features, FAQ, news. The seam a CMS replaces. |
| `src/components/ornament/` | The fret frame, corners and dividers. |
| `src/components/ui/` | Button, Select, CopyField, Accordion, icons, art placeholder. |
| `src/components/layout/` | Header, footer, logo, page heading. |
| `src/components/home/` | Hero, feature grid, news card, community panel. |

## Rebranding

1. `globals.css`: colours, type scale, tracking, shadows, container width.
2. `layout.tsx`: swap the two typefaces.
3. `src/lib/site.ts` and `src/lib/content.ts`: names and copy.
4. Replace `ArtPlaceholder` usages with real `next/image` art.

Nothing else hardcodes a colour, a product name or a font.

## What is a stand-in, and why

None of the reference's artwork is reproduced here, because it is Blizzard's and
the site owner's, not ours. What is reproduced is layout, spacing, type scale and
component behaviour, which is the part being tested.

- **Artwork.** Every image slot renders `ArtPlaceholder`, a deterministic painted
  gradient at the reference's aspect ratio. Swapping in real art changes no layout.
- **Emblem.** `Logo` draws a plaque in the same silhouette as the reference mark.
- **Headings.** The reference uses Friz Quadrata, a commercial ITC face that
  cannot be redistributed. Headings use Cinzel: same glyphic-serif register and
  correct in the wide uppercase tracking this design uses. Body text is Exo,
  which is the reference's own face and is freely licensed, so it is exact.
- **Page backdrop.** The reference uses a photographic forest plate; this is a
  layered gradient standing in for it.

## Two traps already hit, so they do not get hit again

**Tailwind v4 resolves `max-w-sm|md|lg|xl|2xl` against `--spacing-*` before
`--container-*`.** The reference's token dump includes a named spacing scale
(`--spacing-md: 16px` and friends). Declaring those inside `@theme` silently
rewrote `max-w-md` from 28rem to 16px and collapsed every paragraph to one word
per line. They live in `:root` instead, as plain custom properties.

**`relative` and `absolute` are the same CSS property.** Passing `absolute` into
a component whose base classes already include `relative` does not override it;
stylesheet order decides. Position the wrapper, not the component.

## Not built yet

Discord OAuth, the staff login, and wiki editing. The shell is in place for them:
`site.ts` already carries the signed-in navigation the reference uses, and
`typedRoutes` is off in `next.config.ts` only until the remaining routes exist.
Turn it back on then and it will catch every broken internal link at build time.

`reference/` holds screenshots of the reference site for comparison during this
phase. It is gitignored and is not ours to redistribute.
