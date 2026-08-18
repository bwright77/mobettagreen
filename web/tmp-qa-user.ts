import { getPayload } from 'payload'
import config from './src/payload.config'

const payload = await getPayload({ config })
const email = 'qa-temp@mobettagreen.invalid'

const existing = await payload.find({
  collection: 'users', where: { email: { equals: email } }, limit: 1,
})
if (existing.docs.length > 0) {
  await payload.delete({ collection: 'users', id: existing.docs[0].id })
}
await payload.create({ collection: 'users', data: { email, password: 'QaTemp123!verify' } })
console.log('temp QA user ready:', email)
await payload.db.destroy?.()
process.exit(0)
