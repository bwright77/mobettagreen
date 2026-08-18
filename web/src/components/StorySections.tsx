import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { FigureSlot } from './FigureSlot'

type Section = {
  id?: string | null
  heading?: string | null
  body?: unknown
  image?: unknown
  ratio?: string | null
  tilt?: string | null
}

const mediaUrl = (image: unknown): string | undefined => {
  if (image && typeof image === 'object' && 'url' in (image as Record<string, unknown>)) {
    const url = (image as { url?: string | null }).url
    return url ?? undefined
  }
  return undefined
}

const mediaAlt = (image: unknown): string => {
  if (image && typeof image === 'object' && 'alt' in (image as Record<string, unknown>)) {
    return String((image as { alt?: string }).alt ?? '')
  }
  return ''
}

/**
 * Renders a page's sections, pairing each with its photograph and alternating
 * which side that falls on. Both Our Story and RGC Day come through here, so the
 * two can't drift apart.
 */
export function StorySections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section, i) => {
        const src = mediaUrl(section.image)
        const hasFigure = Boolean(src)
        return (
          <section
            key={section.id ?? i}
            className={`story-pair${i % 2 === 1 ? ' story-pair--flip' : ''}${
              hasFigure ? '' : ' story-pair--solo'
            }`}
          >
            <div className="story-pair__prose">
              {section.heading ? <h2>{section.heading}</h2> : null}
              {section.body ? <RichText data={section.body as never} /> : null}
            </div>

            {hasFigure ? (
              <FigureSlot
                src={src}
                alt={mediaAlt(section.image)}
                ratio={section.ratio ?? '4 / 3'}
                tilt={(section.tilt ?? '1') as never}
                fill
              />
            ) : null}
          </section>
        )
      })}
    </>
  )
}
