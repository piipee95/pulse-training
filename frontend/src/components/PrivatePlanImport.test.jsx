// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
const fixture = vi.hoisted(() => ({ S: { unit: 'kg', routines: [] }, user: null, sync: {} }))
vi.mock('../store/useStore.js', () => ({ useStore: { getState: () => fixture } }))
import PrivatePlanImport from './PrivatePlanImport.jsx'
let root, host
afterEach(async () => { if (root) await act(async () => root.unmount()); host?.remove(); localStorage.clear(); fixture.user = null })
async function select() {
  fixture.sync.server = location.origin
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host)
  await act(async () => root.render(<PrivatePlanImport />))
  const input = host.querySelector('input[type=file]')
  Object.defineProperty(input, 'files', { value: [{ size: 200, text: async () => JSON.stringify({ format: 'pulse-private-plan', version: 1, id: 'synthetic', unit: 'kg', routines: [{ name: 'Synthetic', ex: [{ id: '0025', sets: 2, reps: 8 }] }] }) }] })
  await act(async () => input.dispatchEvent(new Event('change', { bubbles: true })))
}
it('previews a same-origin local guest and requires a backup before adding', async () => {
  await select()
  expect(host.textContent).toContain('1 nuevas')
  expect(host.textContent).toContain('Synthetic')
  expect([...host.querySelectorAll('button')].find(b => b.textContent === 'Añadir rutinas privadas').disabled).toBe(true)
  expect(fixture.S.routines).toHaveLength(0)
})
it('still refuses an authenticated account at the same local origin', async () => {
  fixture.user = { id: 'other-account' }
  await select()
  expect(host.textContent).toContain('Disponible solo en localhost')
  expect(host.textContent).not.toContain('1 nuevas')
})
