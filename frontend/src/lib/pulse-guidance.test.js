import { describe, it, expect } from 'vitest'
import { guidanceFromHistory as guidance } from './pulse-guidance.js'
const workout = (entry) => [{ entries: [entry] }]
const set = (r = 12) => ({ done: true, r, w: 50, rir: 2 })
const cfg = { repMin: 8, repMax: 12, techniqueConfirmed: true }
describe('PULSE persisted session adapter', () => {
  it('does not make equipment guesses from legacy history', () => {
    expect(guidance(workout({ id:'bench', sets:[set()] }), 'bench', cfg).action).toBe('insufficient')
  })
  it('recommends only on explicitly tagged comparable confirmed rows', () => {
    const entry = { id:'bench', equipmentVariantKey:'incline-barbell', sets:[set(),set(),set()] }
    expect(guidance(workout(entry), 'bench', cfg).action).toBe('suggest-increase')
    expect(guidance(workout(entry), 'bench', { ...cfg, techniqueConfirmed:false }).action).toBe('hold')
  })
  it('refuses mixed loads, missing effort and unrelated exercise', () => {
    const entry = { id:'bench', equipmentVariantKey:'incline-barbell', sets:[set(),{...set(),w:55}] }
    expect(guidance(workout(entry),'bench',cfg).action).toBe('insufficient')
    expect(guidance(workout({...entry,sets:[{...set(),rir:null}]}),'bench',cfg).action).toBe('insufficient')
    expect(guidance(workout(entry),'squat',cfg).action).toBe('insufficient')
  })
})
