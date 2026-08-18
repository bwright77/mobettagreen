import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    // Email stays the title: it's the login credential, always present, and
    // unique. The name fields below are for display (greetings, the account
    // menu), not identity.
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName'],
  },
  auth: true,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          // Optional on purpose. This is an auth collection, and Payload
          // validates fields on its own internal writes (login-attempt
          // counters, password resets) — a required name left empty on an
          // existing account can block that account from logging in.
          admin: { width: '50%' },
        },
        {
          name: 'lastName',
          type: 'text',
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
