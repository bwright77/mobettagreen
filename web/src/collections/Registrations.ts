import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

const SEAT_HOLDING_STATUSES = ['pending', 'confirmed', 'waitlisted']

/**
 * Sign-ups for events — RSVPs and paid registrations both land here, so there is
 * one list to look at per event regardless of how people signed up.
 */
export const Registrations: CollectionConfig = {
  slug: 'registrations',
  labels: { singular: 'Registration', plural: 'Registrations' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'event', 'partySize', 'status', 'createdAt'],
    group: 'Programming',
  },
  access: {
    // Sign-up details are personal — only signed-in staff can read them.
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      index: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'email', type: 'email', required: true, index: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', admin: { width: '50%' } },
        {
          name: 'partySize',
          type: 'number',
          required: true,
          defaultValue: 1,
          min: 1,
          admin: { width: '50%', description: 'Seats taken by this sign-up.' },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'confirmed',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Waitlisted', value: 'waitlisted' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Dietary needs, accessibility, anything else.' },
    },
    {
      type: 'collapsible',
      label: 'Payment',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'amountPaid',
          type: 'number',
          admin: { readOnly: true, description: 'In dollars. Empty for free events.' },
        },
        {
          name: 'stripePaymentIntent',
          type: 'text',
          admin: { readOnly: true },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        // Capacity is only meaningful if it is actually enforced.
        if (data.status === 'cancelled') return data

        const eventId =
          typeof data.event === 'object' && data.event !== null ? data.event.id : data.event
        if (!eventId) return data

        const event = await req.payload.findByID({
          collection: 'events',
          id: eventId,
          depth: 0,
        })

        if (event.signup === 'none') {
          throw new APIError(`"${event.title}" is not taking sign-ups.`, 400)
        }

        if (!event.capacity) return data // unlimited

        const taken = await req.payload.find({
          collection: 'registrations',
          depth: 0,
          limit: 0,
          pagination: false,
          where: {
            and: [
              { event: { equals: eventId } },
              { status: { in: SEAT_HOLDING_STATUSES } },
              ...(operation === 'update' && originalDoc?.id
                ? [{ id: { not_equals: originalDoc.id } }]
                : []),
            ],
          },
        })

        const seatsTaken = taken.docs.reduce(
          (sum, doc) => sum + (typeof doc.partySize === 'number' ? doc.partySize : 1),
          0,
        )
        const requested = typeof data.partySize === 'number' ? data.partySize : 1

        if (seatsTaken + requested > event.capacity) {
          if (event.waitlist) {
            data.status = 'waitlisted'
            return data
          }
          const remaining = Math.max(0, event.capacity - seatsTaken)
          throw new APIError(
            remaining === 0
              ? `"${event.title}" is full.`
              : `"${event.title}" has only ${remaining} seat${remaining === 1 ? '' : 's'} left.`,
            409,
          )
        }

        return data
      },
    ],
  },
}
