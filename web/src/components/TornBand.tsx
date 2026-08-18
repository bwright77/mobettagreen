import React from 'react'

/**
 * The torn brown strip from the market banner and truck signage.
 *
 * The tear is literal: we tear away from the page to insert something that
 * matters. It always holds content — a line, a quote — and is never used as a
 * divider or a page header, and never as a hero.
 */
export function TornBand({
  children,
  variant = 'line',
}: {
  children: React.ReactNode
  variant?: 'line' | 'quote'
}) {
  if (variant === 'quote') {
    return <div className="ribbon ribbon--quote">{children}</div>
  }
  return (
    <div className="ribbon">
      <p className="ribbon__text">{children}</p>
    </div>
  )
}
