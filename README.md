# Tal Pin Drop — "0 → 500 Hiring Managers"

10s social ad: a counter races 0→500 over the Bangalore skyline while 24
company-logo map pins drop in, each one triggered by the counter crossing
its threshold. Lands on 500+, pin wave, tal lockup + store badges, hold.

## Compositions

| id | size | note |
|---|---|---|
| `TalPinDrop` | 1080×1080 | the master |
| `TalPinDrop-9x16` | 1080×1920 | same component, badges under counter |
| `TalPinDrop-16x9` | 1920×1080 | same component, badges bottom-right |

## Render

```bash
npx remotion render TalPinDrop out/tal.mp4 --crf=17
npx remotion still TalPinDrop out/poster.png --frame=299
```

City variants (needs `public/bg/skyline-<city>.png`):

```bash
npx remotion render TalPinDrop out/tal-pune.mp4 --props='{"city":"Pune","targetCount":500,"role":"Hiring Managers"}'
```

## How the pin↔counter sync works

`src/lib/dropFrames.ts` is the single source of truth for the counter value
(`countAtFrame`). `getDropStartFrames` inverts the counter easing by a
forward scan: pin *i* starts dropping at the first frame where
`floor(count / (targetCount/24)) > i`. Both `Counter.tsx` and `PinField.tsx`
read from it, so "pins on screen === floor(count/20.83)" holds by
construction. Verified across all 300 frames.

## Editing pins

`src/data/pins.ts` — hand-placed, normalised to the square background
(x, y = pin TIP). `depth` sets the base scale + z-order, `size` is a per-pin
multiplier (0.7–1.3) that breaks the depth gradient so sizes read organic.
Keep heads out of top 34% (headline/counter), bottom-left x<26% y>82%
(wordmark), and centre x 30–70% y 30–42% (badges).

## Gotchas

- Remotion 4.0.4xx requires **zod 4.4.3 exactly** (not zod 3).
- Composition ids can't contain underscores (`TalPinDrop-9x16`, not `_`).
- Logos are square PNGs with white/solid backgrounds — fine because they sit
  in a white circular pin head. `sarvam-apple.png` in the Remotion Tal
  project is a saved HTML error page, not an image — don't reuse it.
- tal wordmark is black-on-transparent (`brand/tal-mark.png`), tinted cream
  at runtime via CSS `mask-image`.
- Renders are byte-identical across runs (seeded `random()` only — verified).
