export type Health = { ok: true; env: string; commit: string }

// what the factory's environments page polls to show which commit is live where
export function health(env: string | undefined, commit: string): Health {
  return { ok: true, env: env ?? 'local', commit }
}
