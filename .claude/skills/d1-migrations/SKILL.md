---
name: d1-migrations
description: Change the D1 database schema safely with Drizzle (new tables, columns, renames, drops). Use whenever a change touches the database schema or migrations in a project on Cloudflare D1.
---

# D1 migrations

_Updated 2026-10-11._

The deploy applies pending migrations to the environment's D1 **before** deploying code (`wrangler d1 migrations apply DB --remote`), so a migration must work with the code that is still running until the deploy finishes.

1. Edit the Drizzle schema (usually `src/db/schema.ts`).
2. `npm run db:generate` writes `drizzle/NNNN_<name>.sql`. Read the SQL: it is what runs in production.
3. **drizzle-kit asks about renames interactively**, which a session can't answer. Split the change instead: one migration adds the new column or table, a later one drops the old.
4. `npm run db:migrate:local` and run the tests against the local database.
5. Commit the schema, the SQL and `drizzle/meta/` together.

Rules:

- Never edit or delete a migration that was merged: it has run on dev, and on prod after a release. Fix forward with a new one.
- Additive first: add the column (nullable or with a default), ship the code that writes it, and only then make it required or drop the old one, in a later release.
- SQLite can't alter most column properties in place; drizzle-kit rebuilds the table. Check the generated SQL keeps the data (`INSERT INTO __new_… SELECT …`).
- Remote databases change only through deploys. Never run `--remote` commands by hand.
