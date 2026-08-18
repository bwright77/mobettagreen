import type { CollectionConfig } from 'payload'

/** Coverage of Miss Bev and the Marketplace. Links out; we don't host the articles. */
export const Press: CollectionConfig = {
  slug: 'press',
  labels: { singular: 'Press item', plural: 'Press' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'outlet', 'publishedAt'],
    group: 'Content',
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'outlet', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'publishedAt',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    {
      name: 'dateIsApproximate',
      type: 'checkbox',
      label: 'Year only — exact date unknown',
      admin: {
        position: 'sidebar',
        description:
          'Some pieces carry no date and have to be placed from their content. Ticking this shows only the year rather than asserting a day we do not know.',
      },
    },
    { name: 'url', type: 'text', required: true, admin: { description: 'Full link to the article.' } },
    {
      name: 'byline',
      type: 'text',
      admin: { description: 'Author, as credited by the outlet.' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'A line or two worth pulling out. Optional.' },
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: "Article's own image (link)",
      admin: {
        description:
          "The outlet's lead image, hotlinked rather than copied — the same thing a link preview shows. Leave to the seed script, or paste an og:image URL.",
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Our own or licensed art. Takes precedence over the hotlinked image.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: { position: 'sidebar', description: 'Show this one first.' },
    },
  ],
}
