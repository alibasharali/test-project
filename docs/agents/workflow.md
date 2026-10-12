# Workflow: from item to prod

How every change in this repo is made. Managed by Software Factory's agent kit (`.claude/kit-version`); don't edit this file here, changes are overwritten by the next kit update. Project-specific rules belong in the repo's instructions and `.claude/rules/`.

**Instructions** means `AGENTS.md` and `CLAUDE.md`: `AGENTS.md` is read by every coding agent, and in projects the factory creates `CLAUDE.md` imports it (`@AGENTS.md`), so it holds the shared instructions. Older repos may keep everything in `CLAUDE.md`. Wherever the kit says `CLAUDE.md`, read both.

## What Software Factory is

The developer's personal control plane for all their projects. Each project has a board in the factory; each board item is worked on by Claude sessions the factory starts, and moves from idea to production without the developer driving git by hand. The factory scaffolds new projects and imports existing ones, and every project follows this same workflow, so the board, pipelines and releases work the same everywhere. What that relies on, in every repo:

- items, specs and branches named as below, so the factory can link them;
- `.claude/check.sh` as the one definition of green, run by agents, hooks and the `check` job on every PR;
- `develop` deploying to dev and `main` to prod from GitHub Actions, with `environment: dev` / `prod`, which is how the board knows an item reached dev or prod;
- the developer deciding: specs, merges into `main`, anything that costs money or touches secrets. Agents do the work in between.

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
| Ready to build | the developer approved the spec, in the session or with the factory's approve button | agent on the developer's word, or the factory on the button |
| In progress | slices being implemented | agent |
| In review | PR to `develop` open; CI and Claude review running | factory, when the agent opens the PR |
| On dev | PR merged into `develop` and deployed to dev | factory (GitHub webhook) |
| In prod | release PR merged into `main` and deployed | factory (GitHub webhook) |

Item types: **feature** runs the full flow. **bug** and **chore** get a short spec with no grilling and no approval gate, and start at *In progress*. **idea** stays in Backlog until the developer promotes it.

## Artifacts

- **Spec** `docs/specs/<n>-<slug>.md`: written for agents, the single source of truth for what gets built. Front matter: `item`, `type`, `status: draft | approved`, `branch`.
- **Ledger** `docs/specs/<n>-<slug>/progress.md`: slice status and the developer's rulings. It lets a restarted session resume.
- **Stack** `.factory/stack.json`: the stack this repo uses, declared by the repo itself and synced into the factory on every merge into develop. It changes in the same PR as the code that adds or removes a stack (`.factory/check-stack.mjs` in `check.sh` fails otherwise, and a hook tells you right after you edit dependencies). `docs/agents/stack.md` holds the guidelines that come with it, generated: get both from `render_stack_files(N, stack_json)`. Read stack.md before touching dependencies, infrastructure or deploys. What every repo needs regardless of stack is in `docs/agents/project-standard.md`.
- **Branch** `claude/<n>-<slug>`, from `develop`. One item, one branch, one PR into `develop`.
- No proof files in the repo. Verification is a short summary in the PR body and on the item.

## Steps

1. **Start.** The factory fires a session with the item. The `item` skill reads it (`get_item`), finds where it stands, and resumes.
2. **Spec** (`write-spec`). Features: grill the developer on every open decision in rounds of questions on the item page (options, a recommendation, free text), then write and push the spec. Bugs/chores: a short spec, no grilling. A new project's first item uses `bootstrap`, which scaffolds the picked stack when no tested recipe did, and records what it learned about stacks the factory doesn't know yet. An imported repo's first item uses `onboard` first, which specs what the repo lacks compared with a new factory project (checks, PR CI, dev/prod deploys, URLs, `CLAUDE.md`).
3. **Gate** (features only). The developer reads the spec and approves it: by saying "approved" in the session, or with **Approve** on the item page, which records the spec's blob SHA and starts a fresh session. No production code before that.
4. **Implement** (`implement-spec`). The session orchestrates: a fresh `slice-implementer` builds each slice test-first, the orchestrator commits, a `slice-reviewer` checks it.
5. **Verify.** All checks green (`.claude/check.sh`), then the `verifier` subagent checks every acceptance criterion against the running app and returns a summary. Nothing is written to the repo.
6. **Ship** (`ship`). Review the branch in a fresh subagent and fix findings, run the retro (`lesson`), push, and open the PR through `open_pull_request`. The factory moves the item to *In review* and turns on auto-merge where GitHub allows it.
7. **Review.** CI and the Claude review run on the PR. The review fixes unambiguous findings (`fix(review): …`) and leaves an unresolved thread for everything else. Reply `@claude <what you want>` in a thread to have Claude fix it. Then the PR merges into `develop` (squash) one of two ways: GitHub auto-merges it once CI and the review pass and every thread is resolved, where the repo has rulesets (public repos, or GitHub Pro); otherwise the developer presses **Merge** on the item in the factory, which only merges with the required checks green. Agents never merge.
8. **Release.** The developer tests on dev, then merges the `develop → main` release PR with a merge commit (never squash: it would make every later release PR conflict). Only a human merges into `main`.

## Guardrails

| Layer | What it enforces |
|---|---|
| Code | `.claude/check.sh` (tests, typecheck, build: project-defined) |
| Harness (`.claude/settings.json`) | no reading secrets (`.env*`, `.dev.vars*`); Stop hook runs `.claude/check.sh` |
| GitHub | With rulesets (public repos, or GitHub Pro): `develop` needs a PR, CI and Claude review green, conversations resolved, squash merge; `main` needs a PR, CI green, merge commit only (keeps develop's history in main), human merge. Without rulesets (private repos on GitHub Free) nothing is enforced on GitHub: the same rules hold because merges go through the factory's Merge buttons, so never push to `develop` or `main` directly |
| Factory | agents move items one column forward at most, never to On dev / In prod |

## Learning loop

A correction becomes a guardrail through the `lesson` skill, which runs when the developer corrects the agent and in every `ship` retro. Project lessons land in this repo. Lessons about the workflow itself (this file, the skills, hooks) go to the factory with `kit_feedback`, because kit files are overwritten on update. Lessons about a stack (true in any repo using it) go to the factory's stack registry with `propose_stack_change`, which opens a pull request the developer reviews on the factory's Stacks tab; once merged, every repo with that stack gets it in its next Update kit. A proposal never blocks the item: link it and carry on, without waiting for the merge or calling `request_attention`.
