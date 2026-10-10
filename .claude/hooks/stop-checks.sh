#!/usr/bin/env bash
# Stop: the agent may not finish with red checks. Runs the project's .claude/check.sh, only
# when the working tree changed since the last green run, so chat turns don't cost a build.
input=$(cat)
root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"
cd "$root" || exit 0
[ -x .claude/check.sh ] || exit 0

changed=$(git status --porcelain --untracked-files=all)
[ -z "$changed" ] && exit 0

hash=$( { git diff HEAD 2>/dev/null; git ls-files --others --exclude-standard -z | xargs -0 cat 2>/dev/null; } | cksum | cut -d' ' -f1)
cache="${TMPDIR:-/tmp}/claude-stop-checks-$(printf '%s' "$root" | cksum | cut -d' ' -f1)"
[ "$(cat "$cache" 2>/dev/null)" = "$hash" ] && exit 0

log=$(mktemp)
if .claude/check.sh >"$log" 2>&1; then
  echo "$hash" >"$cache"
  rm -f "$log"
  exit 0
fi

# json-escape the tail of the log for the reason field
details=$(tail -25 "$log" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/\t/  /g' | awk '{printf "%s\\n", $0}')
rm -f "$log"

# second stop in a row: don't trap the agent in a loop, tell the user instead
if printf '%s' "$input" | grep -Eq '"stop_hook_active"[[:space:]]*:[[:space:]]*true'; then
  printf '{"systemMessage":"Checks are still red after one attempt to fix them.\\n%s"}\n' "$details"
  exit 0
fi

printf '{"decision":"block","reason":"`.claude/check.sh` is red. Fix it before you finish. Never change a test to make it pass.\\n%s"}\n' "$details"
exit 0
