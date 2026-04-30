# REVIEW_NEEDED

Items that need human decision before this demo can ship to a live URL.

## ✅ RESOLVED — items 1 and 5

- **#1 GitHub Pages blocker** — RESOLVED 2026-04-30. Repo flipped from private → public to enable Pages without paying for Pro. Live at https://ibrews.github.io/holodeck-pocket/. Decision logged in `_logs/03-irreversible-actions.md`. If re-private is wanted before NXT BLD (May 13), the documented fallback is Cloudflare Pages + custom subdomain on agilelens.com.
- **#5 Wiki initialization** — RESOLVED 2026-04-30. Wiki was initialized via the web UI and the 6 pages (Home, Architecture, Adding-a-Scene, Models-and-Licenses, For-Talk-Presenters, FAQ) are live at https://github.com/ibrews/holodeck-pocket/wiki. There's a stale `Home.asciidoc` from the init click that should be deleted (manual or scripted).

---

## 6. CC-BY visible attribution (legal exposure on a public site)

**Status:** ⚠️ open

`LICENSES.md` documents the 3 CC-BY 4.0 model authors (`i.we.d`, `anandyuvraj409`, `Vallarasu.Valla`). But CC-BY 4.0 §3.a.1.A requires attribution be presented "in any reasonable manner based on the medium." For a 3D model rendered in a web app, "reasonable" generally means a credits surface visible to end users — not just a separate file in the repo.

The deployed page currently has no attribution UI. End users walking through the dungeon scene never see `anandyuvraj409`.

**Smallest fix:** add a `Credits` button in the HUD that opens a dialog listing each model + author + license + Sketchfab link. Or a `<footer>` with the same. ~30 minutes work.

## 7. Stale wiki Models-and-Licenses page

The wiki page at `Models-and-Licenses.md` says `Author: see Sketchfab page` for all three CC-BY models instead of naming the actual handles. Fill in `i.we.d`, `anandyuvraj409`, `Vallarasu.Valla`, `Kirill Sannikov` to match `LICENSES.md`.

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
