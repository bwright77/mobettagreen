const TZ = 'America/Denver'

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-US', { timeZone: TZ, ...opts })

/** "Saturday, August 22" */
export const longDate = (iso: string) =>
  fmt({ weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(iso))

/** "Aug 22" */
export const shortDate = (iso: string) =>
  fmt({ month: 'short', day: 'numeric' }).format(new Date(iso))

/** "9:00 AM" */
export const time = (iso: string) =>
  fmt({ hour: 'numeric', minute: '2-digit' }).format(new Date(iso))

/** "Saturday, August 22 · 9:00 AM – 1:00 PM" */
export function whenLabel(startsAt: string, endsAt?: string | null): string {
  const base = `${longDate(startsAt)} · ${time(startsAt)}`
  return endsAt ? `${base} – ${time(endsAt)}` : base
}

/**
 * What it costs and whether seats are capped, in one line. Reads from the three
 * independent fields rather than assuming a paid event is also a limited one.
 */
export function admissionLabel(event: {
  signup?: string | null
  price?: number | null
  capacity?: number | null
}): string {
  const cost =
    event.signup === 'paid' && typeof event.price === 'number' ? `$${event.price}` : 'Free'
  if (event.signup === 'none') return `${cost} · open to all`
  return event.capacity ? `${cost} · limited seats` : `${cost} · sign up`
}

/** "August 2026" — used to group a calendar by month. */
export const monthLabel = (iso: string) =>
  fmt({ month: 'long', year: 'numeric' }).format(new Date(iso))

/** "Sat" */
export const weekdayShort = (iso: string) =>
  fmt({ weekday: 'short' }).format(new Date(iso))

/** "22" */
export const dayNumber = (iso: string) => fmt({ day: 'numeric' }).format(new Date(iso))

/** "10am – 2pm", lowercased because the meridiem shouts otherwise. */
export function timeRange(startsAt: string, endsAt?: string | null): string {
  const t = (iso: string) =>
    fmt({ hour: 'numeric', minute: '2-digit' })
      .format(new Date(iso))
      .replace(':00', '')
      .replace(' AM', 'am')
      .replace(' PM', 'pm')
  return endsAt ? `${t(startsAt)} – ${t(endsAt)}` : t(startsAt)
}
