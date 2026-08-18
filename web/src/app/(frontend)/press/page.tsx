import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Press' }

export default async function PressPage() {
  const payload = await getPayload({ config: await config })
  const press = await payload.find({
    collection: 'press',
    sort: ['-featured', '-publishedAt'],
    limit: 200,
    depth: 0,
  })

  return (
    <div className="wrap section">
      <p className="eyebrow">Coverage</p>
      <div className="section__head">
        <h2>Miss Bev &amp; the Marketplace in the press</h2>
      </div>
      <ul className="card-grid">
        {press.docs.map((item) => (
          <li key={item.id}>
            <a className="card" href={item.url} target="_blank" rel="noopener noreferrer">
              <p className="card__meta">
                {item.outlet}
                {item.publishedAt
                  ? ` · ${new Date(item.publishedAt).getUTCFullYear()}`
                  : ''}
              </p>
              <h3>{item.title}</h3>
              {item.excerpt ? <p>{item.excerpt}</p> : null}
              <span className="card__tag">Read the story &rarr;</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
