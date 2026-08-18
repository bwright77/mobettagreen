import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { admissionLabel, whenLabel } from '@/lib/dates'
import { Wordmark } from '@/components/Wordmark'

// The market schedule changes; don't serve a stale "next market" from cache.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config: await config })
  const now = new Date().toISOString()

  const [markets, upcoming, press] = await Promise.all([
    payload.find({
      collection: 'events',
      where: { and: [{ type: { equals: 'market' } }, { startsAt: { greater_than: now } }] },
      sort: 'startsAt',
      limit: 1,
      depth: 0,
    }),
    payload.find({
      collection: 'events',
      where: { and: [{ type: { not_equals: 'market' } }, { startsAt: { greater_than: now } }] },
      sort: 'startsAt',
      limit: 6,
      depth: 0,
    }),
    // Featured first, then newest. Undated items sort ahead of dated ones on their
    // own, so featured is what keeps the strongest coverage at the top.
    payload.find({ collection: 'press', sort: ['-featured', '-publishedAt'], limit: 3, depth: 0 }),
  ])

  const nextMarket = markets.docs[0]

  return (
    <>
      <section className="wrap hero">
        <Wordmark />
        <p className="hero__tagline">Growing food and sharing it changes lives</p>
      </section>

      <div className="wrap">
        {nextMarket ? (
          <section className="next-market" aria-label="Next market">
            <div>
              <p className="eyebrow">Next market</p>
              <h2>{nextMarket.title}</h2>
              <p className="next-market__when">
                {whenLabel(nextMarket.startsAt, nextMarket.endsAt)}
                {nextMarket.locationName ? ` · ${nextMarket.locationName}` : ''}
              </p>
            </div>
            <Link className="btn btn--red" href={`/events/${nextMarket.slug}`}>
              Details
            </Link>
          </section>
        ) : (
          <section className="next-market" aria-label="Next market">
            <div>
              <p className="eyebrow">Next market</p>
              <h2>Dates for the coming season are on the way.</h2>
              <p className="next-market__when">
                Until they&rsquo;re posted, Facebook has the most current word.
              </p>
            </div>
            <a
              className="btn btn--red"
              href="https://www.facebook.com/mobettagreenMKT/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Check Facebook
            </a>
          </section>
        )}
      </div>

      <section className="wrap section" aria-labelledby="upcoming">
        <div className="section__head">
          <h2 id="upcoming">Classes, dinners &amp; celebrations</h2>
          <Link className="section__more" href="/events">
            All events
          </Link>
        </div>
        {upcoming.docs.length > 0 ? (
          <ul className="card-grid">
            {upcoming.docs.map((event) => (
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
            <p>Nothing on the calendar yet. Add events in the admin and they&rsquo;ll appear here.</p>
          </div>
        )}
      </section>

      {press.docs.length > 0 ? (
        <section className="wrap section" aria-labelledby="press">
          <div className="section__head">
            <h2 id="press">In the press</h2>
            <Link className="section__more" href="/press">
              All coverage
            </Link>
          </div>
          <ul className="card-grid">
            {press.docs.map((item) => (
              <li key={item.id}>
                <a className="card" href={item.url} target="_blank" rel="noopener noreferrer">
                  <p className="card__meta">{item.outlet}</p>
                  <h3>{item.title}</h3>
                  {item.excerpt ? <p>{item.excerpt}</p> : null}
                  <span className="card__tag">Read the story &rarr;</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  )
}
