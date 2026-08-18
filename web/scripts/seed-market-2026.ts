/**
 * Seeds the 2026 market season and the vendor application link.
 *
 *   npx tsx --env-file=.env.local scripts/seed-market-2026.ts
 *
 * Everything here is first-party, taken from the vendor application form:
 * https://docs.google.com/forms/d/e/1FAIpQLScr6Iiqi7jHN-JEK0AxRzc7gp_rNnf-ZPhLOXCG-RPkmpJcHA/viewform
 *
 *   Location:  Charles Cousins Plaza, 2401 Welton St, Denver, CO 80205
 *   Market day: Saturdays, 10am – 2pm
 *   Dates:      6/27, 7/11, 7/18, 7/25, 8/8, 8/15, 8/22, 8/29,
 *               9/12, 9/19, 9/26, 10/3, 10/10
 *
 * All thirteen were checked to fall on a Saturday. Past dates are seeded too —
 * the site filters to upcoming, and a complete season is worth having on record.
 *
 * Idempotent: matches on slug.
 */
import { getPayload } from 'payload'

import config from '../src/payload.config'

const DATES = [
  '2026-06-27',
  '2026-07-11',
  '2026-07-18',
  '2026-07-25',
  '2026-08-08',
  '2026-08-15',
  '2026-08-22',
  '2026-08-29',
  '2026-09-12',
  '2026-09-19',
  '2026-09-26',
  '2026-10-03',
  '2026-10-10',
]

// Denver is UTC-6 in season, so 10am local is 16:00Z and 2pm is 20:00Z.
const OPENS = 'T16:00:00.000Z'
const CLOSES = 'T20:00:00.000Z'

const LOCATION = 'Charles Cousins Plaza'
const ADDRESS = '2401 Welton St, Denver, CO 80205'

const payload = await getPayload({ config })

for (const day of DATES) {
  const slug = `market-${day}`
  const data = {
    title: 'Mo’Betta Green MarketPlace',
    slug,
    type: 'market' as const,
    startsAt: day + OPENS,
    endsAt: day + CLOSES,
    locationName: LOCATION,
    address: ADDRESS,
    summary: 'Fresh produce, makers, music, and wellness in Five Points. SNAP welcome.',
    signup: 'none' as const,
  }

  const existing = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs.length > 0) {
    await payload.update({ collection: 'events', id: existing.docs[0].id, data })
    console.log('updated  ' + day)
  } else {
    await payload.create({ collection: 'events', data })
    console.log('created  ' + day)
  }
}

const total = await payload.find({
  collection: 'events',
  where: { type: { equals: 'market' } },
  limit: 0,
  depth: 0,
})
console.log(`\nmarket days on record: ${total.totalDocs}`)
process.exit(0)
