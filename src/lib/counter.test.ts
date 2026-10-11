import { describe, expect, it } from 'vitest'
import { decrement, increment } from './counter'

describe('decrement', () => {
  it('subtracts one and may go negative', () => {
    expect(decrement(0)).toBe(-1)
    expect(decrement(decrement(decrement(0)))).toBe(-3)
  })
  it('composes with increment', () => {
    expect(decrement(increment(increment(0)))).toBe(1)
  })
})

describe('increment', () => {
  it('adds one', () => {
    expect(increment(0)).toBe(1)
    expect(increment(increment(increment(0)))).toBe(3)
  })
})
