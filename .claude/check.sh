#!/usr/bin/env bash
# Everything that must be green before an agent finishes, a reviewer approves, or CI passes.
# Project-owned: add steps here (lint, e2e) as the project grows.
set -euo pipefail
cd "$(dirname "$0")/.."

[ -d node_modules ] || npm ci --no-audit --no-fund
npm run cf-typegen --silent >/dev/null   # binding types for the typecheck
npm test --silent
npm run build --silent >/dev/null        # also writes src/routeTree.gen.ts, which the typecheck needs
npm run typecheck --silent
echo "check: all green"
