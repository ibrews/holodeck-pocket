# Asset descriptions

Original capture (from `npx hyperframes capture`) returned only 1 hero
screenshot — Babylon.js single-viewport apps capture as one screen. We
augmented manually via `scripts/grab-scenes.mjs` (puppeteer, visible
Chrome, 1920×1080, deterministic option-select changes per scene).

## Hero

| File | What it is |
|------|------------|
| `capture/screenshots/scroll-000.png` | Live URL hero state — golden hour, rounds layout |

## Per-scene / per-option (1920×1080 each)

| File | Scene | Options |
|------|-------|---------|
| `capture/assets/scenes/fs-golden-rounds.png` | Four Seasons Lake Austin | Time of day = Golden hour, Floor layout = Rounds (banquet) |
| `capture/assets/scenes/fs-night-theater.png` | Four Seasons Lake Austin | Time of day = Night reception, Floor layout = Theater rows |
| `capture/assets/scenes/fs-noon-mingle.png` | Four Seasons Lake Austin | Time of day = Noon (clear), Floor layout = Open mingle |
| `capture/assets/scenes/carol-gas.png` | A Christmas Carol — Stave 1 | Lighting = Gas-lamp (warm) |
| `capture/assets/scenes/carol-ghost.png` | A Christmas Carol — Stave 1 | Lighting = Ghost-light (cold blue) |
| `capture/assets/scenes/carol-ember.png` | A Christmas Carol — Stave 1 | Lighting = Dying ember |
| `capture/assets/scenes/dnd-tavern.png` | Stage Presence · D&D Encounter | Room = The Prancing Pony, Tokens = Hidden |
| `capture/assets/scenes/dnd-dungeon-tokens.png` | Stage Presence · D&D Encounter | Room = Dungeon (combat), Tokens = Visible |

## Share

| File | What it is |
|------|------------|
| `capture/assets/scenes/qr.png` | QR code for `https://ibrews.github.io/holodeck-pocket/` (raster) |
| `capture/assets/scenes/qr.svg` | Same QR (vector) |

## Notes

- All scenes are placeholders today (brand-color blocks, "Real venue model
  loads in the live demo" badge). The promo leans into that — placeholder
  geometry plus the option-toggle UX is the punchline.
- Each option-toggle pair (e.g. golden→night, gas→ghost→ember,
  tavern→dungeon) reads as two cuts in the same room. Use that for the
  "toggle" beat.
