import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

await payload.updateGlobal({
  slug: 'settings',
  data: {
    vendorApplicationUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScr6Iiqi7jHN-JEK0AxRzc7gp_rNnf-ZPhLOXCG-RPkmpJcHA/viewform',
    vendorApplicationNote:
      'Saturdays, 10am–2pm at Charles Cousins Plaza, 2401 Welton St. The 2026 season runs 27 June through 10 October.',
  },
})

const s = await payload.findGlobal({ slug: 'settings' })
console.log('vendor link set:', String(s.vendorApplicationUrl).slice(0, 62) + '...')
console.log('note:', s.vendorApplicationNote)
// Give the pool back rather than exiting hard — a stranded session
// counts against Supabase's 15-client limit until it times out.
await payload.db.destroy?.()
process.exit(0)
