'use client'

import { useAuth } from '@payloadcms/ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Account menu for the admin header.
 *
 * Payload renders the avatar inside a <Link> to /account, so the menu can't live
 * inside this component's tree — nesting buttons in an anchor is invalid, and the
 * click would navigate before the menu opened. The trigger intercepts the click
 * and the menu is portalled to the body, positioned under the avatar.
 */
export function AdminAvatar() {
  const { user, logOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)

  const email = typeof user?.email === 'string' ? user.email : ''
  const initials = email.slice(0, 2).toUpperCase() || '··'

  const place = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setCoords({ top: r.bottom + 10, right: Math.max(12, window.innerWidth - r.right) })
  }, [])

  const onTriggerClick = (e: React.MouseEvent) => {
    // Stop the surrounding link from navigating to /account.
    e.preventDefault()
    e.stopPropagation()
    place()
    setOpen((v) => !v)
  }

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <span
      className="mbg-avatar"
      ref={triggerRef}
      onClick={onTriggerClick}
      role="button"
      tabIndex={0}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-label="Account menu"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          place()
          setOpen((v) => !v)
        }
      }}
    >
      <span className="mbg-avatar__initials">{initials}</span>

      {open && coords
        ? createPortal(
            <>
              <div className="mbg-menu__scrim" onClick={() => setOpen(false)} />
              <div
                className="mbg-menu"
                role="menu"
                style={{ top: coords.top, right: coords.right }}
              >
                {email ? <p className="mbg-menu__who">{email}</p> : null}
                <a className="mbg-menu__item" role="menuitem" href="/admin/account">
                  Account settings
                </a>
                <button
                  className="mbg-menu__item mbg-menu__item--danger"
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    void logOut()
                  }}
                >
                  Log out
                </button>
              </div>
            </>,
            document.body,
          )
        : null}
    </span>
  )
}
