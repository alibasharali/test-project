---
item: 3
type: feature
title: "Decrement button"
status: approved
branch: claude/3-decrement-button
---

# Decrement button

## Problem

The front page counter (item 2) can only go up. After this ships, a visitor sees a "Decrement" button next to the "Increment" button, and each click lowers the counter by 1.

## Domain decisions

- **D1 – Placement:** the "Decrement" button sits directly next to "Increment", before the count: `[Decrement] [Increment] count`. *Why:* the item says "next to the increment button".
- **D2 – Same state:** both buttons act on the one existing client-side count; nothing is persisted and a reload shows 0 (item 2 D1, D2). *Why:* the item asks only for a button.
- **D3 – Negative values allowed:** the count may go below 0 (0 then Decrement shows "-1"). *Why:* the item states no floor; the simplest reading wins. Alternative (clamp at 0) is deferred, see Open questions.
- **D4 – Pure step logic:** `decrement(n) = n - 1` lives in `src/lib/counter.ts` beside `increment`; the button is added in `counter-button.tsx`. *Why:* keeps logic unit-testable (CLAUDE.md).
- **D5 – Existing behaviour kept:** the Increment button, hello world copy and `/api/health` are unchanged.

## Acceptance criteria

- **AC1 – Button present:** Given the app is running, when GET `/`, then the server-rendered HTML contains buttons labelled "Decrement" and "Increment" and a counter showing "0", with Decrement before Increment.
- **AC2 – Decrement:** Given `/` is loaded and the counter shows "0", when Decrement is clicked once, then the counter shows "-1"; after three clicks it shows "-3".
- **AC3 – Mixed use:** Given the counter shows "0", when Increment is clicked twice then Decrement once, then the counter shows "1".
- **AC4 – Existing page intact:** when GET `/`, then the HTML still contains "Hello world" and "This webpage is working."; GET `/api/health` still returns 200 with `{ ok: true, ... }`.

## Slices

1. **S1 – Decrement:** add the pure `decrement` function, the "Decrement" button in `Counter` next to "Increment". Satisfies AC1, AC2, AC3, AC4.

## Test seams and verification

| AC | Test seam | How to verify on the running app |
|---|---|---|
| AC1 | `renderToStaticMarkup` of `HomePage` in vitest | `curl /`, grep for both labels and the 0 |
| AC2 | unit test of `decrement` | browser: click Decrement, read counter |
| AC3 | unit test composing `increment` and `decrement` | browser: click Increment x2, Decrement x1 |
| AC4 | existing `home.test.ts` and `health.test.ts` | `curl /` and `curl /api/health` |

## Data and migrations

None.

## Out of scope

- Persisting the count, a reset button, styling polish, a minimum or maximum value.

## Open questions

- Should the count be clamped at 0? (deferred: spec assumes negatives are allowed, D3.)
