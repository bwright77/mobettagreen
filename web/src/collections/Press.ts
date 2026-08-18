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
    { name: 'url', type: 'text', required: true, admin: { description: 'Full link to the article.' } },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'A line or two worth pulling out. Optional.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'featured',
      type: 'checkbox',
      admin: { position: 'sidebar', description: 'Show this one first.' },
    },
  ],
}
