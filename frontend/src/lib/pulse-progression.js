// PULSE V1.2: pure, opt-in recommendation policy. No storage, networking or personal data.
// Designed to consume only confirmed working sets from one exercise AND equipment variant.
const valid = n => typeof n === 'number' && Number.isFinite(n)
export function recommendNextSession({ sets, repMin, repMax, incrementKg = 2.5, techniqueConfirmed = false } = {}) {
  if (!Number.isInteger(repMin) || !Number.isInteger(repMax) || repMin < 1 || repMax < repMin || repMax > 100) {
    return { action: 'insufficient', reason: 'Defina un rango válido de repeticiones.' }
  }
  if (!Array.isArray(sets) || sets.length === 0) {
    return { action: 'insufficient', reason: 'No hay series confirmadas.' }
  }
  // Never infer that unknown warm-up, side, timed, drop or rest-pause data represent a normal set.
  if (sets.some(s => !s || s.done !== true || s.phase !== 'work' || s.mode !== 'reps'
    || s.type !== 'straight' || !valid(s.w) || s.w < 0 || !Number.isInteger(s.r) || s.r < 1
    || !valid(s.rir) || s.rir < 0 || s.rir > 10 || typeof s.variantKey !== 'string' || !s.variantKey.trim())) {
    return { action: 'insufficient', reason: 'Faltan series de trabajo comparables, RIR o una variante identificada.' }
  }
  const variant = sets[0].variantKey
  const weight = sets[0].w
  if (sets.some(s => s.variantKey !== variant || s.w !== weight)) {
    return { action: 'insufficient', reason: 'No se comparan máquinas, variantes ni cargas diferentes.' }
  }
  if (!techniqueConfirmed) {
    return { action: 'hold', weightKg: weight, reason: 'Confirme la técnica antes de proponer progresión.' }
  }
  if (sets.some(s => s.r < repMin || s.rir < 1)) {
    return { action: 'hold', weightKg: weight, reason: 'Mantener carga y priorizar técnica y recuperación.' }
  }
  if (sets.every(s => s.r >= repMax && s.rir >= 2) && valid(incrementKg) && incrementKg > 0 && incrementKg <= 10) {
    return { action: 'suggest-increase', weightKg: weight, suggestedKg: Math.round((weight + incrementKg) * 100) / 100,
      reason: 'Se alcanzó el extremo superior del rango con margen de repeticiones.' }
  }
  return { action: 'suggest-reps', weightKg: weight, reason: 'Proponer más repeticiones dentro del rango antes de aumentar carga.' }
}
