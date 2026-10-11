---
item: 4
type: feature
title: "Multiply button"
status: approved
branch: claude/4-double-button
---

# Multiply button

## Problem

The front page counter (items 2, 3) can only step by 1. After this ships, a visitor sees a "Double" button next to "Decrement" and "Increment", and each click doubles the displayed number.

## Domain decisions

- **D1 – Label:** the button is labelled "Double" (the item body says "Double button"; the title says "Multiply"). *Why:* the body is the more specific wording.
- **D2 – Placement:** `[Decrement] [Increment] [Double] count`. *Why:* the new button follows the existing ones, before the count.
- **D3 – Same state:** acts on the one client-side count; nothing is persisted, a reload shows 0.
- **D4 – Zero and negatives:** `double(n) = n * 2`, so 0 stays 0 and -3 becomes -6. *Why:* simplest reading; no floor was stated (consistent with item 3 D3).
- **D5 – Pure step logic:** `double` lives in `src/lib/counter.ts` beside `increment` and `decrement`; the button is added in `counter-button.tsx`. *Why:* keeps logic unit-testable (CLAUDE.md).
- **D6 – Existing behaviour kept:** Increment, Decrement, hello world copy and `/api/health` are unchanged.

## Acceptance criteria

- **AC1 – Button present:** Given the app is running, when GET `/`, then the server-rendered HTML contains buttons labelled "Decrement", "Increment" and "Double" in that order, and a counter showing "0".
- **AC2 – Double:** Given the counter shows "1", when Double is clicked, then it shows "2"; after two more clicks it shows "8".
- **AC3 – Zero stays zero:** Given the counter shows "0", when Double is clicked, then it shows "0".
- **AC4 – Mixed use:** Given the counter shows "0", when Increment is clicked three times then Double once, then the counter shows "6".
- **AC5 – Existing page intact:** when GET `/`, the HTML still contains "Hello world" and "This webpage is working."; GET `/api/health` returns 200 with `{ ok: true, ... }`.

## Slices

1. **S1 – Double:** add the pure `double` function and the "Double" button in `Counter`. Satisfies AC1, AC2, AC3, AC4, AC5.

## Test seams and verification

| AC | Test seam | How to verify on the running app |
|---|---|---|
| AC1 | `renderToStaticMarkup` of `HomePage` in vitest | `curl /`, grep for the three labels and the 0 |
| AC2 | unit test of `double` | browser: Increment once, click Double x3, read counter |
| AC3 | unit test of `double(0)` | browser: click Double at 0 |
| AC4 | unit test composing `increment` and `double` | browser: Increment x3, Double x1 |
| AC5 | existing `home.test.ts` and `health.test.ts` | `curl /` and `curl /api/health` |

## Data and migrations

None.

## Out of scope

- Persisting the count, a reset button, styling polish, min/max values, overflow handling.

## Open questions

- Label "Double" vs "Multiply"? (deferred: spec assumes "Double", D1.)
