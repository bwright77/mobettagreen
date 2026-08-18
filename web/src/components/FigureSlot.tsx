import Image from 'next/image'
import React from 'react'

/**
 * An editorial image that breaks out of the prose measure.
 *
 * With no `src` it renders a placeholder stating exactly which photograph is
 * wanted, so the page doubles as the list to take to Miss Bev. Swap in the real
 * image and the placeholder disappears.
 *
 * No captions: an image sits beside the prose it belongs to, so a caption would
 * only repeat what the paragraph already says.
 */
export function FigureSlot({
  src,
  alt,
  want,
  ratio = '16 / 9',
  width = 'wide',
  tilt = 1,
}: {
  src?: string
  alt?: string
  want: string
  ratio?: string
  width?: 'wide' | 'full'
  /** 1–5. Set explicitly so each photograph keeps its own angle. */
  tilt?: 1 | 2 | 3 | 4 | 5
}) {
  return (
    <figure className={`figure-slot figure-slot--${width} figure-slot--tilt-${tilt}`}>
      {src ? (
        <div className="figure-slot__frame" style={{ aspectRatio: ratio }}>
          <Image src={src} alt={alt ?? ''} fill sizes="(max-width: 60rem) 100vw, 60rem" />
        </div>
      ) : (
        <div className="figure-slot__empty" style={{ aspectRatio: ratio }}>
          <p className="figure-slot__label">Photo needed</p>
          <p className="figure-slot__want">{want}</p>
        </div>
      )}
    </figure>
  )
}
