import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import config from '@/payload.config'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mobettagreen.org'

// The hand-authored pages. Everything else in the sitemap is generated from
// content, so a new event shows up here the moment it's saved.
const staticPaths = [
  '',
  '/our-story',
  '/rgc-day',
  '/events',
  '/press',
  '/partners',
  '/producers',
  '/vend',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))

  // Every event detail page. If the CMS is unreachable at build time, still
  // ship the static map rather than failing the whole route.
  try {
    const payload = await getPayload({ config: await config })
    const events = await payload.find({
      collection: 'events',
      limit: 500,
      depth: 0,
      pagination: false,
    })
    for (const event of events.docs) {
      if (!event.slug) continue
      entries.push({
        url: `${siteUrl}/events/${event.slug}`,
        lastModified: event.updatedAt ? new Date(event.updatedAt) : undefined,
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
  } catch (err) {
    console.error('sitemap: could not load events', err)
  }

  return entries
}
