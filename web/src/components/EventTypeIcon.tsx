import React from 'react'

/**
 * One icon per kind of event, so a calendar of near-identical Saturdays still
 * reads at a glance when classes and dinners land between them.
 *
 * Drawn in the same stroked style as the pillar icons on the home page rather
 * than introducing a second icon language.
 */
const PATHS: Record<string, { d: React.ReactNode; label: string }> = {
  // Market: the canopy.
  market: {
    label: 'Market day',
    d: (
      <>
        <path d="M3 9.5 5.5 4h13L21 9.5Z" />
        <path d="M3 9.5c1.5 0 1.5 1.6 3 1.6s1.5-1.6 3-1.6 1.5 1.6 3 1.6 1.5-1.6 3-1.6 1.5 1.6 3 1.6 1.5-1.6 3-1.6" />
        <path d="M5 12.5V20h14v-7.5" />
      </>
    ),
  },
  // Class: a pot with steam — the cooking demos.
  class: {
    label: 'Class',
    d: (
      <>
        <path d="M4 11h16l-1.1 7.2a2 2 0 0 1-2 1.8H7.1a2 2 0 0 1-2-1.8Z" />
        <path d="M2.5 11h19" />
        <path d="M9 7.5c0-1.2 1.2-1.4 1.2-2.6M12 7.5c0-1.2 1.2-1.4 1.2-2.6M15 7.5c0-1.2 1.2-1.4 1.2-2.6" />
      </>
    ),
  },
  // Community dinner: the shared table.
  dinner: {
    label: 'Community dinner',
    d: (
      <>
        <path d="M3 13h18" />
        <path d="M5 13V8.5a7 7 0 0 1 14 0V13" />
        <path d="M6 13v7M18 13v7" />
        <path d="M12 3.2V1.8" />
      </>
    ),
  },
  // RGC Day: a heart — Random Gestures of Compassion.
  rgc: {
    label: 'RGC Day',
    d: (
      <path d="M12 20.5s-7.5-4.4-7.5-9.4A4.1 4.1 0 0 1 12 8.4a4.1 4.1 0 0 1 7.5 2.7c0 5-7.5 9.4-7.5 9.4Z" />
    ),
  },
  // Juneteenth: the bursting star and new horizon from the Juneteenth flag.
  juneteenth: {
    label: 'Juneteenth',
    d: (
      <>
        <path d="M12 4.2 13.6 8l4.2.3-3.2 2.7 1 4.1-3.6-2.2-3.6 2.2 1-4.1L6.2 8.3 10.4 8Z" />
        <path d="M3.5 18.5c3-2.4 5.8-3.6 8.5-3.6s5.5 1.2 8.5 3.6" />
      </>
    ),
  },
  // Celebration: anything else on the year's calendar.
  celebration: {
    label: 'Celebration',
    d: (
      <>
        <path d="M4.5 20 9 9l6 6-10.5 5Z" />
        <path d="M13 3.5v2M18.5 5.5 17 7M20.5 11h-2M16.5 15.5 15 14" />
      </>
    ),
  },
  other: {
    label: 'Event',
    d: (
      <>
        <path d="M12 21c0-6 3-9 9-10-1 6-4 9-9 10Zm0 0c0-6-3-9-9-10 1 6 4 9 9 10Zm0 0V9" />
      </>
    ),
  },
}

export function EventTypeIcon({ type }: { type?: string | null }) {
  const entry = PATHS[type ?? 'other'] ?? PATHS.other
  return (
    <span className={`event-icon event-icon--${type ?? 'other'}`} title={entry.label}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {entry.d}
      </svg>
      <span className="visually-hidden">{entry.label}</span>
    </span>
  )
}
