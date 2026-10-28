// Developer-only raster export. Uses sharp (free, libvips); no app dependency.
// NODE_PATH may point to a local installation of sharp. Never changes approved SVG paths.
const fs = require('node:fs')
const path = require('node:path')
const sharp = require('sharp')
const dir = path.resolve(__dirname, '../public')
async function main() {
  const svg = fs.readFileSync(path.join(dir, 'pulse-icon.svg'), 'utf8')
  for (const name of ['pulse-icon', 'pulse-logo']) {
    const original = fs.readFileSync(path.join(dir, name + '.svg'), 'utf8')
    for (const [variant, color] of [['mono-carbon', '#11151B'], ['mono-cloud', '#F5F7F9']]) {
      fs.writeFileSync(path.join(dir, `${name}-${variant}.svg`), original.replace(/fill="#[0-9a-f]{6}"/gi, `fill="${color}"`))
    }
  }
  for (const n of [180, 192, 512]) {
    await sharp(Buffer.from(svg)).resize(n, n).png().toFile(path.join(dir, `icon-${n}.png`))
  }
  // The complete square mark fits inside the central safe circle (radius 40%).
  // 52% square -> corner radius < 37%, including the transparent source margins.
  const mark = await sharp(Buffer.from(svg)).resize(266, 266).png().toBuffer()
  await sharp({ create: { width: 512, height: 512, channels: 4, background: '#11151B' } })
    .composite([{ input: mark, left: 123, top: 123 }]).png().toFile(path.join(dir, 'icon-maskable-512.png'))
}
main().catch(e => { console.error(e); process.exitCode = 1 })
