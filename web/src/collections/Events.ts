import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

/**
 * One collection for everything that happens on a date — market days, classes,
 * farm dinners, Juneteenth, RGC Day. Adding anything is the same task, and
 * "where is the market this week" is one query.
 *
 * Signing up, capacity, and price are three independent axes, so every
 * combination is expressible:
 *
 *   free + open        signup: none   (or rsvp with no capacity)
 *   free + limited     signup: rsvp   capacity: n
 *   paid + limited     signup: paid   capacity: n   price: n
 *   paid + unlimited   signup: paid   price: n      capacity: empty
 */
export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'startsAt', 'signup'],
    group: 'Programming',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'market',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Market day', value: 'market' },
        { label: 'Class', value: 'class' },
        { label: 'Farm dinner', value: 'dinner' },
        { label: 'Annual celebration', value: 'annual' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
          required: true,
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
        {
          name: 'endsAt',
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
      ],
    },
    {
      name: 'locationName',
      type: 'text',
      label: 'Location',
      admin: { description: 'e.g. Mosaic campus, or 2401 Welton St' },
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: { description: 'One or two lines, used in listings.' },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },

    {
      type: 'collapsible',
      label: 'Signing up',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'signup',
          type: 'select',
          required: true,
          defaultValue: 'none',
          label: 'How people sign up',
          options: [
            { label: 'No sign-up — open to all, just show up', value: 'none' },
            { label: 'RSVP — collect names, no payment', value: 'rsvp' },
            { label: 'Paid — collect payment to attend', value: 'paid' },
          ],
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
          admin: {
            description: 'Per person, in dollars.',
            condition: (_data, siblingData) => siblingData?.signup === 'paid',
          },
        },
        {
          name: 'capacity',
          type: 'number',
          min: 1,
          admin: {
            description: 'Total seats. Leave empty for unlimited.',
            condition: (_data, siblingData) => siblingData?.signup !== 'none',
          },
        },
        {
          name: 'waitlist',
          type: 'checkbox',
          label: 'Take a waitlist once full',
          admin: {
            condition: (_data, siblingData) =>
              siblingData?.signup !== 'none' && Boolean(siblingData?.capacity),
          },
        },
        {
          name: 'signupClosesAt',
          type: 'date',
          label: 'Sign-ups close',
          admin: {
            description: 'Leave empty to accept sign-ups until the event starts.',
            date: { pickerAppearance: 'dayAndTime' },
            condition: (_data, siblingData) => siblingData?.signup !== 'none',
          },
        },
      ],
    },
  ],
}
