import type { CollectionConfig } from 'payload'

/**
 * Ranchers and growers the market partners with. These link out so people can
 * buy direct — we are not selling their products for them.
 */
export const Producers: CollectionConfig = {
  slug: 'producers',
  labels: { singular: 'Producer', plural: 'Producers' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sells', 'buyUrl'],
    group: 'Content',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'sells',
      type: 'text',
      label: 'What they sell',
      admin: { description: 'e.g. Grass-fed beef, pasture-raised eggs' },
    },
    {
      name: 'buyUrl',
      type: 'text',
      label: 'Buy-direct link',
      admin: { description: 'Where people order from them.' },
    },
    { name: 'location', type: 'text', admin: { description: 'e.g. Yoder, Colorado' } },
    { name: 'story', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
