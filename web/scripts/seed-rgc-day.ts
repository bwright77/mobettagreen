/**
 * RGC Day page. Facts only — Reese's story and what the day asks of people
 * belong in Miss Bev's own words, written through the admin.
 *
 *   npx tsx --env-file=.env.local scripts/seed-rgc-day.ts
 *
 * Re-running updates the summary but never overwrites a body she has written.
 */
import { getPayload } from 'payload'

import config from '../src/payload.config'

const payload = await getPayload({ config })

const data = {
  title: 'Random Gestures of Compassion Day',
  slug: 'rgc-day',
  summary:
    'Every July 20 — Reese Grant-Cobb’s birthday — Denver marks Random Gestures of Compassion Day, proclaimed by the Mayor’s Office in his memory. RGC carries his initials. The day asks for intentional kindness and connection, and is marked with food, music, yoga, and community sharing.',
}

const existing = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'rgc-day' } },
  limit: 1,
})

if (existing.docs.length > 0) {
  await payload.update({
    collection: 'pages',
    id: existing.docs[0].id,
    data: { title: data.title, summary: data.summary },
  })
  console.log('updated rgc-day summary (body untouched)')
} else {
  await payload.create({ collection: 'pages', data })
  console.log('created rgc-day page')
}
process.exit(0)
