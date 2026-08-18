import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { EventRow } from '@/components/EventRow'
import { EventTypeIcon } from '@/components/EventTypeIcon'
import { monthLabel } from '@/lib/dates'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Market & Events' }

export default async function EventsPage() {
  const payload = await getPayload({ config: await config })
  const now = new Date().toISOString()

  const settings = await payload.findGlobal({ slug: 'settings' })

  const events = await payload.find({
    collection: 'events',
    where: { startsAt: { greater_than: now } },
    sort: 'startsAt',
    limit: 200,
    depth: 0,
  })

  // Group into months, in order. Sorted by date already, so a running compare
  // is enough — no need to bucket and re-sort.
  const months: { label: string; items: typeof events.docs }[] = []
  for (const event of events.docs) {
    const label = monthLabel(event.startsAt)
    const last = months[months.length - 1]
    if (last && last.label === label) last.items.push(event)
    else months.push({ label, items: [event] })
  }

  return (
    <div className="wrap section">
      <p className="eyebrow">What&rsquo;s coming up</p>
      <div className="section__head">
        <h2>Market &amp; Events</h2>
      </div>

      {months.length > 0 ? (
        months.map((month) => (
          <section key={month.label}>
            <h3 className="events-month">{month.label}</h3>
            <ul className="event-list">
              {month.items.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </ul>
          </section>
        ))
      ) : (
        <div className="empty">
          <p>Nothing on the calendar yet. Facebook has the most current word in the meantime.</p>
        </div>
      )}

      {settings?.vendorApplicationUrl ? (
        <section className="vend">
          <div className="vend__body">
            <div className="vend__head">
              <EventTypeIcon type="market" />
              <h2>Want to vend with us?</h2>
            </div>
            {settings.vendorApplicationNote ? <p>{settings.vendorApplicationNote}</p> : null}
          </div>
          <a className="btn btn--red" href="/vend">
            Submit a vendor application
          </a>
        </section>
      ) : null}
    </div>
  )
}
