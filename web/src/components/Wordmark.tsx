import React from 'react'

/**
 * Type-set recreation of the painted banner lockup. Sizing is driven by the
 * container's font-size so the whole thing scales as one unit.
 *
 * `compact` drops "R&B's" and "MarketPlace" — at nav size those lines are too
 * small to read and just add noise, so the nav carries the two words that
 * actually identify the market.
 *
 * Swap for the real artwork when Miss Bev sends vector files.
 */
export function Wordmark({
  className = '',
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  return (
    <span className={`logo ${compact ? 'logo--compact' : ''} ${className}`.trim()} aria-hidden="true">
      {!compact && <span className="logo__rb">R&amp;B&rsquo;s</span>}
      <span className="logo__mo">Mo&rsquo;Betta</span>
      <span className="logo__green">Green</span>
      {!compact && <span className="logo__mkt">MarketPlace</span>}
    </span>
  )
}
