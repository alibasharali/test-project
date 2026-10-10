# CLAUDE.md

Test project: This is a simple "hello world, this webpage is working" app to test out that the factory creating this project works. So just a simple front page.

Built with Software Factory's workflow: read `docs/agents/workflow.md` before starting on an item. Domain terms are in `CONTEXT.md`, decisions in `docs/adr/`.

## Commands

```sh
npm run dev                # http://localhost:3000 (local D1 via miniflare)
.claude/check.sh           # everything that must be green: tests, typecheck, build
npm test                   # vitest, src/**/*.test.ts
npm run db:generate        # schema change → drizzle/NNNN_*.sql
npm run db:migrate:local   # apply migrations to the local D1
```

- **Never deploy by hand.** GitHub Actions deploys `develop` → `test-project-dev` and `main` → `test-project` on workers.dev, applying D1 migrations first.
- `worker-configuration.d.ts` and `src/routeTree.gen.ts` are generated and gitignored; `npm run cf-typegen` writes the first, the dev server or build the second (`.claude/check.sh` does both). Don't use the `tsr` CLI: its route tree lacks the Start types server routes need.
- Vitest uses `vitest.config.ts`, not `vite.config.ts` (the Cloudflare plugin breaks vitest). Code importing `cloudflare:workers` can't be unit-tested that way, so keep logic in pure modules under `src/lib/` and keep routes thin.

## Architecture

TanStack Start (React 19, file routes in `src/routes/`) server-rendered on a Cloudflare Worker, Tailwind v4, D1 through Drizzle (`src/db/`).

- Server-only data access goes through `db()` in `src/db/client.ts`, called from server functions or server route handlers.
- `wrangler.jsonc` environments don't inherit `vars` or bindings: every env redeclares them. Add a binding to both.
- `/api/health` returns `{ ok, env, commit }`; the factory polls it. Keep it public and cheap.
