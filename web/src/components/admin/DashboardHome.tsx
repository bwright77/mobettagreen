import type { ServerProps } from 'payload'
import React from 'react'

import { shortDate, admissionLabel } from '@/lib/dates'

/**
 * A branded launchpad above Payload's default dashboard.
 *
 * The stock dashboard is a wall of identical collection cards — it doesn't tell
 * Beverly what needs doing today. This surfaces the two things that are actually
 * time-sensitive (sign-ups filling up, and who just registered) and the handful
 * of actions she'll reach for most, so the common paths are one click from
 * landing rather than buried in the nav.
 *
 * Rendered via admin.components.beforeDashboard, so it augments the default view
 * rather than replacing it — nothing built-in is lost.
 */

const SEAT_HOLDING = ['pending', 'confirmed', 'waitlisted']

const TYPE_LABEL: Record<string, string> = {
  market: 'Market day',
  class: 'Class',
  dinner: 'Community dinner',
  rgc: 'RGC Day',
  juneteenth: 'Juneteenth',
  celebration: 'Celebration',
  other: 'Event',
}

type Watch = {
  id: string | number
  title: string
  slug?: string | null
  type: string
  startsAt: string
  capacity: number | null
  taken: number
  waitlisted: number
}

export async function DashboardHome({ payload, user }: ServerProps) {
  if (!payload) return null

  const now = new Date().toISOString()

  // Upcoming events that take sign-ups — the ones with capacity to watch.
  const events = await payload.find({
    collection: 'events',
    where: {
      and: [{ signup: { not_equals: 'none' } }, { startsAt: { greater_than: now } }],
    },
    sort: 'startsAt',
    limit: 5,
    depth: 0,
  })

  // Seat counts per event. A handful of events, one small query each — mirrors
  // the exact statuses the capacity hook counts so the numbers agree.
  const watch: Watch[] = await Promise.all(
    events.docs.map(async (event): Promise<Watch> => {
      let taken = 0
      let waitlisted = 0
      const regs = await payload.find({
        collection: 'registrations',
        where: {
          and: [{ event: { equals: event.id } }, { status: { in: SEAT_HOLDING } }],
        },
        limit: 0,
        pagination: false,
        depth: 0,
      })
      for (const reg of regs.docs) {
        const seats = typeof reg.partySize === 'number' ? reg.partySize : 1
        if (reg.status === 'waitlisted') waitlisted += seats
        else taken += seats
      }
      return {
        id: event.id,
        title: event.title,
        slug: event.slug,
        type: event.type,
        startsAt: event.startsAt,
        capacity: event.capacity ?? null,
        taken,
        waitlisted,
      }
    }),
  )

  const latest = await payload.find({
    collection: 'registrations',
    sort: '-createdAt',
    limit: 6,
    depth: 1,
  })

  // Users authenticate by email only — no name field — so greet by the local
  // part of the address (bev@… → "bev").
  const firstName = typeof user?.email === 'string' ? user.email.split('@')[0] : 'there'

  return (
    <div className="mbg-dash">
      <header className="mbg-dash__welcome">
        <h1>Welcome back, {firstName}.</h1>
        <p>Here’s what’s coming up and who’s signed up. The full menu is below.</p>
      </header>

      <nav className="mbg-dash__actions" aria-label="Quick actions">
        <a className="mbg-dash__action mbg-dash__action--primary" href="/admin/collections/events/create">
          + New event
        </a>
        <a className="mbg-dash__action" href="/admin/collections/registrations">
          Registrations
        </a>
        <a className="mbg-dash__action" href="/admin/collections/press/create">
          + Press item
        </a>
        <a className="mbg-dash__action" href="/admin/globals/home">
          Edit home page
        </a>
      </nav>

      <div className="mbg-dash__grid">
        <section className="mbg-dash__panel">
          <div className="mbg-dash__panel-head">
            <h2>Sign-ups to watch</h2>
            <a href="/admin/collections/events">All events</a>
          </div>
          {watch.length === 0 ? (
            <p className="mbg-dash__empty">
              No upcoming events are taking sign-ups.{' '}
              <a href="/admin/collections/events/create">Add one →</a>
            </p>
          ) : (
            <ul className="mbg-dash__list">
              {watch.map((event) => {
                const full = event.capacity !== null && event.taken >= event.capacity
                const pct =
                  event.capacity && event.capacity > 0
                    ? Math.min(100, Math.round((event.taken / event.capacity) * 100))
                    : 0
                return (
                  <li key={event.id} className="mbg-dash__event">
                    <a href={`/admin/collections/events/${event.id}`}>
                      <div className="mbg-dash__event-top">
                        <span className="mbg-dash__event-title">{event.title}</span>
                        <span className="mbg-dash__event-date">{shortDate(event.startsAt)}</span>
                      </div>
                      <div className="mbg-dash__event-meta">
                        {TYPE_LABEL[event.type] ?? 'Event'}
                        {event.capacity !== null ? (
                          <span className={`mbg-dash__seats${full ? ' is-full' : ''}`}>
                            {event.taken} / {event.capacity} seats
                            {event.waitlisted > 0 ? ` · ${event.waitlisted} waitlisted` : ''}
                          </span>
                        ) : (
                          <span className="mbg-dash__seats">{event.taken} signed up</span>
                        )}
                      </div>
                      {event.capacity !== null ? (
                        <div className="mbg-dash__bar" aria-hidden="true">
                          <span
                            className={full ? 'is-full' : ''}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      ) : null}
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="mbg-dash__panel">
          <div className="mbg-dash__panel-head">
            <h2>Latest sign-ups</h2>
            <a href="/admin/collections/registrations">All sign-ups</a>
          </div>
          {latest.docs.length === 0 ? (
            <p className="mbg-dash__empty">No sign-ups yet.</p>
          ) : (
            <ul className="mbg-dash__list">
              {latest.docs.map((reg) => {
                const eventTitle =
                  reg.event && typeof reg.event === 'object' && 'title' in reg.event
                    ? (reg.event as { title?: string }).title
                    : undefined
                return (
                  <li key={reg.id} className="mbg-dash__reg">
                    <a href={`/admin/collections/registrations/${reg.id}`}>
                      <span className="mbg-dash__reg-name">{reg.name}</span>
                      <span className={`mbg-dash__status mbg-dash__status--${reg.status}`}>
                        {reg.status}
                      </span>
                      <span className="mbg-dash__reg-event">
                        {eventTitle ?? 'Event'}
                        {typeof reg.partySize === 'number' && reg.partySize > 1
                          ? ` · party of ${reg.partySize}`
                          : ''}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
