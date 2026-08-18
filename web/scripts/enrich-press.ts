/**
 * Reads each press item's page and fills in what the outlet publishes about it:
 * lead image (og:image), byline, and publication date.
 *
 *   npx tsx --env-file=.env.local scripts/enrich-press.ts          # report only
 *   npx tsx --env-file=.env.local scripts/enrich-press.ts --write  # save
 *
 * Images are stored as URLs and hotlinked, not downloaded — the site shows the
 * outlet's own lead image the way a link preview does, with the row linking back
 * to their article. Nothing is copied onto our servers. Anything already set by
 * hand wins; this only fills blanks.
 */
import { getPayload } from 'payload'

import config from '../src/payload.config'

const WRITE = process.argv.includes('--write')
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'

const meta = (html: string, patterns: RegExp[]): string | undefined => {
  for (const re of patterns) {
    const m = html.match(re)
    if (m?.[1]) {
      const v = m[1].trim()
      if (v) return v
    }
  }
  return undefined
}

const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&rsquo;/g, '’')
    .replace(/&nbsp;/g, ' ')

function scrape(html: string) {
  const image = meta(html, [
    /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
  ])
  const byline = meta(html, [
    /<meta[^>]+name=["']author["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+property=["']article:author["'][^>]+content=["']([^"']+)["']/i,
    /"author"\s*:\s*{[^}]*"name"\s*:\s*"([^"]+)"/i,
    /"author"\s*:\s*\[\s*{[^}]*"name"\s*:\s*"([^"]+)"/i,
  ])
  const published = meta(html, [
    /<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']date["'][^>]+content=["']([^"']+)["']/i,
    /"datePublished"\s*:\s*"([^"]+)"/i,
  ])
  return {
    imageUrl: image,
    byline: byline ? decode(byline) : undefined,
    publishedAt: published,
  }
}

const payload = await getPayload({ config })
const all = await payload.find({ collection: 'press', limit: 200, depth: 0 })

for (const item of all.docs) {
  let html = ''
  try {
    const res = await fetch(item.url, { headers: { 'user-agent': UA }, redirect: 'follow' })
    if (!res.ok) {
      console.log(`  ${res.status}  ${item.outlet}`)
      continue
    }
    html = await res.text()
  } catch (e) {
    console.log(`  ERR  ${item.outlet}: ${(e as Error).message}`)
    continue
  }

  const found = scrape(html)
  // Only fill blanks — anything set by hand stays.
  const patch: Record<string, unknown> = {}
  if (!item.imageUrl && found.imageUrl) patch.imageUrl = found.imageUrl
  if (!item.byline && found.byline) patch.byline = found.byline
  if (!item.publishedAt && found.publishedAt) patch.publishedAt = found.publishedAt

  const bits = [
    found.imageUrl ? 'img' : '—',
    found.byline ? `by ${found.byline}` : 'no byline',
    found.publishedAt ? found.publishedAt.slice(0, 10) : 'no date',
  ]
  console.log(`  ${item.outlet.padEnd(28)} ${bits.join('  |  ')}`)

  if (WRITE && Object.keys(patch).length > 0) {
    await payload.update({ collection: 'press', id: item.id, data: patch })
  }
}

console.log(WRITE ? '\nsaved' : '\nreport only — re-run with --write to save')
process.exit(0)
