# STORYBOARD — Holodeck-in-a-Pocket promo

Per-beat creative direction for the HyperFrames composition. Each beat is
one `.scene.clip` in `index.html` with explicit `data-start` and
`data-duration`. All transforms split parent/child (GSAP rule #2). Hard
kill at every boundary (`tl.set` opacity 0 + visibility hidden).

Stage: 1920 × 1080 · 30 fps · single `tl` exposed at
`window.__timelines['main']`.

## Camera grammar

The motion language is "stepping into a space." Each beat uses one of
three camera moves only:

- **Push** — slow forward camera (parent `y` drift down + child `scale`
  Ken Burns ease).
- **Hold** — locked frame, only ambient pulses on the timeline.
- **Cut** — instant transition with a 200ms gradient flash.

No fades, no slides, no parallax. The brand is decisive — the cuts should
be too.

## Beats

### Beat 1 — Title  ·  0.0 → 4.5s

**Read:** "HOLODECK / IN-A-POCKET — Scan. Walk. Toggle. Share."

**Frame:** Brand gradient ambient wash (radial pink top-left + radial
purple bottom-right) drifts slowly across the stage. Hero screenshot
(`scroll-000.png`) blurred + dimmed at 0.45 opacity behind the title.
Display headline rises from y+24 to y0 with opacity fade-in.

**Motion:** parent `.title-card` does opacity 0→1 and y+24→0 over 0.6s
(`fromTo`). Child `.title-headline` runs a 4.5s scale 1.0→1.04 Ken Burns.
Ambient pulse on the gradient: `tl.fromTo('.bg-wash',
{x:'-2%', y:'-2%'}, {x:'2%', y:'2%', duration:4.5, ease:'sine.inOut'},
beatStart)`.

**Held frame (last 0.4s):** title centered, gradient stilled.

**End:** `tl.set('.beat-title', {opacity:0, visibility:'hidden'}, 4.5)`.

### Beat 2 — Scan & arrive  ·  4.5 → 9.5s

**Read:** "Point your phone at the QR." → "Walk through the venue."

**Frame:** First half (4.5–7.0s): big phone-mock pill on the left holding
the QR code (real QR from `qr.png`). Caption right-side. Second half
(7.0–9.5s): the QR card slides off screen left, the Four Seasons golden-
hour screenshot pushes in from 1.05 → 1.0 scale on a child wrapper, parent
opacity fades 0→1. Caption updates to "Walk through the venue."

**Motion:**
- `.beat-scan .qr-card` parent: opacity 0→1 (0.4s `fromTo`), then opacity
  1→0 + x 0→-40px starting at 6.6s.
- `.beat-scan .qr-card .qr-glow` child: scale 0.96→1.04 cycling on tl
  (`fromTo`, two halves).
- `.beat-scan .fs-arrive` parent: opacity 0→1 starting at 7.0s.
- `.beat-scan .fs-arrive .fs-img` child: scale 1.05→1.0 over 2.5s.
- Caption swap: `tl.set('.cap-scan', {textContent:'Walk through the venue.'}, 7.0)`.

**Held frame:** Four Seasons golden hour at 1.0 scale, caption settled.

**End:** `tl.set('.beat-scan', {opacity:0, visibility:'hidden'}, 9.5)`.

### Beat 3 — Toggle  ·  9.5 → 14.5s

**Read:** "Toggle the design options."

**Frame:** A small UI chip ("DESIGN OPTIONS · Time of day · Floor layout")
locks top-right matching the live site's panel placement. Three Four
Seasons screenshots cut in sequence behind it: golden-rounds (9.5–11.0s) →
night-theater (11.0–12.5s) → noon-mingle (12.5–14.5s). Each cut is a
200ms gradient flash (full-stage pink-to-purple wipe) followed by an
instant hold.

**Motion:** Each scene image is its own absolutely-positioned `<img>` with
opacity 0/1 hard-set on the `tl` at the cut times. The flash element
(`.flash-bar`) animates opacity 0→0.9→0 across the 200ms cut.

```
tl.set('.fs-A', {opacity:1}, 9.5);
tl.set('.fs-A', {opacity:0}, 11.0);
tl.fromTo('.flash-bar',{opacity:0},{opacity:0.9,duration:0.1},11.0);
tl.to('.flash-bar',{opacity:0,duration:0.1},11.1);
tl.set('.fs-B', {opacity:1}, 11.0);
// ... etc.
```

**Held frame (last 0.4s):** noon-mingle, chip lit pink.

**End:** `tl.set('.beat-toggle', {opacity:0, visibility:'hidden'}, 14.5)`.

### Beat 4 — Three rooms, one engine  ·  14.5 → 19.0s

**Read:** "Three rooms. One engine."

**Frame:** Triptych of held frames, each ~1.5s, with a fast (180ms) cross-
flash between:
- 14.5–16.0s: Carol — `carol-gas.png`, label "A Christmas Carol · Stave 1"
- 16.0–17.5s: Carol — `carol-ghost.png` (same room, different lighting)
  to land the "one engine, many options" punch.
- 17.5–19.0s: D&D — `dnd-dungeon-tokens.png`, label "Stage Presence · D&D"

The display text "Three rooms. One engine." sits as a lower-third on every
sub-frame, so the cuts read as one continuous statement, not three
captions.

**Motion:** Each image opacity-cuts on the `tl`. Lower-third stays
mounted across the whole beat (no transform, just opacity 0→1 at 14.7
and 0 at 18.6). Tiny child Ken Burns on each image (parent opacity, child
scale — rule #2).

**Held frame:** D&D dungeon w/ tokens, lower-third dimming out.

**End:** `tl.set('.beat-rooms', {opacity:0, visibility:'hidden'}, 19.0)`.

### Beat 5 — End card  ·  19.0 → 22.0s

**Read:** `ibrews.github.io/holodeck-pocket` + QR + brand gradient CTA bar

**Frame:** Centered QR (`qr.png`, 360px). URL below in display weight.
"Scan. Walk. Toggle. Share." appears as a small caption above the QR.
Pink-to-purple gradient bar at top of stage (matches the AL CTA pill
language, just stretched). Soft pink glow pulse around the QR (finite
loop, repeat: 6, yoyo).

**Motion:**
- `.endcard-qr` parent: opacity 0→1 + y+18→0 (0.5s `fromTo`).
- `.endcard-qr .qr-aura` child: scale 0.97→1.03 finite loop
  (`fromTo`, repeat 6, yoyo true) — ambient pulse on `tl`.
- `.endcard-url` parent: opacity 0→1 (0.5s, lagged 0.2s after QR).
- Gradient bar: drift x -8px → +8px over 3s (parent translation only).

**Held frame (last 0.6s):** all text and QR locked, only the aura pulse
breathing.

**End:** total t = 22.0. Final `tl.set('.beat-end', {opacity:1}, 21.4)`
keeps the end card visible to the absolute last frame.

## Asset audit

| Asset | Resolution | Used in beat | Required? |
|-------|-----------|--------------|-----------|
| `capture/screenshots/scroll-000.png` | 1920×1080 | Beat 1 (bg) | yes |
| `capture/assets/scenes/fs-golden-rounds.png` | 1920×1080 | Beat 2, Beat 3a | yes |
| `capture/assets/scenes/fs-night-theater.png` | 1920×1080 | Beat 3b | yes |
| `capture/assets/scenes/fs-noon-mingle.png` | 1920×1080 | Beat 3c | yes |
| `capture/assets/scenes/carol-gas.png` | 1920×1080 | Beat 4a | yes |
| `capture/assets/scenes/carol-ghost.png` | 1920×1080 | Beat 4b | yes |
| `capture/assets/scenes/dnd-dungeon-tokens.png` | 1920×1080 | Beat 4c | yes |
| `capture/assets/scenes/qr.png` | 396×396 | Beat 2, Beat 5 | yes |

## GSAP rule audit (ship blockers)

- [ ] No iframes
- [ ] No stacked transform tweens on one element (parent y/opacity, child scale)
- [ ] `tl.fromTo()` on every entrance inside a `.clip`
- [ ] All ambient pulses on the seekable `tl`, never standalone `gsap.to()`
- [ ] No `repeat: -1` (use finite e.g. `repeat: 6, yoyo: true`)
- [ ] Single `index.html`, single `tl` at `window.__timelines['main']`
- [ ] Every `.scene.clip` has `data-start` + `data-duration`
- [ ] Hard-kill `tl.set(el, {opacity:0, visibility:'hidden'})` at every beat boundary
