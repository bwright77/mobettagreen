import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { TornBand } from '@/components/TornBand'
import { PressRow } from '@/components/PressRow'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Our Story',
  description:
    "How Mo'Betta Green grew from one market in Five Points into a farm, free classes, and a city-recognised day — and what it has meant for Denver's east side.",
}

/**
 * Everything stated here is drawn from published coverage and linked back to it.
 * The impact figures are the exception: they aren't in the press, so the numbers
 * are left for Miss Bev to supply rather than estimated.
 */
export default async function OurStoryPage() {
  const payload = await getPayload({ config: await config })

  const [found, press] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: { slug: { equals: 'our-story' } },
      limit: 1,
      depth: 1,
    }),
    payload.find({
      collection: 'press',
      where: { featured: { equals: true } },
      sort: '-publishedAt',
      limit: 3,
      depth: 1,
    }),
  ])
  const page = found.docs[0]

  return (
    <>
      <article className="wrap section story">
        <p className="eyebrow">Since 2010 · Five Points, Denver</p>
        <h1 className="story__title">{page?.title ?? 'Rooted in Five Points'}</h1>

        {page?.summary ? (
          <p className="story__lede">{page.summary}</p>
        ) : (
          <p className="story__lede">
            Beverly Grant grew up in Northeast Park Hill watching a thriving Black
            neighborhood lose its grocery stores. In 2010 she started a farmers market to
            put good food back, and it has since become a farm, a set of free classes, and
            a place people come to be well.
          </p>
        )}
      </article>

      <TornBand>
        <b>T</b>raceable Origin, <b>O</b>rganic, <b>L</b>ocal, <b>D</b>elicious = Integris
        Food<sup>&reg;</sup>
      </TornBand>

      <div className="wrap section story">
        {page?.body ? (
          <RichText data={page.body} />
        ) : (
          <>
            <section className="story__block">
              <h2>How it started</h2>
              <p>
                Denver&rsquo;s east side went from a middle-class Black neighbourhood to a
                food desert — a community without a grocery store. Miss Bev watched it
                happen from Northeast Park Hill in the 1970s, and in 2010 she started a
                travelling farmers market to change it, built on three principles: food
                literacy, environmental stewardship, and social responsibility.
              </p>
            </section>

            <section className="story__block">
              <h2>What it grew into</h2>
              <p>
                A season of markets across the east side, from Five Points to Green Valley
                Ranch. Seeds of Power Unity Farm, growing on sites in Cole, Uptown, and
                Northeast Park Hill. Free cooking demos and nutrition education under HEAL
                — Healthy Eating, Active Living — alongside yoga, Qi Gong, Zumba, and
                dance. Community Farm Dinners, and a Juneteenth Freedom Celebration.
              </p>
              <p>
                It runs on two full-time staff and about fifteen volunteers, and it takes
                SNAP at the table.
              </p>
            </section>

            <section className="story__block">
              <h2>What compassion asks</h2>
              <p>
                In 2018 Miss Bev&rsquo;s youngest son, Reese, was killed, weeks after he
                finished high school. Random Gestures of Compassion Day came out of that
                loss. It is held every July 20 — his birthday — carries his initials,
                and is proclaimed by the Denver Mayor&rsquo;s Office.
              </p>
              <p>
                The day asks for the thing Reese practiced: intentional kindness, and
                making a stranger a friend. <Link href="/rgc-day">More about RGC Day</Link>.
              </p>
            </section>

            <section className="story__block">
              <h2>The measure of it</h2>
              <div className="empty" style={{ textAlign: 'left' }}>
                <p>
                  <strong>These numbers need to come from Miss Bev.</strong> Pounds of
                  produce moved, SNAP dollars matched, households served, youth employed,
                  free classes held — the press covers the mission but never the figures,
                  so they live in her grant reports rather than anywhere public. Nothing is
                  estimated here.
                </p>
              </div>
            </section>
          </>
        )}
      </div>

      {press.docs.length > 0 ? (
        <section className="wrap section">
          <div className="section__head">
            <h2>Told elsewhere</h2>
            <Link className="section__more" href="/press">
              All coverage
            </Link>
          </div>
          <ul className="press-list">
            {press.docs.map((item) => (
              <PressRow key={item.id} item={item} showYear />
            ))}
          </ul>
        </section>
      ) : null}
    </>
  )
}
