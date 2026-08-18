'use client'

import React, { useActionState } from 'react'

import { registerForEvent, type RegState } from '@/lib/register-action'

const initial: RegState = { status: 'idle' }

/**
 * The public RSVP form. Capacity is enforced on the server, so this form's only
 * jobs are to collect the details and to report back what happened — a seat, a
 * place on the waitlist, or an error worth reading.
 */
export function RegistrationForm({
  slug,
  remaining,
  waitlistOpen,
}: {
  slug: string
  /** Seats left, or null when the event is uncapped. */
  remaining: number | null
  waitlistOpen: boolean
}) {
  const [state, action, pending] = useActionState(registerForEvent, initial)

  if (state.status === 'confirmed' || state.status === 'waitlisted') {
    return (
      <div className={`signup signup--done signup--${state.status}`} role="status">
        <p className="signup__done-head">
          {state.status === 'confirmed' ? 'You’re signed up' : 'You’re on the waitlist'}
        </p>
        <p>{state.message}</p>
      </div>
    )
  }

  const full = remaining !== null && remaining <= 0
  // A full event with a waitlist still takes sign-ups — they just land on the list.
  const closed = full && !waitlistOpen

  return (
    <form className="signup" action={action}>
      <div className="signup__head">
        <h2 className="signup__title">Save your spot</h2>
        {remaining !== null ? (
          <p className="signup__seats">
            {full ? (waitlistOpen ? 'Full — join the waitlist' : 'This event is full') : `${remaining} ${remaining === 1 ? 'seat' : 'seats'} left`}
          </p>
        ) : null}
      </div>

      <input type="hidden" name="slug" value={slug} />

      <div className="signup__row">
        <label className="field">
          <span>Name</span>
          <input name="name" type="text" required autoComplete="name" disabled={closed || pending} />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" disabled={closed || pending} />
        </label>
      </div>

      <div className="signup__row">
        <label className="field">
          <span>
            Phone <em>optional</em>
          </span>
          <input name="phone" type="tel" autoComplete="tel" disabled={closed || pending} />
        </label>
        <label className="field field--narrow">
          <span>Party size</span>
          <input
            name="partySize"
            type="number"
            min={1}
            defaultValue={1}
            inputMode="numeric"
            disabled={closed || pending}
          />
        </label>
      </div>

      <label className="field">
        <span>
          Anything we should know? <em>optional</em>
        </span>
        <textarea
          name="notes"
          rows={2}
          placeholder="Dietary needs, accessibility, a question…"
          disabled={closed || pending}
        />
      </label>

      {state.status === 'error' ? (
        <p className="signup__error" role="alert">
          {state.message}
        </p>
      ) : null}

      <button className="btn btn--red" type="submit" disabled={closed || pending}>
        {pending ? 'Sending…' : waitlistOpen && full ? 'Join the waitlist' : 'Sign up'}
      </button>
    </form>
  )
}
