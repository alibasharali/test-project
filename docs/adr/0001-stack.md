# 1. Stack: TanStack Start on Cloudflare Workers with D1

Status: accepted (scaffolded by Software Factory)

## Decision

TanStack Start (React 19) server-rendered on a Cloudflare Worker, Tailwind v4, D1 through Drizzle. Two environments in one repo: `develop` deploys to `test-project-dev` (the review environment), `main` to `test-project`.

## Consequences

- One vendor, deploys in seconds, free at small scale.
- D1 is SQLite: fine for most apps, but no realtime and limited concurrent writes. Revisit (Durable Objects, Supabase) if a spec needs either.
- Custom domain later: add `routes` with `custom_domain: true` to both environments in `wrangler.jsonc`.
