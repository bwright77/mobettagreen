import React from 'react'

type PressItem = {
  id: string | number
  title: string
  outlet: string
  url: string
  byline?: string | null
  excerpt?: string | null
  publishedAt?: string | null
  dateIsApproximate?: boolean | null
  imageUrl?: string | null
  image?: unknown
}

const dayMonth = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' }).format(
    new Date(iso),
  )

/**
 * One piece of coverage, as a horizontal row. Shared by the press index and Our
 * Story so the two can't drift apart.
 */
export function PressRow({ item, showYear = false }: { item: PressItem; showYear?: boolean }) {
  const uploaded =
    item.image && typeof item.image === 'object' && 'url' in (item.image as Record<string, unknown>)
      ? ((item.image as { url?: string }).url ?? undefined)
      : undefined
  const src = uploaded ?? item.imageUrl ?? undefined

  const year = item.publishedAt ? new Date(item.publishedAt).getUTCFullYear() : undefined
  const date =
    item.publishedAt && !item.dateIsApproximate ? dayMonth(item.publishedAt) : undefined

  return (
    <li className="press-item">
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        {src ? (
          <figure className="press-item__figure">
            {/* The outlet's own lead image, hotlinked rather than copied. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${item.outlet}: ${item.title}`}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </figure>
        ) : (
          <figure className="press-item__figure press-item__figure--none">{item.outlet}</figure>
        )}

        <div>
          <p className="press-item__meta">
            {item.outlet}
            {date ? ` · ${date}` : ''}
            {showYear && year ? ` · ${year}` : ''}
          </p>
          <h4 className="press-item__title">{item.title}</h4>
          {item.excerpt ? <p className="press-item__excerpt">{item.excerpt}</p> : null}
          {item.byline ? <p className="press-item__byline">By {item.byline}</p> : null}
        </div>
      </a>
    </li>
  )
}
