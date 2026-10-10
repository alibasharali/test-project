---
item: 1
type: feature
title: "v1: Hello world front page"
status: draft
branch: claude/1-hello-world
---

# v1: Hello world front page

## Problem

The factory needs proof that a project it created builds, deploys and serves a page. After this ships, the front page at `/` says plainly that the webpage is working.

## Domain decisions

- **D1 – Single static page:** `/` renders a heading "Hello world" and the line "This webpage is working." *Why:* the item asks for just a simple front page. Recommended wording; developer may change it.
- **D2 – No data, no new routes:** the page does not touch D1 or add routes; `/api/health` stays as is. *Why:* keeps the smoke test minimal.
- **D3 – Replaces the placeholder:** the existing scaffold copy in `src/routes/index.tsx` is removed. Styling uses existing Tailwind tokens.

## Acceptance criteria

- **AC1 – Page renders:** Given the app is running, when GET `/`, then the response is 200 and the server-rendered HTML contains "Hello world" and "This webpage is working."
- **AC2 – Placeholder gone:** Given the app is running, when GET `/`, then the HTML does not contain "v1 is on its way".
- **AC3 – Health unchanged:** when GET `/api/health`, then 200 with `{ ok: true, ... }`.

## Slices

1. **S1 – Front page:** replace the placeholder route content with the hello world heading and line. Satisfies AC1, AC2, AC3.

## Test seams and verification

| AC | Test seam | How to verify on the running app |
|---|---|---|
| AC1 | route component render (keep copy in a pure constant under `src/lib/` if needed for vitest) | `curl /` and grep for both strings |
| AC2 | same | `curl /` and grep returns nothing |
| AC3 | existing `health.test.ts` | `curl /api/health` |

## Data and migrations

None.

## Out of scope

- Navigation, additional pages, auth, database use, design polish.

## Open questions

- Exact wording of the heading and line (deferred: using the recommendation in D1 unless the developer says otherwise).
