import { recommendNextSession } from './pulse-progression.js'

// Read-only bridge from stored sessions to PULSE progression policy.
// Requiring a stored equipmentVariantKey avoids treating one gym machine as another.
export function guidanceFromHistory(workouts, exerciseId, { repMin, repMax, techniqueConfirmed = false, incrementKg = 2.5 } = {}) {
  if (!exerciseId || !Array.isArray(workouts)) return { action: 'insufficient', reason: 'Sin historial comparable.' }
  for (let i = workouts.length - 1; i >= 0; i--) {
    const w = workouts[i]
    if (w?.noProg === true || !Array.isArray(w?.entries)) continue
    const e = w.entries.find(x => x?.id === exerciseId && x.noProg !== true && Array.isArray(x.sets))
    if (!e) continue
    const rows = e.sets.filter(s => s?.done === true && s?.warmup !== true && s?.phase !== 'warmup')
    if (!rows.length) continue
    if (!e.equipmentVariantKey || typeof e.equipmentVariantKey !== 'string') {
      return { action: 'insufficient', reason: 'Identifica la máquina o variante antes de comparar cargas.' }
    }
    return recommendNextSession({ repMin, repMax, techniqueConfirmed, incrementKg,
      sets: rows.map(s => ({ done: s.done, phase: s.phase || 'work', mode: s.mode || e.target?.mode || 'reps',
        type: s.type || 'straight', w: s.w, r: s.r,
        rir: typeof s.rir === 'number' ? s.rir : typeof s.rpe === 'number' ? 10 - s.rpe : null,
        variantKey: e.equipmentVariantKey })) })
  }
  return { action: 'insufficient', reason: 'Sin series completadas en el historial.' }
}
