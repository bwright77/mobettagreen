import React from 'react'

/**
 * Highlights the initial letters of Traceable, Organic, Local and Delicious —
 * they spell TOLD, which is the point of the line.
 *
 * Works off the words rather than fixed positions, so the highlighting survives
 * the text being edited in the admin.
 */
const MARKED = ['traceable', 'organic', 'local', 'delicious']

export function TellingInitials({ text }: { text: string }) {
  const parts = text.split(/(\s+)/)
  return (
    <>
      {parts.map((part, i) => {
        const word = part.replace(/[^a-z]/gi, '').toLowerCase()
        if (MARKED.includes(word) && part.length > 0) {
          const idx = part.search(/[a-z]/i)
          return (
            <React.Fragment key={i}>
              {part.slice(0, idx)}
              <b>{part[idx]}</b>
              {part.slice(idx + 1)}
            </React.Fragment>
          )
        }
        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </>
  )
}
