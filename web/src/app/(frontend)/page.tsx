import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { admissionLabel, whenLabel } from '@/lib/dates'
import { Wordmark } from '@/components/Wordmark'
import { TornBand } from '@/components/TornBand'
import { TellingInitials } from '@/components/TellingInitials'
import { PillarIcon } from '@/components/PillarIcon'

// The market schedule changes; don't serve a stale "next market" from cache.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config: await config })
  const now = new Date().toISOString()

  const [home, markets, upcoming, press] = await Promise.all([
    payload.findGlobal({ slug: 'home', depth: 1 }),
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
    // Featured coverage, newest first. Sorting on ['-featured', '-publishedAt']
    // silently ignored the first key and fell back to pure recency, which
    // surfaced two near-identical items — so pick featured explicitly.
    payload.find({
      collection: 'press',
      where: { featured: { equals: true } },
      sort: '-publishedAt',
      limit: 3,
      depth: 1,
    }),
  ])

  const nextMarket = markets.docs[0]

  const founderImage =
    home?.founderImage && typeof home.founderImage === 'object'
      ? (home.founderImage as { url?: string; width?: number; height?: number; alt?: string })
      : null
  const pillars = home?.pillars ?? []

  // Top up with the most recent coverage if fewer than three are featured.
  let pressDocs = press.docs
  if (pressDocs.length < 3) {
    const recent = await payload.find({
      collection: 'press',
      where: { featured: { not_equals: true } },
      sort: '-publishedAt',
      limit: 3 - pressDocs.length,
      depth: 1,
    })
    pressDocs = [...pressDocs, ...recent.docs]
  }

  return (
    <>
      <section className="wrap hero">
        {home?.heroEyebrow ? <p className="eyebrow hero__eyebrow">{home.heroEyebrow}</p> : null}
        <Wordmark />
        <h1 className="hero__title">
          <span>{home?.heroLineOne}</span>
          <em>{home?.heroLineTwo}</em>
        </h1>
        <p className="hero__lede">{home?.heroLede}</p>
      </section>

      {/* The line spells TOLD — Miss Bev's rule for what food should be — so the
          initials are marked, wherever the words are edited to. */}
      <TornBand>
        <TellingInitials text={home?.ribbonText ?? ''} />
      </TornBand>

      <section className="founder wrap" aria-label="About the founder">
        {founderImage?.url ? (
          <figure className="founder__photo">
            <Image
              src={founderImage.url}
              width={founderImage.width ?? 972}
              height={founderImage.height ?? 732}
              alt={founderImage.alt ?? ''}
              priority
            />
          </figure>
        ) : null}
        <blockquote className="founder__quote">
          <p>&ldquo;{home?.founderQuote}&rdquo;</p>
          <cite>{home?.founderAttribution}</cite>
          {home?.founderNote ? <p className="founder__note">{home.founderNote}</p> : null}
          <p className="founder__more">
            <Link href="/our-story">Read our story &rarr;</Link>
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


      {pillars.length > 0 ? (
        <section className="pillars wrap" aria-label="What we do">
          <ul className="pillars__list">
            {pillars.map((pillar, i) => (
              <li
                key={pillar.id ?? i}
                className={`pillar pillar--${['red', 'green', 'brown'][i % 3]}`}
              >
                <span className="pillar__icon" aria-hidden="true">
                  <PillarIcon name={pillar.icon} />
                </span>
                <h2>{pillar.title}</h2>
                <p>{pillar.body}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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

      {pressDocs.length > 0 ? (
        <section className="wrap section" aria-labelledby="press">
          <div className="section__head">
            <h2 id="press">In the press</h2>
            <Link className="section__more" href="/press">
              All coverage
            </Link>
          </div>
          <ul className="card-grid">
            {pressDocs.map((item) => {
              const uploaded =
                item.image && typeof item.image === 'object' ? item.image.url : undefined
              const src = uploaded ?? item.imageUrl
              return (
                <li key={item.id}>
                  <a className="card card--press" href={item.url} target="_blank" rel="noopener noreferrer">
                    {src ? (
                      <figure className="card__figure">
                        {/* The outlet's own lead image, hotlinked rather than copied. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`${item.outlet}: ${item.title}`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </figure>
                    ) : (
                      <figure className="card__figure card__figure--none">{item.outlet}</figure>
                    )}
                    <p className="card__meta">{item.outlet}</p>
                    <h3>{item.title}</h3>
                    {item.byline ? <p className="card__byline">By {item.byline}</p> : null}
                    <span className="card__tag">Read the story &rarr;</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}
    </>
  )
}
