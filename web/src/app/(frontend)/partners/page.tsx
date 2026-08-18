import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Partners' }

export default async function PartnersPage() {
  const payload = await getPayload({ config: await config })
  const partners = await payload.find({
    collection: 'partners',
    sort: ['order', 'name'],
    limit: 200,
    depth: 1,
  })

  return (
    <div className="wrap section">
      <p className="eyebrow">Working together</p>
      <div className="section__head">
        <h2>Partners</h2>
      </div>
      {partners.docs.length > 0 ? (
        <ul className="card-grid">
          {partners.docs.map((partner) => {
            const Card = partner.url ? 'a' : 'div'
            return (
              <li key={partner.id}>
                <Card
                  className="card"
                  {...(partner.url
                    ? { href: partner.url, target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <h3>{partner.name}</h3>
                  {partner.blurb ? <p>{partner.blurb}</p> : null}
                  {partner.url ? <span className="card__tag">Visit &rarr;</span> : null}
                </Card>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="empty">
          <p>Partner organizations will be listed here.</p>
        </div>
      )}
    </div>
  )
}
