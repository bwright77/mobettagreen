import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Press' }

const YEAR_UNKNOWN = 'Undated'

const yearOf = (iso?: string | null) =>
  iso ? String(new Date(iso).getUTCFullYear()) : YEAR_UNKNOWN

const dayMonth = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' }).format(
    new Date(iso),
  )

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
            {group.items.map((item) => {
              const uploaded =
                item.image && typeof item.image === 'object' ? item.image.url : undefined
              const src = uploaded ?? item.imageUrl
              return (
                <li className="press-item" key={item.id}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {src ? (
                      <figure className="press-item__figure">
                        {/* The outlet's own lead image, hotlinked rather than copied.
                            Plain img so nothing is re-served from our domain. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`${item.outlet}: ${item.title}`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </figure>
                    ) : (
                      <figure className="press-item__figure press-item__figure--none">
                        {item.outlet}
                      </figure>
                    )}

                    <div>
                      <p className="press-item__meta">
                        {item.outlet}
                        {/* Only claim a day when we actually know one. */}
                        {item.publishedAt && !item.dateIsApproximate
                          ? ` · ${dayMonth(item.publishedAt)}`
                          : ''}
                      </p>
                      <h4 className="press-item__title">{item.title}</h4>
                      {item.excerpt ? <p className="press-item__excerpt">{item.excerpt}</p> : null}
                      {item.byline ? <p className="press-item__byline">By {item.byline}</p> : null}
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
