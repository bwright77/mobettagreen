import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

/** Standing pages — the story, RGC Day, partnerships, anything narrative. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'summary',
      type: 'textarea',
      admin: { description: 'Used in listings and link previews.' },
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
  ],
}
