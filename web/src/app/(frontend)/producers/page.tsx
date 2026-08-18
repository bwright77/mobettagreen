import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Producers' }

export default async function ProducersPage() {
  const payload = await getPayload({ config: await config })
  const producers = await payload.find({
    collection: 'producers',
    sort: 'name',
    limit: 200,
    depth: 1,
  })

  return (
    <div className="wrap section">
      <p className="eyebrow">Buy direct</p>
      <div className="section__head">
        <h2>Ranchers &amp; growers we work with</h2>
      </div>
      {producers.docs.length > 0 ? (
        <ul className="card-grid">
          {producers.docs.map((producer) => {
            const Card = producer.buyUrl ? 'a' : 'div'
            return (
              <li key={producer.id}>
                <Card
                  className="card"
                  {...(producer.buyUrl
                    ? { href: producer.buyUrl, target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {producer.location ? <p className="card__meta">{producer.location}</p> : null}
                  <h3>{producer.name}</h3>
                  {producer.sells ? <p>{producer.sells}</p> : null}
                  {producer.buyUrl ? <span className="card__tag">Buy direct &rarr;</span> : null}
                </Card>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="empty">
          <p>Producers will be listed here, each linking out so you can buy direct.</p>
        </div>
      )}
    </div>
  )
}
