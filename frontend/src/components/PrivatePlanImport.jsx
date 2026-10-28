import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { EXIDX } from '../lib/exercises.js'
import { readPrivatePlan, previewPrivatePlan, commitPrivatePlan, privateContext } from '../lib/private-plan.js'

const context = () => ({ hostname: location.hostname, user: useStore.getState().user,
  remote: useStore.getState().sync?.server || localStorage.getItem('gym_owner'), demo: import.meta.env.VITE_DEMO === '1' })

export default function PrivatePlanImport() {
  const [preview, setPreview] = useState(null)
  const [message, setMessage] = useState('')
  const [backed, setBacked] = useState(false)
  async function read(ev) {
    const file = ev.target.files?.[0]; ev.target.value = ''
    setPreview(null); setBacked(false); setMessage('')
    if (!file) return
    try {
      if (!privateContext(context())) throw new Error('Disponible solo en localhost, sin cuenta ni servidor conectado.')
      if (file.size > 256000) throw new Error('Archivo demasiado grande.')
      const plan = readPrivatePlan(await file.text(), EXIDX)
      const expected = JSON.stringify(useStore.getState().S)
      const result = previewPrivatePlan(useStore.getState().S, plan)
      setPreview({ plan, expected, ...result })
    } catch (e) { setMessage(e.message) }
  }
  function backup() {
    const blob = new Blob([preview.expected], { type: 'application/json' })
    const url = URL.createObjectURL(blob), a = document.createElement('a')
    a.href = url; a.download = 'pulse-before-private-import.json'; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setBacked(true)
  }
  function commit() {
    try {
      const n = commitPrivatePlan(useStore, preview.plan, preview.expected, localStorage, context)
      setMessage(`${n} rutinas añadidas. Historial y calendario conservados.`); setPreview(null); setBacked(false)
    } catch (e) { setMessage(e.message) }
  }
  return <section className="card" style={{ padding: 16 }} aria-label="Importación privada">
    <h2>Importar plan privado</h2>
    <p>Solo en este navegador y equipo. No se envía a un servidor. Añade rutinas; conserva historial y calendario. Guarde el respaldo en un lugar privado.</p>
    <label>Seleccionar archivo del plan <input type="file" accept=".json,application/json" onChange={read} /></label>
    {preview && <>
      <p>{preview.added.length} nuevas · {preview.skipped.length} ya importadas</p>
      {preview.added.map(r => <div key={r.id}><h3>{r.name}</h3><p>{r.note}</p><ul>{r.ex.map((e, i) => <li key={i}>
        {EXIDX[e.id].n} · {e.sets} × {e.reps}<p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{e.note}</p>
      </li>)}</ul></div>)}
      <button type="button" onClick={backup}>Descargar respaldo previo</button>
      {backed && <label style={{ display: 'block', margin: '12px 0' }}><input type="checkbox" checked={backed === 'confirmed'} onChange={ev => setBacked(ev.target.checked ? 'confirmed' : true)} /> Confirmo que revisé ejercicios, variantes, series y repeticiones, y guardé el respaldo</label>}
      <button type="button" disabled={backed !== 'confirmed' || !preview.added.length} onClick={commit}>Añadir rutinas privadas</button>
      <button type="button" onClick={() => setPreview(null)}>Cancelar</button>
    </>}
    <p role="status">{message}</p>
  </section>
}
