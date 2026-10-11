---
name: lesson
description: Turn a correction into a lasting guardrail in the repo, or into a change for the factory (its stack registry or its kit), so future agents learn it. Use when the user corrects you ("no, we do X", "you forgot Y", "why did you do Z?"), when a hook, check or review caught your mistake, or when asked to remember something about this codebase.
---

# Lesson

A lesson is only learned once it's in the repo, where every future session reads it. Personal memory doesn't reach cloud sessions.

## 1. Name the mistake

One sentence on what you did, one on what you should have done. If you can't state both, ask.

## 2. Test it

Would a **fresh** agent, with only what's in the repo, make the same mistake? Check `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, `.claude/rules/`, `docs/adr/`, `docs/agents/` and the skills.

| Verdict | Next |
|---|---|
| **Not covered anywhere** | step 3 |
| **Covered, but missed** | sharpen the existing line (front-load the key word, state it positively) rather than adding a second one |
| **About the workflow itself** (skills, hooks, `docs/agents/`, settings) | `kit_feedback(text)`: these files are managed by the factory's kit and get overwritten on update, so the fix belongs there. Don't edit them here |
| **About a stack, true in any repo using it** (a framework's trap, a platform limit, a missing guideline or skill; `docs/agents/stack.md` and `.claude/skills/` from stacks are overwritten on update) | `get_stack(id)`, then `propose_stack_change(N, summary, files)` with the corrected guideline or a new skill. Fix this repo too if it needs it now |
| **One-off** | no change; tell the user why |
| **Personal preference** | suggest a line for their `~/.claude/CLAUDE.md`; keep it out of the repo |

## 3. Pick the home

The strongest that fits. A check beats a rule, because it doesn't depend on anyone reading it.

| The mistake | Home |
|---|---|
| it can be checked in code | a test at its seam, or a step in `.claude/check.sh` |
| a convention for one area | a line in `.claude/rules/<area>.md` |
| a convention for the whole repo | one line in the repo's instructions (`AGENTS.md` where it holds them, otherwise `CLAUDE.md`) |
| a domain term misunderstood | `CONTEXT.md` |
| why a pattern exists, or a rejected alternative | an ADR in `docs/adr/` |

## 4. Make the change and prove it

- One source of truth: edit the existing line where there is one.
- A test must go **red** on the mistake before it goes green. Show both.
- Short, positive wording.

## 5. Land it

- **On an item branch:** commit `chore(lesson): <what>`. `ship` lists these in the PR.
- **Anywhere else:** tell the developer, and suggest it as a chore item with `create_item`.

Done when the change is committed (or the feedback or stack proposal sent) and you've told the developer where the lesson landed.
