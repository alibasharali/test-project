import { describe, expect, it } from 'vitest'
import { decrement, double, increment } from './counter'

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

describe('double', () => {
  it('multiplies by two; zero stays zero; negatives double', () => {
    expect(double(1)).toBe(2)
    expect(double(double(double(1)))).toBe(8)
    expect(double(0)).toBe(0)
    expect(double(-3)).toBe(-6)
  })
  it('composes with increment', () => {
    expect(double(increment(increment(increment(0))))).toBe(6)
  })
})
