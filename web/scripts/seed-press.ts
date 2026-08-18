/**
 * Seeds press coverage of Miss Bev and the Marketplace. Every URL here was
 * checked and returns 200. Idempotent — matches on URL, so re-running updates
 * rather than duplicating.
 *
 *   npx tsx --env-file=.env.local scripts/seed-press.ts
 *
 * This is a starting set from public search. Miss Bev almost certainly has
 * broadcast and print that doesn't surface online; add those through the admin.
 */
import { getPayload } from 'payload'

import config from '../src/payload.config'

type PressSeed = {
  title: string
  outlet: string
  url: string
  publishedAt?: string
  excerpt?: string
  featured?: boolean
}

const PRESS: PressSeed[] = [
  {
    title: 'Black Yoga Collectives Aim to Make Space for Healing',
    outlet: 'The New York Times',
    url: 'https://www.nytimes.com/2020/07/27/style/black-yoga-collectives.html',
    publishedAt: '2020-07-27',
    excerpt:
      'Beverly Grant on finding balance through yoga after the loss of her son Reese, and the movement to make yoga a space for communities of color. Produced with Kaiser Health News.',
    featured: true,
  },
  {
    title: "Mo' Betta Green celebrates 13th marketplace in Five Points",
    outlet: 'Rocky Mountain PBS',
    url: 'https://www.rmpbs.org/news/rocky-mountain-pbs/mo-betta-green',
    featured: true,
  },
  {
    title: 'Serving up food justice: Beverly Grant and Mo Betta Green embody the spirit of community',
    outlet: 'The Denver VOICE',
    url: 'https://www.denvervoice.org/archive/2024/8/19/serving-up-food-justice-beverly-grant-and-mo-betta-green-embody-the-spirit-of-community',
    publishedAt: '2024-08-20',
    featured: true,
  },
  {
    title: "Mo' Betta Green Marketplace brings low-cost, healthy food to Denver food deserts",
    outlet: 'CBS Colorado',
    url: 'https://www.cbsnews.com/colorado/news/denver-mo-betta-green-marketplace-low-cost-healthy-food-deserts/',
    publishedAt: '2023-05-12',
  },
  {
    title: "How Mo'Betta Green Is Seeding Change in Denver Neighborhoods",
    outlet: '5280',
    url: 'https://5280.com/how-mobetta-green-is-seeding-change-in-denver-neighborhoods/',
  },
  {
    title: "Beverly Grant's Mo' Betta Mission",
    outlet: '5280',
    url: 'https://www.5280.com/2015/06/beverly-grants-mo-betta-mission/',
    publishedAt: '2015-06-01',
  },
  {
    title: "Mo' Betta Green feeds Denver's under-resourced neighborhoods",
    outlet: 'The Cool Down',
    url: 'https://www.thecooldown.com/sustainable-food/mo-betta-green-beverly-grant-denver/',
  },
  {
    title: "Beverly Grant of Mo' Betta Green MarketPlace talks about food deserts and urban agriculture",
    outlet: 'Westword',
    url: 'https://www.westword.com/restaurants/beverly-grant-of-mo-betta-green-marketplace-talks-about-food-deserts-and-urban-agriculture-5759197',
  },
  {
    title: "Community Connection: Beverly Grant of R&B's Mo' Betta Green Marketplaces",
    outlet: 'KUVO Jazz',
    url: 'https://www.kuvo.org/news/community-connection-beverly-grant-of-randb-mo-betta-green-marketplaces',
  },
  {
    title: 'Namaste Noir: A Colorado yoga co-op seeks to diversify, heal racialized trauma',
    outlet: 'The Colorado Sun',
    url: 'https://coloradosun.com/2020/08/09/yoga-healing-racial-trauma-black-lives-matter/',
    publishedAt: '2020-08-09',
  },
  {
    title: "Move to diversify yoga to heal racialized trauma part of Denver co-op's mission",
    outlet: 'Colorado Newsline',
    url: 'https://coloradonewsline.com/2020/07/30/move-to-diversify-yoga-to-heal-racialized-trauma-part-of-denver-co-ops-mission/',
    publishedAt: '2020-07-30',
  },
  {
    title: 'Beverly D. Grant named a Livingston Fellow',
    outlet: 'Bonfils-Stanton Foundation',
    url: 'https://www.bonfils-stantonfoundation.org/livingston-fellows/beverly-d-grant',
    publishedAt: '2025-05-14',
    excerpt:
      'Recognised for community leadership and advocacy in Denver. The profile describes the 15-year-old MarketPlace and her 13 years hosting on KGNU public radio.',
  },
  {
    title:
      'Bonfils-Stanton Foundation announces its 20th-anniversary Livingston Fellowship cohort',
    outlet: 'Bonfils-Stanton Foundation',
    url: 'https://www.bonfils-stantonfoundation.org/stories/2025-fellowship-pr',
    publishedAt: '2025-05-14',
    excerpt: 'Beverly Grant named among the 2025 Livingston Fellows.',
  },
]

// Organizational profiles rather than journalism — these belong under partners.
const RETIRED_FROM_PRESS = [
  'https://biggreen.org/our-impact/mo-betta-green-marketplace/',
  'https://anthropocenealliance.org/mo-betta-green-marketplace-and-seeds-of-power-unity-farm/',
]

const PARTNERS = [
  {
    name: 'Big Green',
    url: 'https://biggreen.org/',
    blurb: 'Supports the marketplace and its work on food access across Denver.',
  },
  {
    name: 'Anthropocene Alliance',
    url: 'https://anthropocenealliance.org/',
    blurb: 'Partners with Mo’Betta Green and Seeds of Power Unity Farm.',
  },
  {
    name: 'Confluence Colorado',
    url: 'https://www.confluenceco.org/',
    blurb: 'Fiscal agent for Mo’Betta Green since 2023, supporting the program side of the work.',
  },
  {
    name: 'Satya Yoga Cooperative',
    url: 'https://satyayogacooperative.com/',
    blurb: 'BIPOC-led yoga cooperative in Denver, co-founded by Beverly Grant.',
  },
]

const payload = await getPayload({ config })

for (const item of PRESS) {
  const existing = await payload.find({
    collection: 'press',
    where: { url: { equals: item.url } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    await payload.update({ collection: 'press', id: existing.docs[0].id, data: item })
    console.log('updated  ' + item.outlet + ' — ' + item.title.slice(0, 48))
  } else {
    await payload.create({ collection: 'press', data: item })
    console.log('created  ' + item.outlet + ' — ' + item.title.slice(0, 48))
  }
}

for (const url of RETIRED_FROM_PRESS) {
  const found = await payload.find({ collection: 'press', where: { url: { equals: url } }, limit: 1 })
  if (found.docs.length > 0) {
    await payload.delete({ collection: 'press', id: found.docs[0].id })
    console.log('removed from press (is a partner, not coverage): ' + url.slice(8, 40))
  }
}

for (const partner of PARTNERS) {
  const existing = await payload.find({
    collection: 'partners',
    where: { name: { equals: partner.name } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    await payload.update({ collection: 'partners', id: existing.docs[0].id, data: partner })
    console.log('updated  partner ' + partner.name)
  } else {
    await payload.create({ collection: 'partners', data: partner })
    console.log('created  partner ' + partner.name)
  }
}

const total = await payload.find({ collection: 'press', limit: 0, depth: 0 })
console.log('\npress items: ' + total.totalDocs)
process.exit(0)
