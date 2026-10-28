import { readFileSync } from 'node:fs'
import { inflateSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'
const read = name => readFileSync(new URL('../../public/' + name, import.meta.url))
function rgba(name, size) {
  const b = read(name)
  expect([...b.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10])
  expect(b.readUInt32BE(16)).toBe(size); expect(b.readUInt32BE(20)).toBe(size)
  expect(b[24]).toBe(8); expect(b[25]).toBe(6)
  const chunks = []
  for (let i = 8; i < b.length;) {
    const len = b.readUInt32BE(i)
    if (b.toString('ascii', i + 4, i + 8) === 'IDAT') chunks.push(b.subarray(i + 8, i + 8 + len))
    i += len + 12
  }
  const raw = inflateSync(Buffer.concat(chunks)), stride = size * 4, pixels = Buffer.alloc(stride * size)
  const paeth = (a, b, c) => { const p = a + b - c, x = Math.abs(p - a), y = Math.abs(p - b), z = Math.abs(p - c); return x <= y && x <= z ? a : y <= z ? b : c }
  for (let y = 0; y < size; y++) {
    const filter = raw[y * (stride + 1)]
    expect(filter).toBeLessThan(5)
    for (let x = 0; x < stride; x++) {
      const i = y * stride + x, a = x >= 4 ? pixels[i - 4] : 0, b = y ? pixels[i - stride] : 0, c = y && x >= 4 ? pixels[i - stride - 4] : 0
      pixels[i] = (raw[y * (stride + 1) + x + 1] + [0, a, b, Math.floor((a + b) / 2), paeth(a, b, c)][filter]) & 255
    }
  }
  return pixels
}
describe('PULSE PWA assets', () => {
  it.each([180, 192, 512])('has a genuine transparent %i PNG', n => {
    const data = rgba(`icon-${n}.png`, n)
    let transparent = false, opaque = false
    for (let i = 3; i < data.length; i += 4) { transparent ||= data[i] === 0; opaque ||= data[i] === 255 }
    expect(transparent && opaque).toBe(true)
  })
  it('keeps every foreground pixel of the opaque maskable inside its safe circle', () => {
    const data = rgba('icon-maskable-512.png', 512)
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] !== 255) throw new Error('maskable alpha')
      if (data[i] === 17 && data[i + 1] === 21 && data[i + 2] === 27) continue
      const pixel = i / 4, x = pixel % 512 + .5 - 256, y = Math.floor(pixel / 512) + .5 - 256
      if (Math.hypot(x, y) > 512 * .4) throw new Error('foreground outside maskable safe area')
    }
  })
  it('references the PNGs with separate any/maskable purposes and the Apple icon', () => {
    const manifest = JSON.parse(read('manifest.json'))
    expect(manifest.theme_color.toLowerCase()).toBe('#11151b')
    for (const n of [180, 192, 512]) expect(manifest.icons).toContainEqual({ src: `icon-${n}.png`, sizes: `${n}x${n}`, type: 'image/png', purpose: 'any' })
    expect(manifest.icons).toContainEqual({ src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' })
    const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')
    expect(html).toContain('rel="apple-touch-icon" href="icon-180.png"')
    expect(html).not.toContain('user-scalable=no')
  })
})
