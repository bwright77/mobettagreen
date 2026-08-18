import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { TornBand } from '@/components/TornBand'
import { FigureSlot } from '@/components/FigureSlot'

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
      <article className="wrap section story">
        <p className="eyebrow">Every July 20 · Proclaimed in Denver by the Mayor&rsquo;s Office</p>
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
        <section className="story-pair">
          <div className="story-pair__prose">
            {page?.summary ? <p className="story__lede">{page.summary}</p> : null}
          </div>
          <FigureSlot
                tilt={3}
            want="RGC Day itself — the July 20 gathering. Food being shared, music, yoga, people meeting each other. The widest, warmest frame available."
            ratio="3 / 2"
          />
        </section>

        <section className="story-pair story-pair--flip">
          <div className="story-pair__prose">
            {page?.body ? (
              <RichText data={page.body} />
            ) : (
              <div className="empty" style={{ textAlign: 'left' }}>
                <p>
                  The rest of this page is waiting on Miss Bev&rsquo;s words —
                  Reese&rsquo;s story, and what the day asks of people, belong in her
                  voice. Edit it in the admin under Pages &rarr; RGC Day.
                </p>
              </div>
            )}
          </div>
          <FigureSlot
                tilt={2}
            want="Reese. Portrait. Only if Miss Bev wants him pictured here — entirely her decision, and the page stands without it. If she would rather not, a photograph of the proclamation from the Mayor's Office works in its place."
            ratio="4 / 5"
          />
        </section>
      </div>
    </>
  )
}
