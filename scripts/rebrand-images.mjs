import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pub = path.join(__dirname, '..', 'public')

// ── 1. Get metadata for each image ───────────────────────────────────────────
async function meta(file) {
  const m = await sharp(path.join(pub, file)).metadata()
  console.log(`${file}: ${m.width}x${m.height}`)
  return m
}

await meta('logo-share.png')
await meta('hero-right-arch.png')
await meta('hero-left-arch.png')

// ── 2. New logo: replace the whole image with an RRC SVG logo ─────────────
const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="720" viewBox="0 0 1080 720">
  <rect width="1080" height="720" fill="#050505"/>

  <!-- Glowing backdrop -->
  <ellipse cx="540" cy="360" rx="320" ry="160" fill="#0ea5e9" opacity="0.07"/>

  <!-- R monogram (stylised) -->
  <g transform="translate(280, 200)">
    <!-- Vertical bar -->
    <rect x="0" y="0" width="28" height="200" rx="6" fill="url(#grad)"/>
    <!-- Top arc -->
    <path d="M28 0 Q160 0 160 80 Q160 160 28 160" stroke="url(#grad)" stroke-width="28" fill="none" stroke-linecap="round"/>
    <!-- Leg -->
    <line x1="90" y1="160" x2="168" y2="200" stroke="url(#grad)" stroke-width="28" stroke-linecap="round"/>
  </g>

  <!-- Wordmark -->
  <text x="480" y="320" font-family="Arial Black, Arial, sans-serif" font-weight="900"
    font-size="82" letter-spacing="-4" fill="white">RETATRUTIDE</text>
  <text x="480" y="402" font-family="Arial, sans-serif" font-weight="400"
    font-size="36" letter-spacing="14" fill="#94a3b8">RESEARCH CENTER</text>

  <!-- Thin separator line -->
  <line x1="480" y1="420" x2="870" y2="420" stroke="#0ea5e9" stroke-width="1.5" opacity="0.5"/>

  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
</svg>`

await sharp(Buffer.from(logoSvg))
  .png()
  .toFile(path.join(pub, 'logo-share.png'))
console.log('✓ logo-share.png rebranded')

// ── 3. Patch hero arch images: cover top-left "VERTEX BIOLABS" corner text ──
async function patchArch(filename, bgColor) {
  const { width, height } = await sharp(path.join(pub, filename)).metadata()

  // Cover block — wider to fit all text: 46% wide x 22% tall
  const blockW = Math.round(width * 0.46)
  const blockH = Math.round(height * 0.22)
  const fontSize = Math.round(blockH * 0.30)
  const subSize  = Math.round(blockH * 0.16)

  const overlay = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${blockW}" height="${blockH}">
    <rect width="${blockW}" height="${blockH}" fill="${bgColor}"/>
    <text x="14" y="${Math.round(blockH * 0.48)}"
      font-family="Arial Black, Arial, sans-serif" font-weight="900"
      font-size="${fontSize}" fill="white" letter-spacing="1">RRC</text>
    <text x="14" y="${Math.round(blockH * 0.80)}"
      font-family="Arial, sans-serif" font-weight="400"
      font-size="${subSize}" fill="rgba(255,255,255,0.75)" letter-spacing="1.5">RESEARCH CENTER</text>
  </svg>`

  await sharp(path.join(pub, filename))
    .composite([{
      input: Buffer.from(overlay),
      top: 0,
      left: 0,
    }])
    .toFile(path.join(pub, filename + '.tmp.png'))

  // Replace original with patched
  const fs = await import('fs/promises')
  await fs.rename(path.join(pub, filename + '.tmp.png'), path.join(pub, filename))
  console.log(`✓ ${filename} patched`)
}

// Sample the top-left pixel to pick a matching bg color
async function getDominantCornerColor(filename) {
  const { data } = await sharp(path.join(pub, filename))
    .extract({ left: 5, top: 5, width: 20, height: 20 })
    .raw()
    .toBuffer({ resolveWithObject: true })
  const r = data[0], g = data[1], b = data[2]
  return `rgb(${r},${g},${b})`
}

const colorRight = await getDominantCornerColor('hero-right-arch.png')
const colorLeft  = await getDominantCornerColor('hero-left-arch.png')
console.log('Corner colors:', colorRight, colorLeft)

await patchArch('hero-right-arch.png', colorRight)
await patchArch('hero-left-arch.png',  colorLeft)

console.log('\nAll images rebranded successfully.')
