import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { TornBand } from '@/components/TornBand'
import { StorySections } from '@/components/StorySections'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const payload = await getPayload({ config: await config })
  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'rgc-day' } },
    limit: 1,
    depth: 0,
  })
  const page = found.docs[0]
  return {
    title: page?.title ?? 'RGC Day',
    description: page?.summary ?? undefined,
  }
}

export default async function RgcDayPage() {
  const payload = await getPayload({ config: await config })
  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'rgc-day' } },
    limit: 1,
    depth: 1,
  })
  const page = found.docs[0]
  const sections = page?.sections ?? []

  return (
    <>
      <article className="wrap section story">
        {page?.eyebrow ? <p className="eyebrow">{page.eyebrow}</p> : null}
        <h1 className="story__title">
          {page?.title ?? 'Random Gestures of Compassion Day'}
        </h1>
      </article>

      {/* Torn out of the page because it is the reason the day exists. */}
      <TornBand variant="quote">
        <blockquote className="ribbon__quote">
          <p>&ldquo;You are my friend, you just don&rsquo;t know it yet.&rdquo;</p>
          <cite>Reese Grant-Cobb</cite>
        </blockquote>
      </TornBand>

      <div className="wrap section">
        {page?.summary ? (
          <div className="story">
            <p className="story__lede">{page.summary}</p>
          </div>
        ) : null}

        {sections.length > 0 ? (
          <div style={{ marginTop: 'clamp(2.5rem, 6vw, 4rem)' }}>
            <StorySections sections={sections} />
          </div>
        ) : (
          <div className="empty" style={{ textAlign: 'left', marginTop: '2rem' }}>
            <p>
              The rest of this page is waiting on Miss Bev&rsquo;s words &mdash;
              Reese&rsquo;s story, and what the day asks of people, belong in her voice.
              Add sections in the admin under Pages &rarr; RGC Day.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
