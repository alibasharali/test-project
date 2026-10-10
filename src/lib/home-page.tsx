import { Counter } from './counter-button'
import { HOME_HEADING, HOME_LINE } from './home'

export function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">{HOME_HEADING}</h1>
      <p className="mt-2 text-[var(--muted)]">{HOME_LINE}</p>
      <Counter />
    </main>
  )
}
