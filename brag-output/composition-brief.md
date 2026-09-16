# Hyperframes Composition Brief: Mereth Roleplay

## Objective
A short launch-style film for merethroleplay.com, the official handbook for the Mereth Skyrim
roleplay server, postable in the server's own Discord.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape, 1920x1080, 30fps
- Duration: 22 seconds

## Source material
- Project root: `D:\MerethRP\WebsiteProject`
- Primary files read: `src/app/page.tsx`, `src/components/home/Hero.tsx`, `DESIGN.md`,
  `public/llms.txt`, plus a live capture of merethroleplay.com
- Product name: Mereth
- Strongest claim: "Skyrim, ten years after the Great War, with a player in every chair."
- Key visual: the six in-game plates the home page frames, and the commissioned hero painting
  the site runs behind every page
- Copy that appears verbatim, all of it lifted from the live page:
  - No global chat. No quest markers.
  - The jarl who grants your rank
  - The guard who arrests you
  - The smith who makes your sword
  - Bring a character who wants something.
  - Serious roleplay, 4E 185

## Creative direction
- Tone preset: cinematic
- Creative direction: a provincial record, not a product launch
- Interpretation: trailer scale, handbook restraint. Long holds, full-bleed plates, tracked
  caps in the site's own display face, and no gesture the site's motion law forbids.
- Angle: every Skyrim trailer promises a hero. This one promises other people.
- Hook: two absences before anything is offered.
- Outro: the site's own closing headline, then the wordmark and the address.
- Avoid: generic SaaS language, epic stock-trailer scoring, abstract filler, any visual not
  taken from the project.

## Visual identity
- Page `#10161a`, stone `#1b2429`, iron `#2f3d47`
- Frost `#9fb8c4` for ornament and the wordmark
- Bone `#e8e4d9` for every line of type
- Brass `#b89258` for the address and nothing else, because DESIGN.md reserves warmth for the
  thing you can act on and the address is the only action in a video
- Display face: Friz Quadrata Std, the site's real licensed face, loaded from local OTFs
- Ornament: the site's hairline rule with an angular notch, and its corner brackets

## Storyboard
As authored in `brag-plan.md`. Five scenes: the two absences, the triad, the turn, the
handbook, the wordmark.

## Audio
- Role: designed near-silence. A synthesised cold wind bed with six placed hits.
- Music: none, deliberately. The bundled library is upbeat corporate and an epic stock bed is
  the sound of the generic fantasy advert this server is not.
- Built by `brag-output/build-audio.sh` into one master track rather than as separate elements,
  so the balance is decided once and renders identically every time.
- Hits: Kenney CC0 samples, pitched down by resampling. Two snow footsteps under the opening
  lines, three heavy metal impacts under the triad, one soft tick under the figures, one deep
  bell under the wordmark.
- Deliberate absence: no hit lands on "All of them are players", where the pattern has taught
  the ear to expect a fourth.
- Level: normalised to -19 LUFS, peaks at -1.4 dBTP.

## What the gates said
`npx hyperframes check`: 0 lint errors, 0 runtime errors, 0 layout issues across 9 samples,
75/75 text checks pass WCAG AA.

Three findings it caught that would have shipped otherwise:
1. Animated letter-spacing snaps glyph positions to whole pixels under a seek-by-frame capture.
   The closing gesture is now per-glyph transforms, which interpolate sub-pixel.
2. An opacity-animated wrapper creates a stacking context, so mid-crossfade the type dropped
   behind the video plate. The z-index now sits on the section.
3. The eyebrow missed AA over the painting at the site's exact frost. The ground was deepened
   rather than the brand colour lightened.

A fourth was caught by looking at the rendered file rather than the composition: the scrims sat
inside the fade wrappers, so every video scene opened on half a second of ungraded footage.
