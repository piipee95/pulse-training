import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const home = readFileSync(resolve(process.cwd(), 'src/views/Home.jsx'), 'utf8')
const css = readFileSync(resolve(process.cwd(), 'src/views/pulse-home.css'), 'utf8')
const theme = readFileSync(resolve(process.cwd(), 'src/pulse-theme.css'), 'utf8')

describe('PULSE Train web home integration', () => {
  it('keeps the original workout and session resume action', () => {
    expect(home).toContain('const onToday = () =>')
    expect(home).toContain('if (S.active) nav(\'/workout\')')
    expect(home).toContain('startFlow(effectiveRoutineIds(S, todayISO()))')
    expect(home).toContain('pulse-home-primary-action')
    expect(home).toContain('{...tappable(onToday)}')
  })
  it('uses only web-scoped visual changes', () => {
    expect(home).toContain("import './pulse-home.css'")
    expect(home).toContain('className="narrow pulse-home"')
    expect(theme).toContain(':root.pulse-web')
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, '')
    const selectors = rules.match(/(?:^|\})\s*([^{}]+)\s*\{/g) || []
    expect(selectors.length).toBeGreaterThan(3)
    expect(rules).not.toMatch(/:root\s*\{/)
    expect(rules).toContain('.pulse-web .pulse-home')
  })
  it('provides focus and compact screen safeguards', () => {
    expect(css).toContain(':focus-visible')
    expect(css).toContain('max-width: 380px')
    expect(css).toContain('prefers-reduced-motion: reduce')
  })
})
