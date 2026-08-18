'use server'

import { getPayload, APIError } from 'payload'
import { revalidatePath } from 'next/cache'

import config from '@/payload.config'

/**
 * Public event sign-up.
 *
 * The Registrations collection only lets signed-in staff create rows, so the
 * public can't POST to Payload's API directly. This runs on the server with the
 * Local API (which bypasses that access rule) but still fires the collection's
 * beforeChange hook — so capacity, the waitlist, and the "not taking sign-ups"
 * guard are all enforced in exactly one place rather than re-checked here.
 *
 * Paid events are deliberately turned away until the payment processor is
 * chosen; only RSVP events accept sign-ups through this path.
 */
export type RegState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'confirmed' | 'waitlisted'; message: string }

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export async function registerForEvent(_prev: RegState, formData: FormData): Promise<RegState> {
  const slug = String(formData.get('slug') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const notes = String(formData.get('notes') ?? '').trim()

  const partyRaw = Number(formData.get('partySize'))
  const partySize = Number.isFinite(partyRaw) && partyRaw >= 1 ? Math.floor(partyRaw) : 1

  if (!name || !email) {
    return { status: 'error', message: 'Your name and email are both needed.' }
  }
  if (!EMAIL.test(email)) {
    return { status: 'error', message: 'That email doesn’t look right — mind checking it?' }
  }

  const payload = await getPayload({ config: await config })

  const found = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const event = found.docs[0]
  if (!event) return { status: 'error', message: 'We couldn’t find that event.' }

  if (event.signup === 'none') {
    return { status: 'error', message: 'This event doesn’t take sign-ups.' }
  }
  if (event.signup === 'paid') {
    return { status: 'error', message: 'Paid registration for this event isn’t open yet.' }
  }

  // Closed once sign-ups close, or failing that once the event has started.
  const closesAt = event.signupClosesAt ?? event.startsAt
  if (closesAt && new Date(closesAt).getTime() < Date.now()) {
    return { status: 'error', message: 'Sign-ups for this event have closed.' }
  }

  try {
    const created = await payload.create({
      collection: 'registrations',
      data: {
        event: event.id,
        name,
        email,
        phone: phone || undefined,
        partySize,
        notes: notes || undefined,
        status: 'confirmed',
      },
    })

    // The seats-left line on the page is now stale.
    revalidatePath(`/events/${slug}`)

    const firstName = name.split(' ')[0]
    if (created.status === 'waitlisted') {
      return {
        status: 'waitlisted',
        message: `You’re on the waitlist for ${event.title}, ${firstName}. We’ll be in touch if a seat opens up.`,
      }
    }
    return {
      status: 'confirmed',
      message: `You’re in, ${firstName} — see you at ${event.title}.`,
    }
  } catch (err) {
    // The capacity hook throws a friendly, already-worded message ("… is full.",
    // "… has only 2 seats left."). Pass it straight through.
    if (err instanceof APIError) {
      return { status: 'error', message: err.message }
    }
    console.error('registration failed', err)
    return {
      status: 'error',
      message: 'Something went wrong on our end. Please try again in a moment.',
    }
  }
}
