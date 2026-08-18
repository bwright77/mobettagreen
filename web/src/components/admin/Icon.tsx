import React from 'react'

/**
 * Nav mark for the admin — the same block as the favicon.
 *
 * Payload renders this into .step-nav__home, a small square with overflow
 * hidden, so it has to be a mark rather than a wordmark.
 */
export function Icon() {
  return (
    <svg className="mbg-icon" viewBox="0 0 64 64" aria-label="Mo'Betta Green">
      <rect width="64" height="64" rx="14" fill="#3F322B" />
      <text
        x="32"
        y="45"
        textAnchor="middle"
        fontFamily="Archivo Black, Arial Black, Impact, sans-serif"
        fontSize="34"
        fontWeight="900"
        letterSpacing="-1"
        fill="#E23B2E"
      >
        MO
      </text>
    </svg>
  )
}
