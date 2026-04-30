# REVIEW_NEEDED

Items that need human decision before this demo can ship to a live URL.

## 5. Wiki initialization — needs one click (30 seconds)

**Status:** ⚠️ action required

GitHub wiki repos aren't created until the first page is saved via the web UI. Automated git push is blocked until then.

**What to do:**
1. Go to https://github.com/ibrews/holodeck-pocket/wiki
2. Click **"Create the first page"**
3. Leave title as **"Home"**, add any content, click **"Save Page"**

After that, Session 08 can clone the wiki repo and push 6 fully-written pages that are already on disk at `~/git/holodeck-pocket-wiki/`:
- `Home.md`, `Architecture.md`, `Adding-a-Scene.md`, `Models-and-Licenses.md`, `For-Talk-Presenters.md`, `FAQ.md`

To push the wiki (run this once after clicking above):
```bash
cd ~/git && git clone https://github.com/ibrews/holodeck-pocket.wiki.git holodeck-pocket-wiki-push
cp ~/git/holodeck-pocket-wiki/*.md ~/git/holodeck-pocket-wiki-push/
cd ~/git/holodeck-pocket-wiki-push && git add . && git commit -m "feat(wiki): initial 6-page wiki" && git push
```

---

## 1. GitHub Pages is blocked by the plan on a private repo

**Status:** ⚠️ blocker for the live demo URL

The repo is private (per the safeguards in the briefing — must stay private until after May 13). Attempting to enable Pages via the API returns:

> Your current plan does not support GitHub Pages for this repository. (HTTP 422)

The `ibrews` user account does not have GitHub Pro (which is required for Pages on private repos).

The CI workflow at `.github/workflows/deploy.yml` is in place and will auto-deploy on push to `main`, **as soon as Pages is enabled**.

### Options for human decision

| Option | Pros | Cons |
|--------|------|------|
| **A. Upgrade `ibrews` to GitHub Pro** ($4/mo) | Repo stays private, Pages works, no architectural change | Recurring cost |
| **B. Flip repo public after FMX (post-May 7)** | Free, simplest path | Repo public during the May 13 NXT BLD window — competitive surprise risk |
| **C. Cloudflare Pages + custom subdomain** | Free, repo stays private | Needs CF account + token setup; no CLI present locally |
| **D. Static upload to a CDN of choice** | Flexible | Manual; loses CI auto-deploy |

The briefing's primary instruction was "Default to GitHub Pages" with Cloudflare Pages as the simpler-when-needed fallback. Recommend **A** if recurring cost is acceptable, otherwise **C**.

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
