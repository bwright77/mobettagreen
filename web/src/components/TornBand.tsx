import React from 'react'

/**
 * The torn brown strip from the market banner and truck signage.
 *
 * Deliberately slim, and used sparingly. It marks a departure from the flow of
 * the page — an aside that matters — so it never carries a page title and never
 * acts as a hero. One line is the point.
 */
export function TornBand({ children }: { children: React.ReactNode }) {
  return (
    <div className="ribbon">
      <p className="ribbon__text">{children}</p>
    </div>
  )
}
