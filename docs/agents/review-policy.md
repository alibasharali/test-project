# Review policy

Every reviewer follows this file: the `slice-reviewer` after each slice, the branch review in `ship`, and the Claude review in CI. Every finding gets exactly one of two classes.

## Auto-fix

The fix is **unambiguous** and **changes no behaviour that the spec describes**. The reviewer fixes it itself.

- docs, comments, READMEs or templates that are wrong, broken or disagree with the code
- a convention from `CLAUDE.md` or `.claude/rules/` that has one correct form
- an obvious guard with one reasonable fix, where the spec says nothing either way
- a test name or test that contradicts the spec's own wording, when the code is right

Before committing, `.claude/check.sh` must be green; if it isn't, the finding becomes *Needs a human*. Commit as `fix(review): <what>`, one commit per finding.

## Needs a human

Everything else. In particular:

- domain rules and anything the spec's *Domain decisions* cover
- an acceptance criterion that is missing, partial or wrong, or anything built outside the spec's scope
- security: auth, secrets, untrusted input reaching storage or HTML
- any finding with two or more reasonable fixes, or where you are unsure of the class

Each becomes an inline comment, which leaves an unresolved thread and blocks auto-merge until a human resolves it. Say what is wrong and give your recommended fix.

## Never

- Change a test to make it pass. A failing test is a *Needs a human* finding.
- Edit the spec, `.github/workflows/`, `.claude/settings.json` or `.claude/hooks/`.
