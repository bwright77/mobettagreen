/**
 * Fails if a CSS custom property is used but never defined.
 *
 *   node scripts/check-css-vars.mjs
 *
 * This is the failure that let the ported brand styles break silently: a rule
 * referencing var(--font-display) when only --font-archivo-black existed just
 * inherits, with no error anywhere. Cheap to check, so check it.
 */
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(import.meta.dirname, '..')
const FILES = [
  'src/app/(frontend)/styles.css',
  'src/app/(payload)/custom.scss',
]

// Supplied at runtime rather than declared in these files.
const EXTERNAL = new Set([
  '--font-archivo',
  '--font-archivo-black',
  '--font-anton',
  // Payload's own design tokens, defined in @payloadcms/ui. The elevation ramp
  // runs 0–1000 in steps of 50.
  ...Array.from({ length: 21 }, (_, i) => `--theme-elevation-${i * 50}`),
  '--theme-bg',
  '--theme-text',
  '--theme-input-bg',
  '--theme-overlay',
])

let failed = false

for (const rel of FILES) {
  const file = path.join(ROOT, rel)
  if (!fs.existsSync(file)) continue
  const css = fs.readFileSync(file, 'utf8')

  const defined = new Set([...css.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gim)].map((m) => m[1]))
  const used = new Set([...css.matchAll(/var\(\s*(--[a-z0-9-]+)/g)].map((m) => m[1]))

  const missing = [...used].filter((v) => !defined.has(v) && !EXTERNAL.has(v)).sort()

  if (missing.length > 0) {
    failed = true
    console.error(`\n${rel}`)
    for (const v of missing) {
      const line = css.split('\n').findIndex((l) => l.includes(`var(${v}`)) + 1
      console.error(`  ${v}  — used (first at line ${line}) but never defined`)
    }
  } else {
    console.log(`ok  ${rel}  (${defined.size} defined, ${used.size} used)`)
  }
}

if (failed) {
  console.error('\nUndefined custom properties resolve to nothing and inherit silently.')
  process.exit(1)
}
console.log('\nno undefined custom properties')
