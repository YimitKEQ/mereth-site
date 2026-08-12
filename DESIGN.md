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
- **Display: Cinzel.** Trajan-derived, carved Roman capitals. The Empire's
  lettering, not a fantasy pastiche.
- **UI: Alegreya Sans.** Humanist, slightly calligraphic, reads as written
  rather than manufactured.
- **Long-form: Alegreya.** Serif companion, for wiki and document bodies set on
  vellum.

Scale steps at 1.25 minimum. Display is tracked wide in caps, body never.

## Ornament
The reference's Chinese fret is replaced by a **Nordic interlace bracket**: an
angular over-under knot at each corner with rules running between them, inset by
the corner size. Same construction, different culture. Drawn, not sliced, so it
recolours with the token.

The pagoda crown becomes a **gabled roof line** with carved posts, taken from
the timber gables in the hero painting.

## Elevation
Flat. Depth comes from rule weight and surface temperature, not shadow. The one
exception is floating overlays, which get a real shadow because they need to
read as detached.

## Motion
Ease-out only, 150ms for state, 250ms for entrance. Nothing bounces. This world
is heavy.
