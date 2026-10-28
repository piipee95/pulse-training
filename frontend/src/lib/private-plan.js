// No network access. Plans are user-selected files, never a bundled personal template.
export const PRIVATE_PLAN_ENABLED = import.meta.env?.VITE_PRIVATE_IMPORT === '1'
  && import.meta.env?.VITE_DEMO !== '1' && import.meta.env?.VITE_MOBILE !== '1'

export function privateContext({ hostname, user, remote, demo }) {
  return !demo && !user && !remote && ['localhost', '127.0.0.1', '[::1]'].includes(hostname)
}

const text = (v, max = 2000) => typeof v === 'string' && v.length <= max
const integer = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi
export function readPrivatePlan(raw, catalogue) {
  if (typeof raw !== 'string' || raw.length > 256000) throw new Error('Archivo demasiado grande.')
  const p = JSON.parse(raw)
  if (p?.format !== 'pulse-private-plan' || p.version !== 1 || !text(p.id, 80) || !/^[a-zA-Z0-9_-]+$/.test(p.id)
    || p.unit !== 'kg' || !Array.isArray(p.routines) || p.routines.length < 1 || p.routines.length > 12) throw new Error('Formato de plan no válido.')
  const ids = new Set()
  const routines = p.routines.map((r, i) => {
    if (!text(r.name, 100) || !r.name.trim() || !Array.isArray(r.ex) || !r.ex.length || r.ex.length > 30 || !text(r.note || '')) throw new Error('Rutina no válida.')
    const id = `private-${p.id}-${i + 1}`
    if (ids.has(id)) throw new Error('Identificador duplicado.')
    ids.add(id)
    return { id, name: r.name, emoji: 'barbell', note: r.note || '', ex: r.ex.map(e => {
      if (!text(e.id, 30) || !Object.hasOwn(catalogue, e.id) || !integer(e.sets, 1, 10) || !integer(e.reps, 1, 100)
        || !text(e.note || '')) throw new Error('Ejercicio, series o repeticiones no válidos. Resuelva los rangos en la vista previa.')
      // Historical loads belong in notes. They never become completed sets or prescribed loads.
      return { id: e.id, sets: e.sets, reps: e.reps, weight: 0, note: e.note || '' }
    }) }
  })
  return { id: p.id, routines }
}

export function previewPrivatePlan(state, plan) {
  if (state.unit !== 'kg') throw new Error('Este plan está en kg. Revise las unidades antes de importar.')
  const existing = new Map((state.routines || []).map(r => [r.id, r]))
  const added = [], skipped = []
  for (const r of plan.routines) {
    const old = existing.get(r.id)
    if (!old) added.push(r)
    else if (JSON.stringify({ name: old.name, note: old.note || '', ex: old.ex }) === JSON.stringify({ name: r.name, note: r.note, ex: r.ex })) skipped.push(r)
    else throw new Error('Una rutina importada cambió. No se sobrescribirá; revise una nueva versión del plan.')
  }
  return { added, skipped }
}

export function commitPrivatePlan(store, plan, expected, storage, context) {
  if (!privateContext(context())) throw new Error('La importación requiere modo local privado en este equipo.')
  const before = store.getState().S
  if (JSON.stringify(before) !== expected) throw new Error('Los datos cambiaron. Genere otra vista previa y respaldo.')
  const { added } = previewPrivatePlan(before, plan)
  if (!added.length) return 0
  // Refuse stale tabs and storage failures before touching the store.
  if (storage.getItem('gym_state_v1') !== expected) throw new Error('La copia guardada cambió. Recargue antes de importar.')
  const key = `pulse-private-backup-${Date.now()}`
  storage.setItem(key, expected)
  if (storage.getItem(key) !== expected) throw new Error('No se pudo verificar el respaldo.')
  store.getState().update(s => { s.routines.push(...structuredClone(added)) }, false)
  const saved = JSON.parse(storage.getItem('gym_state_v1') || 'null')
  if (!saved || added.some(r => !saved.routines?.some(x => x.id === r.id))) throw new Error('No se confirmó el guardado. Conserve el respaldo y recargue.')
  return added.length
}
