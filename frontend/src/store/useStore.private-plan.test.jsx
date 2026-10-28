// @vitest-environment happy-dom
import { it, expect, vi } from 'vitest'
vi.mock('../lib/api.js', () => ({ api: vi.fn(), setRemoteAuth: vi.fn() }))
import { api } from '../lib/api.js'
import { useStore, DEF } from './useStore.js'
import { readPrivatePlan, commitPrivatePlan, previewPrivatePlan } from '../lib/private-plan.js'
it('persists an additive private import through the real store without an API push', () => {
  localStorage.clear(); api.mockClear()
  const original = structuredClone({ ...DEF, routines: [], workouts: [{ id: 'existing', entries: [] }], week: { 1: 'saved' } })
  useStore.setState({ S: original, user: null })
  useStore.getState().update(() => {}, false)
  const expected = JSON.stringify(useStore.getState().S)
  const plan = readPrivatePlan(JSON.stringify({ format: 'pulse-private-plan', version: 1, id: 'synthetic', unit: 'kg', routines: [{ name: 'Synthetic', ex: [{ id: '0025', sets: 2, reps: 8 }] }] }), { '0025': {} })
  const context = () => ({ hostname: 'localhost', user: null, remote: null, demo: false })
  expect(commitPrivatePlan(useStore, plan, expected, localStorage, context)).toBe(1)
  const reloaded = JSON.parse(localStorage.getItem('gym_state_v1'))
  expect(reloaded.workouts).toEqual(original.workouts); expect(reloaded.week).toEqual(original.week)
  expect(previewPrivatePlan(reloaded, plan).added).toHaveLength(0)
  expect(api).not.toHaveBeenCalled()
})
