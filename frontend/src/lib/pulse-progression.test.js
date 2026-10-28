import { describe, it, expect } from 'vitest'
import { recommendNextSession as next } from './pulse-progression.js'
const base = (r = 10, rir = 2) => ({ done: true, phase: 'work', mode: 'reps', type: 'straight', w: 50, r, rir, variantKey: 'barbell-incline' })
const args = (sets, extras = {}) => ({ sets, repMin: 8, repMax: 12, techniqueConfirmed: true, ...extras })
describe('PULSE V1.2 progression policy (suggestion only)', () => {
  it('requires confirmed comparable working sets, RIR and equipment key', () => {
    for (const v of [{ ...base(), done: false }, { ...base(), rir: null }, { ...base(), phase: 'warmup' },
      { ...base(), type: 'dropset' }, { ...base(), variantKey: '' }]) {
      expect(next(args([v])).action).toBe('insufficient')
    }
    expect(next(args([base(), { ...base(), variantKey: 'machine' }])).action).toBe('insufficient')
    expect(next(args([base(), { ...base(), w: 55 }])).action).toBe('insufficient')
  })
  it('only suggests load increase after every set tops range at >=2 RIR and technique confirmation', () => {
    expect(next(args([base(12), base(12), base(12)])).action).toBe('suggest-increase')
    expect(next(args([base(12), base(12), base(12)])).suggestedKg).toBe(52.5)
    expect(next(args([base(12, 1)])).action).toBe('suggest-reps')
    expect(next(args([base(12)], { techniqueConfirmed: false })).action).toBe('hold')
  })
  it('holds after failure or reps below range; otherwise suggests more reps', () => {
    expect(next(args([base(7)])).action).toBe('hold')
    expect(next(args([base(10, 0)])).action).toBe('hold')
    expect(next(args([base(9), base(11)])).action).toBe('suggest-reps')
  })
  it('rejects invalid targets, no sets and unbounded jumps', () => {
    expect(next(args([base()], { repMin: 13, repMax: 8 })).action).toBe('insufficient')
    expect(next(args([])).action).toBe('insufficient')
    expect(next(args([base(12)], { incrementKg: 100 })).action).toBe('suggest-reps')
  })
})
