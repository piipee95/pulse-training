import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const css = readFileSync(resolve(process.cwd(), 'src/pulse-theme.css'), 'utf8')
const entry = readFileSync(resolve(process.cwd(), 'src/main.jsx'), 'utf8')
const strip = css.replace(/\/\*[\s\S]*?\*\//g, '')
const block = (selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return strip.match(new RegExp(escaped + '\\s*\\{([^}]*)\\}'))?.[1] || ''
}
const token = (rules, key) => rules.match(new RegExp('(?:^|;)\\s*' + key + '\\s*:\\s*([^;]+)'))?.[1]?.trim()
const rgb = hex => hex.replace('#', '').match(/../g).map(v => parseInt(v, 16))
const lum = hex => rgb(hex).map(v => v / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0)
const contrast = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05)

describe('PULSE Train web theme foundation', () => {
  it('activates only on web, not in Capacitor native mode', () => {
    expect(entry).toContain("if (!MOBILE) document.documentElement.classList.add('pulse-web')")
    expect(strip).not.toMatch(/(^|\n)\s*:root\s*\{/)
    expect(strip).toContain(':root.pulse-web')
  })

  it('loads after original styles so existing component rules and accent logic stay intact', () => {
    expect(entry.indexOf("import './pulse-theme.css'")).toBeGreaterThan(entry.indexOf("import './index.css'"))
    expect(strip).not.toMatch(/--acc\s*:/)
    expect(strip).not.toMatch(/--on-acc\s*:/)
  })

  it.each([
    ['dark', ':root.pulse-web', '#11151b', '#f5f7f9'],
    ['light', ':root.pulse-web[data-theme="light"]', '#f5f7f9', '#18212b'],
  ])('%s primary text has WCAG AA contrast', (_, selector, background, foreground) => {
    const rules = block(selector)
    expect(rules.length).toBeGreaterThan(30)
    const bg = selector.includes('light') ? token(rules, '--bg') : token(rules, '--pulse-carbon')
    const fg = selector.includes('light') ? token(rules, '--label') : token(rules, '--pulse-cloud')
    expect(bg).toBe(background)
    expect(fg).toBe(foreground)
    expect(contrast(bg, fg)).toBeGreaterThanOrEqual(4.5)
  })

  it('has increased-contrast selectors for dark and light web modes', () => {
    expect(strip).toContain('@media (prefers-contrast: more)')
    expect(strip.match(/:root\.pulse-web\[data-theme="light"\]/g)?.length).toBe(2)
  })
})
