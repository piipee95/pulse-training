import { DEMO } from './demo.js'
import { getLang } from './i18n-core.js'
// Presentation only: never rename a saved routine or touch the demo seed/history.
export function demoLabel(name) {
  if (!DEMO || getLang() !== 'es') return name
  return ({ 'Push Day': 'Día de empuje', 'Pull Day': 'Día de tracción', 'Leg Day': 'Día de piernas' })[name] || name
}
