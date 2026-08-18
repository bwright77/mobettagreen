import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { PressRow } from '@/components/PressRow'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Press' }

const YEAR_UNKNOWN = 'Undated'

const yearOf = (iso?: string | null) =>
  iso ? String(new Date(iso).getUTCFullYear()) : YEAR_UNKNOWN

export default async function PressPage() {
  const payload = await getPayload({ config: await config })
  const press = await payload.find({
    collection: 'press',
    sort: '-publishedAt',
    limit: 200,
    depth: 1,
  })

  // Newest first, with undated pieces gathered at the end rather than jumbled in.
  const dated = press.docs.filter((d) => d.publishedAt)
  const undated = press.docs.filter((d) => !d.publishedAt)
  const ordered = [...dated, ...undated]

  const groups: { year: string; items: typeof ordered }[] = []
  for (const item of ordered) {
    const year = yearOf(item.publishedAt)
    const last = groups[groups.length - 1]
    if (last && last.year === year) last.items.push(item)
    else groups.push({ year, items: [item] })
  }

  return (
    <div className="wrap section">
      <p className="eyebrow">Coverage</p>
      <div className="section__head">
        <h2>Miss Bev &amp; the Marketplace in the press</h2>
      </div>

      {groups.map((group) => (
        <section key={group.year}>
          <h3 className="press-year">{group.year}</h3>
          <ul className="press-list">
            {group.items.map((item) => (
              <PressRow key={item.id} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
