import type { CollectionConfig } from 'payload'

/** Organizations Mo'Betta Green works with. */
export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Partner', plural: 'Partners' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'url'],
    group: 'Content',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'url', type: 'text', admin: { description: 'Their website.' } },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'blurb',
      type: 'textarea',
      admin: { description: 'A sentence on what you do together.' },
    },
    {
      name: 'order',
      type: 'number',
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
  ],
}
