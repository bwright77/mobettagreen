import type { GlobalConfig } from 'payload'

/**
 * The home page, as editable fields rather than a rich-text blob.
 *
 * Structured this way so changing the words can't collapse the design — each
 * field lands in a known place. A single body field would let an edit replace
 * the hero, the ribbon and the pillars with one column of text.
 */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home page',
  admin: { group: 'Content' },
  access: { read: () => true },
  fields: [
    {
      type: 'collapsible',
      label: 'Hero',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'heroLineOne',
              type: 'text',
              required: true,
              defaultValue: 'Something good',
              admin: { width: '50%', description: 'First line, in brown.' },
            },
            {
              name: 'heroLineTwo',
              type: 'text',
              required: true,
              defaultValue: 'is growing.',
              admin: { width: '50%', description: 'Second line, in green.' },
            },
          ],
        },
        {
          name: 'heroLede',
          type: 'textarea',
          required: true,
          defaultValue:
            'Fresh produce, free wellness classes, live music, and neighbors feeding neighbors — across Denver’s east side since 2010.',
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'Torn band',
      fields: [
        {
          name: 'ribbonText',
          type: 'text',
          required: true,
          defaultValue: 'Traceable Origin, Organic, Local, Delicious = Integris Food®',
          admin: {
            description:
              'The line in the torn brown strip. The initials of Traceable, Organic, Local and Delicious are highlighted automatically — they spell TOLD.',
          },
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'Founder',
      fields: [
        {
          name: 'founderQuote',
          type: 'text',
          required: true,
          defaultValue: 'Growing food and sharing it changes lives.',
        },
        {
          name: 'founderAttribution',
          type: 'text',
          required: true,
          defaultValue: 'Beverly Grant, Founder',
        },
        {
          name: 'founderNote',
          type: 'textarea',
          defaultValue:
            'Born and raised in Northeast Park Hill, Miss Beverly built Mo’Betta Green to put good food back in the neighborhoods that lost it.',
        },
        { name: 'founderImage', type: 'upload', relationTo: 'media' },
      ],
    },

    {
      name: 'pillars',
      type: 'array',
      label: 'What we do',
      minRows: 0,
      maxRows: 4,
      admin: { description: 'The three cards under the market panel.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
            {
              name: 'icon',
              type: 'select',
              required: true,
              defaultValue: 'basket',
              admin: { width: '40%' },
              options: [
                { label: 'Basket', value: 'basket' },
                { label: 'Heart', value: 'heart' },
                { label: 'Sprout', value: 'sprout' },
              ],
            },
          ],
        },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
  ],
}
