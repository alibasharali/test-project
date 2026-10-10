---
item: <n>
type: feature | bug | chore
title: <item title>
status: draft
branch: claude/<n>-<slug>
---

# <title>

## Problem

<Two to four sentences: who has the problem, and what is true after this ships.>

## Domain decisions

- **D1 – <name>:** <the rule>. *Why:* <reason, including alternatives the developer rejected>.

## Acceptance criteria

- **AC1 – <name>:** Given <state>, when <action>, then <observable result, with concrete values>.

## Slices

Build in this order. Each slice is vertical and ends with green checks.

1. **S1 – <name>:** <behaviour end to end>. Satisfies AC1, AC2.

## Test seams and verification

| AC | Test seam | How to verify on the running app |
|---|---|---|
| AC1 | <unit / server function / route / e2e> | <page + steps, or request + expected response> |

## Data and migrations

<New tables, fields and migrations, and what happens to existing rows. "None" is a valid answer.>

## Out of scope

- <What this item deliberately does not do>

## Open questions

<Empty before approval, or each item marked "deferred".>
