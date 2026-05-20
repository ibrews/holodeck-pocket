# REVIEW_NEEDED

Items that need human decision before this demo can ship to a live URL.

## ✅ RESOLVED — items 1, 5, 6, and 7

- **#1 GitHub Pages blocker** — RESOLVED 2026-04-30. Repo flipped from private → public to enable Pages without paying for Pro. Live at https://ibrews.github.io/holodeck-pocket/. Decision logged in `_logs/03-irreversible-actions.md`. If re-private is wanted before NXT BLD (May 13), the documented fallback is Cloudflare Pages + custom subdomain on agilelens.com.
- **#5 Wiki initialization** — RESOLVED 2026-04-30. Wiki was initialized via the web UI and the 6 pages (Home, Architecture, Adding-a-Scene, Models-and-Licenses, For-Talk-Presenters, FAQ) are live at https://github.com/ibrews/holodeck-pocket/wiki. There's a stale `Home.asciidoc` from the init click that should be deleted (manual or scripted).
- **#6 CC-BY visible attribution** — RESOLVED 2026-05-20. Credits modal added to `index.html` and `styles.css` with all three CC-BY 4.0 models attributed (`i.we.d`, `anandyuvraj409`, `Vallarasu.Valla`) with Sketchfab links. CC0 bedroom (Kirill Sannikov/Polyhaven) correctly excluded. A Credits button in the HUD opens the dialog — visible to all end users.
- **#7 Stale wiki Models-and-Licenses page** — RESOLVED 2026-05-20. Wiki page updated with actual Sketchfab handles: `i.we.d`, `anandyuvraj409`, `Vallarasu.Valla` for CC-BY 4.0 models; `Kirill Sannikov` (Polyhaven) for the CC0 bedroom asset — all now match `LICENSES.md`.

---

## 2. Real venue / set models

All current geometry is brand-color placeholders. Before either talk:
- **Four Seasons Lake Austin** — port a Datasmith/GLB venue export (target ≤8 MB after Draco compression).
- **Carol Stave 1** — port the bedroom set from the Christmas Carol VR build (FBX → GLB).
- **D&D encounter** — tavern + dungeon from the Stage Presence build.

Drop files under `public/models/<slug>/` and load with `SceneLoader.ImportMeshAsync` in each scene module.

## 3. iPhone Safari + Quest browser verification

Cannot run autonomously from this batch session — both require physical hardware. Once the deploy URL is live, verify on each and add screenshots to `verification/`.

## 4. screencap.gif

The README references a `screencap.gif` 5–10s loop. Not generated yet — needs a recording of someone interacting with one scene on a phone. Add once a phone-tested deploy is live.
