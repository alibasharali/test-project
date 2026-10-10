---
item: 2
type: feature
title: "Add increment button that increments a counter"
status: approved
branch: claude/2-increment-counter
---

# Add increment button that increments a counter

## Problem

The front page is static. After this ships, a visitor sees an "Increment" button with a counter beside it that starts at 0 and goes up by 1 on every click.

## Domain decisions

- **D1 – Client-only state:** the count lives in React component state on the front page; nothing is persisted. *Why:* the item asks only for a button and a counter. Recommended; persistence (D1 database, localStorage) is out of scope.
- **D2 – Resets on reload:** a page reload shows 0 again. *Why:* follows from D1.
- **D3 – Placement:** the button and counter sit on `/` below the existing hello world copy, side by side, button first and the count to its right. *Why:* "a counter on the side".
- **D4 – Pure step logic:** the increment rule (`n -> n + 1`) lives in `src/lib/counter.ts` and the UI in a `Counter` component under `src/lib/`. *Why:* keeps routes thin and logic unit-testable (CLAUDE.md).
- **D5 – Existing copy kept:** the hello world heading and line stay unchanged so item 1's behaviour is preserved.

## Acceptance criteria

- **AC1 – Initial state:** Given the app is running, when GET `/`, then the server-rendered HTML contains a button labelled "Increment" and a counter showing "0".
- **AC2 – Increment:** Given `/` is loaded in a browser, when the button is clicked once, then the counter shows "1"; after three clicks in total it shows "3".
- **AC3 – Reload resets:** Given the counter shows "3", when the page is reloaded, then it shows "0".
- **AC4 – Existing page intact:** when GET `/`, then the HTML still contains "Hello world" and "This webpage is working."; GET `/api/health` still returns 200 with `{ ok: true, ... }`.

## Slices

1. **S1 – Counter:** add the pure increment function, the `Counter` component (button "Increment" plus count display, starting at 0), and render it in `HomePage`. Satisfies AC1, AC2, AC3, AC4.

## Test seams and verification

| AC | Test seam | How to verify on the running app |
|---|---|---|
| AC1 | `renderToStaticMarkup` of `HomePage` in vitest | `curl /` and grep for "Increment" and the 0 |
| AC2 | unit test of the increment function; component click test if a DOM test environment is available, otherwise browser check | browser: click button, read counter |
| AC3 | follows from D1; browser check | browser: click, reload, read counter |
| AC4 | existing `home.test.ts` and `health.test.ts` | `curl /` and `curl /api/health` |

## Data and migrations

None.

## Out of scope

- Persisting the count, decrement or reset buttons, per-user counts, styling polish.

## Open questions

- Exact layout and label wording (deferred: using the recommendations in D3 and AC1 unless the developer says otherwise).
