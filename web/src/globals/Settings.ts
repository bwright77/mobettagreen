import type { GlobalConfig } from 'payload'

/** Site-wide values that change without a deploy. */
export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Site settings',
  admin: { group: 'Content' },
  access: { read: () => true },
  fields: [
    {
      name: 'vendorApplicationUrl',
      type: 'text',
      label: 'Vendor application link',
      admin: {
        description:
          'Where /vend sends people. A short link is easier to post on Facebook than the full form URL.',
      },
    },
    {
      name: 'vendorApplicationNote',
      type: 'textarea',
      label: 'Vendor application note',
      admin: { description: 'Shown above the button. Season dates, fees, anything vendors should know first.' },
    },
  ],
}
