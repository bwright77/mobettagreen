import React from 'react'

/**
 * Type-set recreation of the painted banner lockup. Sizing is driven by the
 * container's font-size so the whole thing scales as one unit.
 *
 * Swap for the real artwork when Miss Bev sends vector files.
 */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`logo ${className}`.trim()} aria-hidden="true">
      <span className="logo__rb">R&amp;B&rsquo;s</span>
      <span className="logo__mo">Mo&rsquo;Betta</span>
      <span className="logo__green">Green</span>
      <span className="logo__mkt">MarketPlace</span>
    </span>
  )
}
