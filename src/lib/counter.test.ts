import { describe, expect, it } from 'vitest'
import { increment } from './counter'

describe('increment', () => {
  it('adds one', () => {
    expect(increment(0)).toBe(1)
    expect(increment(increment(increment(0)))).toBe(3)
  })
})
