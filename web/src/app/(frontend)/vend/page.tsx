import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'

export const dynamic = 'force-dynamic'

/**
 * Short link for the vendor application, so Miss Bev can post mobettagreen.org/vend
 * rather than a hundred-character Google Forms URL. The destination lives in site
 * settings, so it can change without a deploy.
 */
export default async function VendPage() {
  const payload = await getPayload({ config: await config })
  const settings = await payload.findGlobal({ slug: 'settings' })

  if (settings?.vendorApplicationUrl) {
    redirect(settings.vendorApplicationUrl)
  }

  // No link set — send people somewhere useful rather than nowhere.
  redirect('/events')
}
