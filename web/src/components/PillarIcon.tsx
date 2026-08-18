import React from 'react'

/** The three marks the home page pillars can carry. */
const SHAPES: Record<string, React.ReactNode> = {
  basket: (
    <>
      <path d="M4 9h16l-1.3 10.2a2 2 0 0 1-2 1.8H7.3a2 2 0 0 1-2-1.8L4 9Z" />
      <path d="M8.5 9V7a3.5 3.5 0 0 1 7 0v2" />
    </>
  ),
  heart: (
    <path d="M12 20.5s-7.5-4.4-7.5-9.4A4.1 4.1 0 0 1 12 8.4a4.1 4.1 0 0 1 7.5 2.7c0 5-7.5 9.4-7.5 9.4Z" />
  ),
  sprout: (
    <path d="M12 21c0-6 3-9 9-10-1 6-4 9-9 10Zm0 0c0-6-3-9-9-10 1 6 4 9 9 10Zm0 0V9" />
  ),
}

export function PillarIcon({ name }: { name?: string | null }) {
  return <svg viewBox="0 0 24 24">{SHAPES[name ?? 'basket'] ?? SHAPES.basket}</svg>
}
