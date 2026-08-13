# Design

## Color strategy
Restrained, cold. Tinted neutrals carry the surface; two accents, used at very
different volumes.

Sampled from the commissioned hero painting rather than picked from a wheel, so
the chrome and the art share a light source.

| Role | Value | Use |
|---|---|---|
| Page | `#10161a` | Cold near-black slate. Never `#000`. |
| Stone | `#1b2429` | Raised surfaces, nav, footer. |
| Iron | `#2f3d47` | Rules, dividers, inactive edges. |
| Frost | `#9fb8c4` | **Primary accent.** Ornament, headings, links. |
| Bone | `#e8e4d9` | Body text. Never `#fff`. |
| Brass | `#b89258` | **Action only.** Primary buttons, claim, submit. |
| Aurora | `#7fc99a` | Success and live state. Rare. |
| Rust | `#a8503c` | Errors. |
| Vellum | `#e3d9c2` | Document surfaces: wiki body, contracts, writs. |

The deliberate inversion: the category reflex is warm gold on black. Here the
chrome is **cold** and warmth is reserved for the one thing you can act on, so
a primary button is the only warm object on the screen and needs no other
emphasis.

## Typography
- **Display: Friz Quadrata Std.** A glyphic serif with flared, chiselled stems:
  carved rather than written, and it reads as weight without tipping into
  costume. Commercial ITC face, supplied locally and kept out of the repo.
- **UI and long-form: Exo.** Geometric, slightly condensed, and it holds up at
  the small sizes the tables and captions need. Freely licensed.

Cinzel was the earlier substitute for the display face, chosen because it was
safe. Safe was the problem: it is the reflex answer for anything Roman and it
made the chrome read as generic. Do not reintroduce it as a fallback.

Scale steps at 1.25 minimum. Display is tracked wide in caps, body never.

## Ornament
A **Nordic interlace bracket**: an angular over-under knot at each corner with
rules running between them, inset by the corner size. Drawn in markup rather
than sliced as an image, so it recolours with the token and stays sharp at any
size.

Above it sits a **gabled roof line** with carved posts, taken from the timber
gables in the hero painting, so the chrome and the art agree about what the
buildings in this province look like.

## Elevation
Flat. Depth comes from rule weight and surface temperature, not shadow. The one
exception is floating overlays, which get a real shadow because they need to
read as detached.

## Motion
Ease-out only, 150ms for state, 250ms for entrance. Nothing bounces. This world
is heavy.
