import type { Payload } from 'payload'

import { whenLabel } from './dates'

/**
 * Sends the RSVP confirmation. Best-effort by design: the caller registers the
 * person first and only then calls this, wrapped so a mail failure can never
 * undo a good registration. Routed through payload.sendEmail, so it uses
 * whatever adapter the config wired up — Resend in production, the console
 * transport in dev when there's no key.
 */

type EventLike = {
  title: string
  startsAt: string
  endsAt?: string | null
  locationName?: string | null
  address?: string | null
}

const BROWN = '#3f322b'
const GREEN = '#2e9a50'
const PAPER = '#f7f3ea'

export async function sendRegistrationEmail(
  payload: Payload,
  args: {
    to: string
    name: string
    partySize: number
    status: 'confirmed' | 'waitlisted'
    event: EventLike
  },
): Promise<void> {
  const { to, name, partySize, status, event } = args
  const firstName = name.split(' ')[0] || name
  const confirmed = status === 'confirmed'

  const when = whenLabel(event.startsAt, event.endsAt)
  const where = [event.locationName, event.address].filter(Boolean).join(', ')

  const subject = confirmed
    ? `You’re signed up — ${event.title}`
    : `You’re on the waitlist — ${event.title}`

  const lead = confirmed
    ? `You’re all set for ${event.title}. Here are the details:`
    : `You’re on the waitlist for ${event.title}. We’ll email you the moment a seat opens up. Here are the details in the meantime:`

  const rows: Array<[string, string]> = [['When', when]]
  if (where) rows.push(['Where', where])
  if (partySize > 1) rows.push(['Party size', String(partySize)])

  const detailRows = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:4px 16px 4px 0;color:#6b5a4e;font-size:14px;white-space:nowrap;vertical-align:top;">${label}</td>
          <td style="padding:4px 0;color:${BROWN};font-size:15px;font-weight:600;">${value}</td>
        </tr>`,
    )
    .join('')

  const html = `
  <div style="margin:0;padding:24px;background:${PAPER};font-family:Archivo,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:14px;border-bottom:6px solid ${GREEN};overflow:hidden;">
      <tr><td style="padding:28px 32px 8px;">
        <p style="margin:0 0 4px;color:#e23b2e;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;font-weight:700;">
          ${confirmed ? 'You’re signed up' : 'You’re on the waitlist'}
        </p>
        <h1 style="margin:0 0 16px;color:${BROWN};font-size:24px;line-height:1.15;">${event.title}</h1>
        <p style="margin:0 0 20px;color:${BROWN};font-size:16px;line-height:1.6;">Hi ${firstName}, ${lead}</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 22px;">${detailRows}</table>
        <p style="margin:0 0 4px;color:#6b5a4e;font-size:14px;line-height:1.6;">
          Questions, or need to change your RSVP? Just reply to this email.
        </p>
      </td></tr>
      <tr><td style="padding:16px 32px 24px;border-top:1px solid #efe8da;">
        <p style="margin:0;color:#6b5a4e;font-size:13px;">
          R&amp;B’s Mo’Betta Green MarketPlace · Five Points, Denver
        </p>
      </td></tr>
    </table>
  </div>`

  const textLines = [
    confirmed ? `You're signed up — ${event.title}` : `You're on the waitlist — ${event.title}`,
    '',
    `Hi ${firstName}, ${lead.replace(/’/g, "'")}`,
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Questions, or need to change your RSVP? Just reply to this email.',
    '',
    "R&B's Mo'Betta Green MarketPlace · Five Points, Denver",
  ]

  await payload.sendEmail({
    to,
    subject,
    html,
    text: textLines.join('\n'),
    // Replies reach a real person regardless of the sending domain's mail setup.
    ...(process.env.EMAIL_REPLY_TO ? { replyTo: process.env.EMAIL_REPLY_TO } : {}),
  })
}
