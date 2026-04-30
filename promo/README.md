# promo/ — Holodeck-in-a-Pocket HyperFrames video

A 22-second 1920×1080 HyperFrames composition that turns this WebXR demo
into a **lint-clean, ready-to-render** marketing/intro video.

Plays at NXT BLD 2026 (May 13, London) and FMX 2026.

## What's here

| File | What it is |
|------|------------|
| `index.html` | Single-file composition (5 beats, GSAP timeline, registered at `window.__timelines["main"]`) |
| `DESIGN.md` | Brand cheat sheet (palette, type, motion language) |
| `SCRIPT.md` | 22.0s narration backbone — TTS skipped, on-screen text only |
| `STORYBOARD.md` | Per-beat creative direction + asset audit |
| `RENDER_INSTRUCTIONS.md` | How to render to MP4 yourself |
| `hyperframes.json` / `meta.json` | HyperFrames project config |
| `assets/` | 1920×1080 scene screenshots + QR code, used by `index.html` |
| `capture/` | Original `npx hyperframes capture` output for traceability |
| `scripts/grab-scenes.mjs` | Headless puppeteer script that grabbed each scene/option state |
| `lint-output.txt` | Latest `npx hyperframes lint` output |

## Things to Try

1. **Lint it.** `cd promo && npx hyperframes lint` — should report
   `0 error(s), 2 warning(s)`. The two warnings are intentional
   (single-file composition by policy).
2. **Snapshot it.** `npx hyperframes snapshot --at 0.5,5.0,7.5,10.5,12.5,15.5,17.5,21.0`
   — drops 8 PNGs in `snapshots/` so you can eyeball every beat without rendering.
3. **Preview it interactively.** `npx hyperframes preview` — opens the
   HyperFrames Studio with the timeline scrubbable in your browser.
4. **Render it to MP4.** `npx hyperframes render` — ~1:30 wall time on an
   M1 Max. Output lands at `out/holodeck-pocket-promo.mp4`.
5. **Re-grab the scene screenshots.** If `index.html` needs updated
   visuals (e.g. after Session 08 lands real venue models), run
   `node scripts/grab-scenes.mjs` against the live URL — visible Chrome,
   8 deterministic 1920×1080 captures.

## V1 status

- Lint: 0 errors / 2 warnings (single-file composition by policy)
- Render: NOT performed in this branch — see `RENDER_INSTRUCTIONS.md`
- Audio: silent (TTS deliberately skipped per `SCRIPT.md`)

## How it was built

This was authored using the
`heygen-com/hyperframes@website-to-hyperframes` skill against the live
GitHub Pages URL, with the 7 GSAP rules from
`~/knowledge/intelligence/techniques/hyperframes-from-website.md`
inlined. Babylon.js single-viewport apps capture as one screen, so
`scripts/grab-scenes.mjs` was used to drive the live site through every
scene + option-toggle state and screenshot each.

## Re-rendering after Session 08 lands real venue models

Once `public/models/<slug>/` ships real GLB venue exports, re-run
`scripts/grab-scenes.mjs` from this directory — it'll capture the new
geometry. Then `npx hyperframes lint` and `npx hyperframes render`. No
edits to `index.html` should be needed.
