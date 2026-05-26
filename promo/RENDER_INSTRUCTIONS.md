# Render instructions

This V1 ships **lint-clean only** — no MP4. Follow the steps below to
render to MP4 yourself when ready.

## Prereqs

- Node 18+ (`npx hyperframes` will fetch the CLI on first run).
- `git-lfs` installed and initialized (one-time):
  ```bash
  brew install git-lfs && git lfs install
  ```
- ~2 GB free disk for Chrome cache + intermediate frames.

## Verify the composition is still lint-clean

From this directory:

```bash
npx hyperframes lint
```

Expected: `0 error(s), 2 warning(s)`. The two warnings are
`composition_file_too_large` and `timeline_track_too_dense` — both
intentional per
`~/knowledge/intelligence/techniques/hyperframes-from-website.md` rule
#6 (single inline `index.html`, all beats on one timeline). Don't try to
"fix" them by splitting into sub-compositions — that will reintroduce
`root_composition_missing_data_start` errors.

## Quick visual sanity check (optional)

```bash
npx hyperframes snapshot --at 0.5,5.0,7.5,10.5,12.5,15.5,17.5,21.0
open snapshots/
```

Eight key frames land in `snapshots/`. If a beat is dead-black, an asset
under `assets/` is missing.

## Render to MP4

```bash
npx hyperframes render
```

Defaults: 1920×1080, 30 fps, ~660 frames, 6 puppeteer workers. Wall time
on alex-mbp (M1 Max) is roughly 1:30 for this 22-second composition.

Output lands at `out/<id>.mp4`.

### Variants

```bash
# 1080×1920 vertical (Instagram Reels / TikTok)
npx hyperframes render --width 1080 --height 1920

# 60 fps for smoother projection
npx hyperframes render --fps 60

# Higher quality, single worker (slower but more reliable):
npx hyperframes render --workers 1 --quality high
```

See `npx hyperframes render --help` for the full flag list.

## Expected console noise

Per the KB note: ~6 `Failed to load resource: 404` lines during render
are cosmetic — Chromium probing for missing `woff2` / favicon variants.
Fonts and assets still resolve correctly.

## Adding audio later

This V1 is silent. To add a music bed:

1. Drop an audio file at `assets/track.wav` (or `.mp3`).
2. In `index.html`, just inside `<body>`, add:
   ```html
   <audio src="assets/track.wav"
          data-start="0" data-duration="22"
          data-track-index="0" data-volume="0.6"></audio>
   ```
3. Re-run `npx hyperframes lint` then `npx hyperframes render`.

For VO (text-to-speech), see
`~/.claude/skills/website-to-hyperframes/references/step-5-vo.md` —
intentionally skipped in V1 per `SCRIPT.md`.

## Spot-checking the rendered MP4

```bash
ffprobe -v error -show_entries stream=codec_name,width,height,duration out/holodeck-pocket-promo.mp4
for t in 0.5 5 12 16 21; do
  ffmpeg -y -ss $t -i out/holodeck-pocket-promo.mp4 -frames:v 1 -update 1 /tmp/frame_${t}.jpg
done
open /tmp/frame_*.jpg
```

If a beat is wrong, fix the `.html` and re-render — never edit the MP4.

## Where to put the output

The talks live on:

- **NXT BLD 2026** (Alex + Jun, May 13, London) — embed the MP4 inline in
  the deck's "How we ship" slide.
- **FMX 2026** (Alex curating Spatial Storytelling track) — use as the
  introductory video for the "scan & walk" demo segment.

For redistribution outside the talks, drop the MP4 into the holodeck-
pocket repo's `promo/holodeck-pocket-promo.mp4` and tag a README link.
