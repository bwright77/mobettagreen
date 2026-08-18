import Link from 'next/link'
import React from 'react'

import { admissionLabel, dayNumber, timeRange, weekdayShort } from '@/lib/dates'
import { EventTypeIcon } from './EventTypeIcon'

type EventItem = {
  id: string | number
  title: string
  slug?: string | null
  type?: string | null
  startsAt: string
  endsAt?: string | null
  locationName?: string | null
  summary?: string | null
  signup?: string | null
  price?: number | null
  capacity?: number | null
}

/**
 * One event, led by its date.
 *
 * The season is thirteen near-identical Saturdays, so the day numbers running
 * down the left edge are what people actually scan — not the titles, which
 * repeat. The rail keeps them aligned.
 */
export function EventRow({ event }: { event: EventItem }) {
  const where = [timeRange(event.startsAt, event.endsAt), event.locationName]
    .filter(Boolean)
    .join(' · ')

  return (
    <li className="event-item">
      <Link href={`/events/${event.slug}`}>
        <div className="event-item__date" aria-hidden="true">
          <span className="event-item__dow">{weekdayShort(event.startsAt)}</span>
          <span className="event-item__day">{dayNumber(event.startsAt)}</span>
        </div>

        <div className="event-item__body">
          <div className="event-item__head">
            <EventTypeIcon type={event.type} />
            <h4 className="event-item__title">{event.title}</h4>
          </div>
          <p className="event-item__when">{where}</p>
          {event.summary ? <p className="event-item__summary">{event.summary}</p> : null}
        </div>

        <div className="event-item__aside">
          <span className="event-item__tag">{admissionLabel(event)}</span>
          <span className="event-item__more">Details &rarr;</span>
        </div>
      </Link>
    </li>
  )
}
