#!/usr/bin/env bash
# PostToolUse (Edit|Write|MultiEdit): after a change to dependencies or stack config, tells the agent
# where .factory/stack.json and the code disagree. Reports only; CI's check.sh enforces. No jq.
input=$(cat)
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -f .factory/check-stack.mjs ] || exit 0
printf '%s' "$input" | grep -Eq '"file_path" *: *"[^"]*(package\.json|wrangler\.(jsonc?|toml)|supabase/[^"]*|components\.json|\.factory/stack\.json)"' || exit 0
if ! out=$(node .factory/check-stack.mjs --quiet 2>&1); then
  # exit 2 on PostToolUse: the edit stands, Claude reads this
  printf '%s\nUpdate .factory/stack.json in this PR (render_stack_files gives the matching stack files).\n' "$out" >&2
  exit 2
fi
exit 0
