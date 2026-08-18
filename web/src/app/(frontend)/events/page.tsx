import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { admissionLabel, whenLabel } from '@/lib/dates'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Market & Events' }

export default async function EventsPage() {
  const payload = await getPayload({ config: await config })
  const now = new Date().toISOString()

  const events = await payload.find({
    collection: 'events',
    where: { startsAt: { greater_than: now } },
    sort: 'startsAt',
    limit: 100,
    depth: 0,
  })

  return (
    <div className="wrap section">
      <p className="eyebrow">What&rsquo;s coming up</p>
      <div className="section__head">
        <h2>Market &amp; Events</h2>
      </div>
      {events.docs.length > 0 ? (
        <ul className="card-grid">
          {events.docs.map((event) => (
            <li key={event.id}>
              <Link className="card" href={`/events/${event.slug}`}>
                <p className="card__meta">{whenLabel(event.startsAt, event.endsAt)}</p>
                <h3>{event.title}</h3>
                {event.summary ? <p>{event.summary}</p> : null}
                <span className="card__tag">{admissionLabel(event)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          <p>
            Nothing on the calendar yet. Facebook has the most current word in the meantime.
          </p>
        </div>
      )}
    </div>
  )
}
