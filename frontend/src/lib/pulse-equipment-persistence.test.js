import { describe, expect, it } from 'vitest'
import { buildCompletedWorkout } from './finish-workout.js'

const session = equipmentVariantKey => ({
  id: 'session', d: '2026-10-28', start: 1, name: 'Entrenar', bw: null,
  entries: [{ id: 'exercise', ...(equipmentVariantKey === undefined ? {} : { equipmentVariantKey }),
    target: { sets: 1, reps: 10 }, sets: [{ done: true, w: 55, r: 10 }] }],
})

describe('PULSE equipment variant persistence', () => {
  it('preserves explicitly chosen equipment on a finished session', () => {
    const result = buildCompletedWorkout(session(' incline-barbell '), { end: 2 })
    expect(result.entries[0].equipmentVariantKey).toBe('incline-barbell')
  })
  it('leaves legacy sessions untagged instead of guessing an equipment variant', () => {
    const result = buildCompletedWorkout(session(), { end: 2 })
    expect(result.entries[0]).not.toHaveProperty('equipmentVariantKey')
  })
  it('ignores empty or invalid variant identifiers', () => {
    for (const key of ['  ', null, 17]) {
      const result = buildCompletedWorkout(session(key), { end: 2 })
      expect(result.entries[0]).not.toHaveProperty('equipmentVariantKey')
    }
  })
})
