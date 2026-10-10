# Workflow: from item to prod

How every change in this repo is made. Managed by Software Factory's agent kit (`.claude/kit-version`); don't edit this file here, changes are overwritten by the next kit update. Project-specific rules belong in `CLAUDE.md` and `.claude/rules/`.

## Overview

```
Backlog → Spec → Ready to build → In progress → In review → On dev → In prod
          grill   you approve      slices+TDD    PR→develop   merged   release merged
```

Work items live on the project's board in **Software Factory**, not in GitHub Issues. Agents reach the factory through the `factory` MCP server (`.mcp.json`).

| Column | Meaning | Who moves it |
|---|---|---|
| Backlog | item exists, no work started | — |
| Spec | agent is grilling the developer and writing the spec | agent |
| Ready to build | the developer approved the spec in the session | agent, on the developer's word |
| In progress | slices being implemented | agent |
| In review | PR to `develop` open; CI and Claude review running | factory, when the agent opens the PR |
| On dev | PR merged into `develop` and deployed to dev | factory (GitHub webhook) |
| In prod | release PR merged into `main` and deployed | factory (GitHub webhook) |

Item types: **feature** runs the full flow. **bug** and **chore** get a short spec with no grilling and no approval gate, and start at *In progress*. **idea** stays in Backlog until the developer promotes it.

## Artifacts

- **Spec** `docs/specs/<n>-<slug>.md`: written for agents, the single source of truth for what gets built. Front matter: `item`, `type`, `status: draft | approved`, `branch`.
- **Ledger** `docs/specs/<n>-<slug>/progress.md`: slice status and the developer's rulings. It lets a restarted session resume.
- **Branch** `claude/<n>-<slug>`, from `develop`. One item, one branch, one PR into `develop`.
- No proof files in the repo. Verification is a short summary in the PR body and on the item.

## Steps

1. **Start.** The factory fires a session with the item. The `item` skill reads it (`get_item`), finds where it stands, and resumes.
2. **Spec** (`write-spec`). Features: grill the developer on every open decision, with a recommendation each time, then write and push the spec. Bugs/chores: a short spec, no grilling.
3. **Gate** (features only). The developer reads the spec and says "approved" in the session. No production code before that.
4. **Implement** (`implement-spec`). The session orchestrates: a fresh `slice-implementer` builds each slice test-first, the orchestrator commits, a `slice-reviewer` checks it.
5. **Verify.** All checks green (`.claude/check.sh`), then the `verifier` subagent checks every acceptance criterion against the running app and returns a summary. Nothing is written to the repo.
6. **Ship** (`ship`). Review the branch in a fresh subagent and fix findings, run the retro (`lesson`), push, and open the PR through `open_pull_request`. The factory enables auto-merge and moves the item to *In review*.
7. **Review.** CI and the Claude review run on the PR. The review fixes unambiguous findings (`fix(review): …`) and leaves an unresolved thread for everything else. Reply `@claude <what you want>` in a thread to have Claude fix it. GitHub auto-merges into `develop` when CI and the review pass and every thread is resolved.
8. **Release.** The developer tests on dev, then merges the `develop → main` release PR with a merge commit (never squash: it would make every later release PR conflict). Only a human merges into `main`.

## Guardrails

| Layer | What it enforces |
|---|---|
| Code | `.claude/check.sh` (tests, typecheck, build: project-defined) |
| Harness (`.claude/settings.json`) | no reading secrets (`.env*`, `.dev.vars*`); Stop hook runs `.claude/check.sh` |
| GitHub | `develop`: PR required, CI and Claude review green, conversations resolved, squash merge. `main`: PR required, CI green, merge commit only (keeps develop's history in main), human merge |
| Factory | agents move items one column forward at most, never to On dev / In prod |

## Learning loop

A correction becomes a guardrail through the `lesson` skill, which runs when the developer corrects the agent and in every `ship` retro. Project lessons land in this repo. Lessons about the workflow itself (this file, the skills, hooks) go to the factory with `kit_feedback`, because kit files are overwritten on update.
