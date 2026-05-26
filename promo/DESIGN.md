# DESIGN — Holodeck-in-a-Pocket promo

Brand cheat sheet for the HyperFrames composition. Pulled from
`capture/extracted/tokens.json` and the AgileLens design system
(`~/knowledge/context/brand/design-system.md`). The site already uses the AL
palette — this just consolidates it for the video.

## Palette

| Role | Hex | Usage in video |
|------|-----|----------------|
| Ink (page) | `#0d0a1e` | Background of every beat |
| Ink-soft | `rgba(13, 10, 30, .78)` | Text-card backings, lower-thirds |
| Paper | `#f5f3ff` | Headlines, captions |
| Pink | `#FE00B5` | Accent strokes, CTA glow, sparkle |
| Purple | `#3500A7` | Gradient companion, ambient wash |
| Black | `#000000` | True black for vignette / cinema bars |
| White | `#FFFFFF` | Sub-captions, hairline rules |

Primary gradient (CTA + thread): `linear-gradient(225deg, #3500A7 0%, #FE00B5 100%)`.
Use as a thin top-edge bar on every scene clip, plus the title / CTA buttons.
Reads at small sizes and ties the cuts together.

Ambient wash on the title + CTA beats:
`radial-gradient(ellipse at 30% 30%, rgba(254,0,181,.18), transparent 60%),
 radial-gradient(ellipse at 70% 80%, rgba(53,0,167,.22), transparent 60%)`
Animate slow drifts on `--bg-x` / `--bg-y` (parent owns them; never on the
same node as a transform tween — see GSAP rules).

## Type

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Display headline | `-apple-system, system-ui` (matches site) | 800 | 96px @ 1080² |
| Sub-headline | same | 400 | 28px |
| Caption / lower-third | same | 600 | 22px |
| UI chip ("DESIGN OPTIONS") | same | 600 | 11px tracking +0.14em |

The site uses `-apple-system` with `Arial` fallback (no webfonts on the
deployed page) — keep the composition consistent so type renders
identically to the live URL. No Manrope here despite it being the AL house
font; the site itself opted into the OS stack and we should match.

Letter-spacing: `-0.02em` on display, `+0.02em` on captions.

## Motion language

- **Camera evokes "stepping into a space."** Each scene clip starts wide,
  then the parent `.pan` element does a slow `y` drift while a child
  element does a slow `scale` Ken Burns. Parent owns `y`/`opacity`, child
  owns `scale` (GSAP rule #2).
- **Hold the held frame.** Every beat ends on a still — no movement in the
  last 0.4s of each clip. The eye lands.
- **Color cuts.** Between beats, do hard color-flash cuts with the gradient
  (200ms wash) instead of fades. Reads more "spatial deck" than "slideshow."
- **Pulses on the timeline.** Pink CTA glows, "scan the QR" sparkles — all
  attached to `tl`, never standalone `gsap.to()` (GSAP rule #4). Use finite
  loops (`repeat: 36, yoyo: true`) — never `repeat: -1`.

## Composition

- 1920×1080 landscape (matches the site's natural aspect; the talks both
  show on widescreen projection).
- 30 fps.
- Single `index.html`, single `tl` exposed at
  `window.__timelines['main']`.
- Every `.scene.clip` carries `data-start` + `data-duration`.
- Hard-kill at every clip boundary:
  `tl.set(el, {opacity:0, visibility:'hidden'}, beatEnd)`.

## Asset audit (built from the live site)

| File | What it is | Used in beat |
|------|-----------|--------------|
| `capture/screenshots/scroll-000.png` | Hero / title state, golden-hour rounds | Title beat |
| `capture/assets/scenes/fs-golden-rounds.png` | Four Seasons default state | Beat 2 (scan / arrive) |
| `capture/assets/scenes/fs-night-theater.png` | Four Seasons, night reception, theater rows | Beat 3 (toggle, frame B) |
| `capture/assets/scenes/fs-noon-mingle.png` | Four Seasons, noon, mingle layout | Beat 3 (toggle, frame C) |
| `capture/assets/scenes/carol-gas.png` | Carol — gas-lamp warm | Beat 4 (story scene A) |
| `capture/assets/scenes/carol-ghost.png` | Carol — ghost-light cold | Beat 4 (story scene B) |
| `capture/assets/scenes/carol-ember.png` | Carol — dying ember | Beat 4 (story scene C) |
| `capture/assets/scenes/dnd-tavern.png` | D&D — tavern (Prancing Pony) | Beat 5 (encounter A) |
| `capture/assets/scenes/dnd-dungeon-tokens.png` | D&D — dungeon, tokens visible | Beat 5 (encounter B) |

If a scene image is missing at lint time, ship the beat as
typographic-only rather than 404 — silent black holes are worse than a
slightly thinner cut.

## Anti-patterns

- No iframes (rule #1) — only `<img>` over color washes.
- No stacked transform tweens (rule #2) — split parent/child.
- No `tl.from()` inside `.clip` — use `tl.fromTo()` (rule #3).
- No `repeat: -1` (rule #5).
- No light backgrounds. The brand is always-dark.
- No "spec marketing" phrases ("immerse," "transform," "powerful"). Let the
  spatial vibe carry. Words describe what the user *does*: scan, walk,
  toggle, share.
