# SCRIPT — Holodeck-in-a-Pocket promo

**Format:** launch teaser
**Target length:** 22.0s
**Aspect:** 1920×1080
**Beats:** 4 (+ end card = 5)

## Format frame

The audience this video plays for is people watching a *live* talk —
NXT BLD 2026 (Alex + Jun) and FMX 2026 (Alex curating). The video on the
slide should narrate what they're about to *do* with their phone:
**scan, walk, toggle, share**. No marketing voice. Let the spatial vibe
carry it.

## TTS / VO — skipped

Per `~/knowledge/intelligence/techniques/hyperframes-from-website.md`:
> VO/TTS — *skippable if target is lint-clean only, not final render*.

This V1 ships **silent + on-screen text only**. Beat durations come from
on-screen-text word-counts × ~150wpm + breath, not TTS timestamps. Audio
can be muxed in by the user post-render if a finished version is wanted.

## Beats

Word counts are *display* counts (what the eye reads on screen), not VO.
Each beat ends with a held frame in the last ~0.4s.

| # | t (s) | dur (s) | Display text | Visual key |
|---|-------|---------|--------------|------------|
| 1 | 0.0 → 4.5 | 4.5 | "HOLODECK / IN-A-POCKET" + "Scan. Walk. Toggle. Share." | Title + brand gradient wash, hero screenshot fades in behind |
| 2 | 4.5 → 9.5 | 5.0 | "Point your phone at the QR." → "Walk through the venue." | Phone-frame mock holding QR, then fly-into Four Seasons screenshot |
| 3 | 9.5 → 14.5 | 5.0 | "Toggle the design options." | FS golden→night→noon hard cuts; "Time of day · Floor layout" caption |
| 4 | 14.5 → 19.0 | 4.5 | "Three rooms. One engine." | Carol gas→ghost→ember + D&D tavern→dungeon stack |
| 5 | 19.0 → 22.0 | 3.0 | "ibrews.github.io/holodeck-pocket" + QR | End card, gradient bar, brand pink CTA chip |

Total: **22.0 s**.

## Voice (text-only)

- **Imperatives, not adjectives.** "Scan." "Walk." "Toggle." Not "immerse."
- **Specific over abstract.** "Time of day · Floor layout" reads better than
  "explore lighting variations."
- **Lowercase URL on the end card.** Matches the AL site treatment.

## Source-derived copy (verbatim from the live site)

- "HOLODECK · POCKET" (top-left wordmark)
- "Four Seasons Lake Austin" / "A Christmas Carol · Stave 1" /
  "Stage Presence · D&D Encounter" (scene buttons)
- "Design options" / "Time of day" / "Floor layout" (option panel)
- "Placeholder mode. Real venue model loads in the live demo."
- "drag to look"

The promo does **not** reuse "Placeholder mode" — for the talks, the
placeholder framing is a behind-the-scenes note, not a tagline.

## Acceptance

- Reads cleanly muted in a 1080p projector at the back of a 200-seat hall.
- Each beat answers a question without a voice-over: *what do I do? what do
  I see? what's special?*
- Final frame holds the URL + QR for ≥ 1.5s so a phone in the audience
  can scan it from the slide if they want.
