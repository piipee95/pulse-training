import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const workout = readFileSync(resolve(process.cwd(), 'src/views/Workout.jsx'), 'utf8')
const styles = readFileSync(resolve(process.cwd(), 'src/views/pulse-workout.css'), 'utf8')
const main = readFileSync(resolve(process.cwd(), 'src/main.jsx'), 'utf8')

describe('PULSE Train workout input styling', () => {
  it('keeps upstream set-confirmation and canonical persistence hooks', () => {
    expect(workout).toContain('const toggle = (idx, i, side,')
    expect(workout).toContain('e.sets[i].done = !e.sets[i].done')
    expect(workout).toContain('onToggle(i)')
    expect(workout).toContain("import './pulse-workout.css'")
  })

  it('scopes input improvements to the web build', () => {
    expect(main).toContain("if (!MOBILE) document.documentElement.classList.add('pulse-web')")
    expect(styles).toContain('.pulse-web .setrow .stp')
    expect(styles).toContain('.pulse-web .setrow-side .stp')
    expect(styles).not.toMatch(/(^|\n)\s*(?:\.setrow|:root)\s*\{/)
  })

  it('keeps keyboard focus clear and avoids extra motion', () => {
    expect(styles).toContain(':focus-within')
    expect(styles).toContain(':focus-visible')
    expect(styles).toContain('font-variant-numeric: tabular-nums')
    expect(styles).toContain('@media (max-width: 390px)')
    expect(styles).toContain('prefers-reduced-motion: reduce')
  })
})
