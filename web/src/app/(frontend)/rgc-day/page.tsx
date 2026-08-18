import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { TornBand } from '@/components/TornBand'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'RGC Day',
  description:
    'Random Gestures of Compassion Day — every July 20, in memory of Reese Grant-Cobb. Proclaimed in Denver by the Mayor’s Office.',
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

  return (
    <>
      <article className="wrap section" style={{ maxWidth: '48rem' }}>
        <p className="eyebrow">Every July 20 · Proclaimed in Denver by the Mayor&rsquo;s Office</p>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.4rem)', marginBottom: '1.25rem' }}>
          {page?.title ?? 'Random Gestures of Compassion Day'}
        </h1>
        {page?.summary ? <p style={{ fontSize: '1.12rem' }}>{page.summary}</p> : null}
      </article>

      {/* Torn out of the page because it is the reason the day exists. */}
      <TornBand variant="quote">
        <blockquote className="ribbon__quote">
          <p>&ldquo;You are my friend, you just don&rsquo;t know it yet.&rdquo;</p>
          <cite>Reese Grant-Cobb</cite>
        </blockquote>
      </TornBand>

      <article className="wrap section" style={{ maxWidth: '48rem' }}>

      {page?.body ? (
        <RichText data={page.body} />
      ) : (
        <div className="empty" style={{ textAlign: 'left', marginTop: '1.5rem' }}>
          <p>
            The rest of this page is waiting on Miss Bev&rsquo;s words — Reese&rsquo;s
            story, and what the day asks of people, belong in her voice. Edit it in the
            admin under Pages &rarr; RGC Day.
          </p>
        </div>
        )}
      </article>
    </>
  )
}
