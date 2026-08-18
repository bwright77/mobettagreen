import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { TornBand } from '@/components/TornBand'
import { PressRow } from '@/components/PressRow'
import { StorySections } from '@/components/StorySections'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const payload = await getPayload({ config: await config })
  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'our-story' } },
    limit: 1,
    depth: 0,
  })
  const page = found.docs[0]
  return {
    title: page?.title ?? 'Our Story',
    description: page?.summary ?? undefined,
  }
}

/**
 * Every word here is editable in the admin under Pages → Our Story. The page is
 * built from that entry's sections rather than hardcoded copy, so changing the
 * text can't collapse the layout and nobody has to touch code to fix a typo.
 */
export default async function OurStoryPage() {
  const payload = await getPayload({ config: await config })

  const [found, press] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: { slug: { equals: 'our-story' } },
      limit: 1,
      depth: 1,
    }),
    payload.find({
      collection: 'press',
      where: { featured: { equals: true } },
      sort: '-publishedAt',
      limit: 3,
      depth: 1,
    }),
  ])
  const page = found.docs[0]
  const sections = page?.sections ?? []

  return (
    <>
      <article className="wrap section story">
        {page?.eyebrow ? <p className="eyebrow">{page.eyebrow}</p> : null}
        <h1 className="story__title">{page?.title ?? 'Our Story'}</h1>
        {page?.summary ? <p className="story__lede">{page.summary}</p> : null}
      </article>

      <TornBand>
        <b>T</b>raceable Origin, <b>O</b>rganic, <b>L</b>ocal, <b>D</b>elicious = Integris
        Food<sup>&reg;</sup>
      </TornBand>

      <div className="wrap section">
        {sections.length > 0 ? (
          <StorySections sections={sections} />
        ) : (
          <div className="empty">
            <p>
              This page is waiting on content. Add sections in the admin under Pages &rarr;
              Our Story.
            </p>
          </div>
        )}
      </div>

      {press.docs.length > 0 ? (
        <section className="wrap section">
          <div className="section__head">
            <h2>Told elsewhere</h2>
            <Link className="section__more" href="/press">
              All coverage
            </Link>
          </div>
          <ul className="press-list">
            {press.docs.map((item) => (
              <PressRow key={item.id} item={item} showYear />
            ))}
          </ul>
        </section>
      ) : null}
    </>
  )
}
