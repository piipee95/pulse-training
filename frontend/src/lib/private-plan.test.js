import { describe, it, expect } from 'vitest'
import { readPrivatePlan, previewPrivatePlan, commitPrivatePlan, privateContext } from './private-plan.js'
const file = { format: 'pulse-private-plan', version: 1, id: 'synthetic', unit: 'kg', routines: [{ name: 'Example', ex: [{ id: 'test', sets: 2, reps: 8, note: 'Historical reference only' }] }] }
const plan = () => readPrivatePlan(JSON.stringify(file), { test: {} })
const state = () => ({ unit: 'kg', routines: [], workouts: [{ id: 'history' }], active: { id: 'running' }, week: { 1: 'existing' } })
const ctx = () => ({ hostname: 'localhost', user: null, remote: null, demo: false })
describe('private plan safety', () => {
  it('rejects demo, public hosts, accounts and remote connections', () => {
    expect(privateContext(ctx())).toBe(true)
    for (const change of [{ demo: true }, { hostname: 'pulse-train.pages.dev' }, { user: { id: 'u' } }, { remote: 'server' }]) expect(privateContext({ ...ctx(), ...change })).toBe(false)
  })
  it('rejects malformed files, unknown exercise IDs and unresolved ranges', () => {
    for (const change of [{ version: 2 }, { unit: 'lb' }, { routines: [] }]) expect(() => readPrivatePlan(JSON.stringify({ ...file, ...change }), { test: {} })).toThrow()
    expect(() => readPrivatePlan(JSON.stringify(file), {})).toThrow()
    expect(() => readPrivatePlan(JSON.stringify({ ...file, routines: [{ name: 'Example', ex: [{ id: 'test', sets: [2, 3], reps: 8 }] }] }), { test: {} })).toThrow()
  })
  it('previews without mutation and never imports historical weights', () => {
    const s = state(), before = JSON.stringify(s)
    const p = plan(); expect(p.routines[0].ex[0].weight).toBe(0)
    expect(previewPrivatePlan(s, p).added).toHaveLength(1)
    expect(JSON.stringify(s)).toBe(before)
  })
  it('is idempotent after reload, detects edits and refuses unit mismatch', () => {
    const s = state(); s.routines = plan().routines
    expect(previewPrivatePlan(JSON.parse(JSON.stringify(s)), plan()).added).toHaveLength(0)
    s.routines[0].name = 'Edited'; expect(() => previewPrivatePlan(s, plan())).toThrow()
    expect(() => previewPrivatePlan({ ...state(), unit: 'lb' }, plan())).toThrow()
  })
  it('backs up before adding, preserving sessions and schedule', () => {
    let s = state(), expected = JSON.stringify(s)
    const disk = new Map([['gym_state_v1', expected]])
    const storage = { getItem: k => disk.get(k), setItem: (k, v) => disk.set(k, v) }
    const store = { getState: () => ({ S: s, update: (f, push) => {
      expect(push).toBe(false); expect([...disk.keys()].some(k => k.startsWith('pulse-private-backup-'))).toBe(true)
      s = structuredClone(s); f(s); disk.set('gym_state_v1', JSON.stringify(s))
    } }) }
    expect(commitPrivatePlan(store, plan(), expected, storage, ctx)).toBe(1)
    expect(s.workouts).toEqual(state().workouts); expect(s.active).toEqual(state().active); expect(s.week).toEqual(state().week)
    expect(commitPrivatePlan(store, plan(), JSON.stringify(s), storage, ctx)).toBe(0)
  })
  it('refuses stale state or failed backup before writing', () => {
    const s = state(), store = { getState: () => ({ S: s, update: () => { throw new Error('must not write') } }) }
    expect(() => commitPrivatePlan(store, plan(), '{}', {}, ctx)).toThrow('cambiaron')
    const expected = JSON.stringify(s)
    expect(() => commitPrivatePlan(store, plan(), expected, { getItem: () => expected, setItem: () => { throw new Error('quota') } }, ctx)).toThrow('quota')
  })
})
