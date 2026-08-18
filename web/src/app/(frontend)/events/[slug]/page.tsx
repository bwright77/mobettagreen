import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { admissionLabel, whenLabel } from '@/lib/dates'
import { RegistrationForm } from '@/components/RegistrationForm'

export const dynamic = 'force-dynamic'

const SEAT_HOLDING = ['pending', 'confirmed', 'waitlisted']

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

/**
 * Seats left for a capped event, or null when it's uncapped. Counts the same
 * seat-holding statuses the capacity hook does, so the number on the page and
 * the number the server enforces can't disagree.
 */
async function seatsRemaining(event: {
  id: string | number
  capacity?: number | null
}): Promise<number | null> {
  if (!event.capacity) return null
  const payload = await getPayload({ config: await config })
  const taken = await payload.find({
    collection: 'registrations',
    depth: 0,
    limit: 0,
    pagination: false,
    where: {
      and: [{ event: { equals: event.id } }, { status: { in: SEAT_HOLDING } }],
    },
  })
  const seats = taken.docs.reduce(
    (sum, doc) => sum + (typeof doc.partySize === 'number' ? doc.partySize : 1),
    0,
  )
  return Math.max(0, event.capacity - seats)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const event = await getEvent((await params).slug)
  return event ? { title: event.title, description: event.summary ?? undefined } : {}
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) notFound()

  // Sign-ups are open until they close, or failing that until the event starts.
  const closesAt = event.signupClosesAt ?? event.startsAt
  const signupClosed = Boolean(closesAt && new Date(closesAt).getTime() < Date.now())
  const remaining = event.signup !== 'none' ? await seatsRemaining(event) : null

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

      {event.signup === 'rsvp' ? (
        <div style={{ marginTop: '2.5rem' }}>
          {signupClosed ? (
            <div className="empty">
              <p>Sign-ups for this event have closed. Hope to see you at the next one.</p>
            </div>
          ) : (
            <RegistrationForm
              slug={slug}
              remaining={remaining}
              waitlistOpen={Boolean(event.waitlist)}
            />
          )}
        </div>
      ) : event.signup === 'paid' ? (
        // Paid events stay gated until the payment processor is chosen.
        <div className="empty" style={{ marginTop: '2.5rem' }}>
          <p>
            Paid registration opens soon. Until then, reach out at{' '}
            <a href="mailto:mbgmanager@gmail.com">mbgmanager@gmail.com</a>.
          </p>
        </div>
      ) : null}
    </article>
  )
}
