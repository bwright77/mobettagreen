import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { admissionLabel, whenLabel } from '@/lib/dates'

export const dynamic = 'force-dynamic'

async function getEvent(slug: string) {
  const payload = await getPayload({ config: await config })
  const found = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return found.docs[0]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const event = await getEvent((await params).slug)
  return event ? { title: event.title, description: event.summary ?? undefined } : {}
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const event = await getEvent((await params).slug)
  if (!event) notFound()

  return (
    <article className="wrap section" style={{ maxWidth: '48rem' }}>
      <p className="eyebrow">{whenLabel(event.startsAt, event.endsAt)}</p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', marginBottom: '1rem' }}>{event.title}</h1>

      <p style={{ fontWeight: 700, color: 'var(--green-dark)' }}>{admissionLabel(event)}</p>

      {event.locationName ? (
        <p>
          <strong>{event.locationName}</strong>
          {event.address ? (
            <>
              <br />
              {event.address}
            </>
          ) : null}
        </p>
      ) : null}

      {event.summary ? <p style={{ fontSize: '1.1rem' }}>{event.summary}</p> : null}
      {event.description ? <RichText data={event.description} /> : null}

      {event.signup !== 'none' ? (
        <div className="empty" style={{ marginTop: '2rem' }}>
          <p>
            Sign-ups open soon. Until then, reach out at{' '}
            <a href="mailto:mbgmanager@gmail.com">mbgmanager@gmail.com</a>.
          </p>
        </div>
      ) : null}
    </article>
  )
}
