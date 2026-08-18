import Image from 'next/image'
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
        <h1 className="hero__title">
          <span>Something good</span>
          <em>is growing.</em>
        </h1>
        <p className="hero__lede">
          Fresh produce, free wellness classes, live music, and neighbors feeding
          neighbors — across Denver&rsquo;s east side since 2010.
        </p>
      </section>

      {/* Torn brown ribbon from the market banner. The line spells TOLD — Miss
          Bev's rule for what food should be — so the initials are marked. */}
      <div className="ribbon">
        <p className="ribbon__text">
          <b>T</b>raceable Origin, <b>O</b>rganic, <b>L</b>ocal, <b>D</b>elicious = Integris
          Food<sup>&reg;</sup>
        </p>
      </div>

      <section className="founder wrap" aria-label="About the founder">
        <figure className="founder__photo">
          <Image
            src="/images/miss-beverly.jpg"
            width={972}
            height={732}
            alt="Beverly Grant waving beneath the red Mo'Betta Green canopy at the market, sunflowers and pumpkins in the foreground."
            priority
          />
        </figure>
        <blockquote className="founder__quote">
          <p>&ldquo;Growing food and sharing it changes lives.&rdquo;</p>
          <cite>Beverly Grant, Founder</cite>
          <p className="founder__note">
            Born and raised in Northeast Park Hill, Miss Beverly built Mo&rsquo;Betta Green
            to put good food back in the neighborhoods that lost it.
          </p>
        </blockquote>
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


      <section className="pillars wrap" aria-label="What we do">
        <ul className="pillars__list">
          <li className="pillar pillar--red">
            <span className="pillar__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 9h16l-1.3 10.2a2 2 0 0 1-2 1.8H7.3a2 2 0 0 1-2-1.8L4 9Z" />
                <path d="M8.5 9V7a3.5 3.5 0 0 1 7 0v2" />
              </svg>
            </span>
            <h2>The MarketPlace</h2>
            <p>
              A Black-owned farmers market bringing fresh, affordable food to Denver&rsquo;s
              east side. SNAP and Double Up welcome at the table.
            </p>
          </li>
          <li className="pillar pillar--green">
            <span className="pillar__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 20.5s-7.5-4.4-7.5-9.4A4.1 4.1 0 0 1 12 8.4a4.1 4.1 0 0 1 7.5 2.7c0 5-7.5 9.4-7.5 9.4Z" />
              </svg>
            </span>
            <h2>HEAL</h2>
            <p>
              <strong>Healthy Eating, Active Living.</strong> Free cooking demos, nutrition
              education, and movement &mdash; yoga, Qi Gong, Zumba, and dance &mdash; open to
              every body.
            </p>
          </li>
          <li className="pillar pillar--brown">
            <span className="pillar__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 21c0-6 3-9 9-10-1 6-4 9-9 10Zm0 0c0-6-3-9-9-10 1 6 4 9 9 10Zm0 0V9" />
              </svg>
            </span>
            <h2>Seeds of Power Unity Farm</h2>
            <p>
              Urban growing sites across Cole, Uptown, and Northeast Park Hill &mdash; where
              the produce and the next generation of farmers come up.
            </p>
          </li>
        </ul>
      </section>

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
