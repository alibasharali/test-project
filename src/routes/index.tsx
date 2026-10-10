import { createFileRoute } from '@tanstack/react-router'

// placeholder until the v1 item replaces it
export const Route = createFileRoute('/')({
  component: () => (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Test project</h1>
      <p className="mt-2 text-[var(--muted)]">Scaffolded by Software Factory. v1 is on its way.</p>
    </main>
  ),
})
