import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

/**
 * Standing pages — the story, RGC Day, anything narrative.
 *
 * Long pages are built from `sections` rather than one rich-text body, so a
 * photograph stays paired with the prose it belongs to and editing the words
 * can't flatten the layout.
 */
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
      name: 'eyebrow',
      type: 'text',
      admin: { description: 'Small line above the title.' },
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: { description: 'The opening paragraph, and used in link previews.' },
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Sections',
      admin: {
        description:
          'Each section is a heading and some text, with an optional photograph beside it. Sections alternate sides down the page.',
      },
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'richText' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          type: 'row',
          fields: [
            {
              name: 'ratio',
              type: 'select',
              defaultValue: '4 / 3',
              admin: { width: '50%', description: 'Shape of the photograph.' },
              options: [
                { label: 'Landscape (4:3)', value: '4 / 3' },
                { label: 'Wide (3:2)', value: '3 / 2' },
                { label: 'Square (1:1)', value: '1 / 1' },
                { label: 'Portrait (3:4)', value: '3 / 4' },
                { label: 'Tall (11:20)', value: '11 / 20' },
              ],
            },
            {
              name: 'tilt',
              type: 'select',
              defaultValue: '1',
              admin: { width: '50%', description: 'How the photograph sits. Vary it.' },
              options: ['1', '2', '3', '4', '5'].map((v) => ({ label: v, value: v })),
            },
          ],
        },
      ],
    },
  ],
}
