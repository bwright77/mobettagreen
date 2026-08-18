/**
 * Moves the copy and photographs that were hardcoded in the page components
 * into the CMS, so Beverly or a volunteer can edit them.
 *
 *   npx tsx --env-file=.env.local scripts/seed-content.ts
 *
 * Idempotent. Media is matched on filename, so re-running won't duplicate
 * uploads. Existing page sections are left alone — this only fills a page that
 * has none, so it can never overwrite her words.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const imagesDir = path.resolve(dirname, '../public/images')

const payload = await getPayload({ config })

/** Rich text for a couple of plain paragraphs. */
const para = (...paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        { type: 'text', text, format: 0, style: '', detail: 0, mode: 'normal', version: 1 },
      ],
    })),
  },
})

async function upload(filename: string, alt: string) {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    console.log('  media exists  ' + filename)
    return existing.docs[0]
  }
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(imagesDir, filename),
  })
  console.log('  uploaded      ' + filename)
  return doc
}

// ---------------------------------------------------------------- media --

const beverly = await upload(
  'miss-beverly.jpg',
  "Beverly Grant waving beneath the red Mo'Betta Green canopy at the market, sunflowers and pumpkins in the foreground.",
)
const tomatoes = await upload(
  'sop_green_tomatoes_2018.jpg',
  "Beverly Grant in a Mo'Betta Green T-shirt and straw hat, leaning on the tailgate of a red pickup loaded with crates of tomatoes.",
)
const children = await upload(
  'greens-seeds.jpg',
  'Two children running along a planted row at the farm, beans and greens either side, houses and evening sun beyond.',
)
const truck = await upload(
  'sop_truck_produce.jpg',
  'A grower in a straw hat lifting a crate of chard into the bed of a red pickup already loaded with kale and lettuce.',
)
const rgcMark = await upload(
  'rgc_logo.jpeg',
  'Random Gestures of Compassion — The Reese Grant-Cobb Legacy. An illustrated portrait of Reese beside the lettering.',
)

// ----------------------------------------------------------- home page --

await payload.updateGlobal({
  slug: 'home',
  data: {
    heroLineOne: 'Something good',
    heroLineTwo: 'is growing.',
    heroLede:
      'Fresh produce, free wellness classes, live music, and neighbors feeding neighbors — across Denver’s east side since 2010.',
    ribbonText: 'Traceable Origin, Organic, Local, Delicious = Integris Food®',
    founderQuote: 'Growing food and sharing it changes lives.',
    founderAttribution: 'Beverly Grant, Founder',
    founderNote:
      'Born and raised in Northeast Park Hill, Miss Beverly built Mo’Betta Green to put good food back in the neighborhoods that lost it.',
    founderImage: beverly.id,
    pillars: [
      {
        title: 'The MarketPlace',
        icon: 'basket',
        body: 'A Black-owned farmers market bringing fresh, affordable food to Denver’s east side. SNAP and Double Up welcome at the table.',
      },
      {
        title: 'HEAL',
        icon: 'heart',
        body: 'Healthy Eating, Active Living. Free cooking demos, nutrition education, and movement — yoga, Qi Gong, Zumba, and dance — open to every body.',
      },
      {
        title: 'Seeds of Power Unity Farm',
        icon: 'sprout',
        body: 'Urban growing sites across Cole, Uptown, and Northeast Park Hill — where the produce and the next generation of farmers come up.',
      },
    ],
  },
})
console.log('  home page content set')

// ----------------------------------------------------------- our story --

const storySections = [
  {
    heading: 'How it started',
    body: para(
      'Denver’s east side went from a middle-class Black neighborhood to a food desert — a community without a grocery store. Miss Bev watched it happen from Northeast Park Hill in the 1970s, and in 2010 she started a traveling farmers market to change it, built on three principles: food literacy, environmental stewardship, and social responsibility.',
    ),
    image: tomatoes.id,
    ratio: '1 / 1' as const,
    tilt: '1' as const,
  },
  {
    heading: 'What it grew into',
    body: para(
      'A season of markets across the east side, from Five Points to Green Valley Ranch. Seeds of Power Unity Farm, growing on sites in Cole, Uptown, and Northeast Park Hill. Free cooking demos and nutrition education under HEAL — Healthy Eating, Active Living — alongside yoga, Qi Gong, Zumba, and dance. Community Farm Dinners, and a Juneteenth Freedom Celebration.',
      'It runs on two full-time staff and about fifteen volunteers, and it takes SNAP at the table.',
    ),
    image: children.id,
    ratio: '1 / 1' as const,
    tilt: '4' as const,
  },
  {
    heading: 'What compassion asks',
    body: para(
      'In 2018 Miss Bev’s youngest son, Reese, was killed, weeks after he finished high school. Random Gestures of Compassion Day came out of that loss. It is held every July 20 — his birthday — carries his initials, and is proclaimed by the Denver Mayor’s Office.',
      'The day asks for the thing Reese practiced: intentional kindness, and making a stranger a friend.',
    ),
    image: rgcMark.id,
    ratio: '1 / 1' as const,
    tilt: '2' as const,
  },
  {
    heading: 'The measure of it',
    body: para(
      'These numbers need to come from Miss Bev. Pounds of produce moved, SNAP dollars matched, households served, youth employed, free classes held — the press covers the mission but never the figures, so they live in her grant reports rather than anywhere public. Nothing is estimated here.',
    ),
    image: truck.id,
    ratio: '11 / 20' as const,
    tilt: '5' as const,
  },
]

const story = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'our-story' } },
  limit: 1,
})

const storyData = {
  title: 'Rooted in Five Points',
  slug: 'our-story',
  eyebrow: 'Since 2010 · Five Points, Denver',
  summary:
    'Beverly Grant grew up in Northeast Park Hill watching a thriving Black neighborhood lose its grocery stores. In 2010 she started a farmers market to put good food back, and it has since become a farm, a set of free classes, and a place people come to be well.',
}

if (story.docs.length === 0) {
  await payload.create({
    collection: 'pages',
    data: { ...storyData, sections: storySections },
  })
  console.log('  our-story created')
} else if ((story.docs[0].sections ?? []).length === 0) {
  await payload.update({
    collection: 'pages',
    id: story.docs[0].id,
    data: { ...storyData, sections: storySections },
  })
  console.log('  our-story filled')
} else {
  console.log('  our-story already has sections — left alone')
}

// -------------------------------------------------------------- rgc day --

const rgc = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'rgc-day' } },
  limit: 1,
})
if (rgc.docs.length > 0) {
  await payload.update({
    collection: 'pages',
    id: rgc.docs[0].id,
    data: { eyebrow: 'Every July 20 · Proclaimed in Denver by the Mayor’s Office' },
  })
  console.log('  rgc-day eyebrow set (sections left for Miss Bev)')
}

await payload.db.destroy?.()
process.exit(0)
