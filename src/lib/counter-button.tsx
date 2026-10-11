import { useState } from 'react'
import { decrement, double, increment } from './counter'

export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div className="mt-6 flex items-center gap-4">
      <button
        type="button"
        className="rounded border px-3 py-1"
        onClick={() => setCount(decrement)}
      >
        Decrement
      </button>
      <button
        type="button"
        className="rounded border px-3 py-1"
        onClick={() => setCount(increment)}
      >
        Increment
      </button>
      <button
        type="button"
        className="rounded border px-3 py-1"
        onClick={() => setCount(double)}
      >
        Double
      </button>
      <output aria-live="polite">{count}</output>
    </div>
  )
}
