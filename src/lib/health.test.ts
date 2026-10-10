import { describe, expect, it } from 'vitest'
import { health } from './health'

describe('health', () => {
  it('reports env and commit', () => {
    expect(health('dev', 'abc1234')).toEqual({ ok: true, env: 'dev', commit: 'abc1234' })
  })
  it('falls back to local when no env is set', () => {
    expect(health(undefined, 'unknown').env).toBe('local')
  })
})
