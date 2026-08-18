'use client'

import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'
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
  const menuRef = useRef<HTMLDivElement>(null)

  const email = typeof user?.email === 'string' ? user.email : ''

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
    /**
     * Close on any pointer down outside the menu or its trigger.
     *
     * A full-screen scrim doesn't work here: Payload's admin chrome sits above
     * it, so clicks on the header or nav never reached it. Listening on the
     * document in the capture phase is indifferent to stacking order.
     */
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null
      if (!target) return
      if (menuRef.current?.contains(target)) return
      if (triggerRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
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
      {/* Payload's own account glyph, so the header looks like Payload rather
          than a bespoke badge. */}
      <svg className="mbg-avatar__glyph" viewBox="0 0 25 25" aria-hidden="true">
        <circle className="mbg-avatar__bg" cx="12.5" cy="12.5" r="11.5" />
        <circle className="mbg-avatar__head" cx="12.5" cy="10.73" r="3.98" />
        <path
          className="mbg-avatar__body"
          d="M12.5,24a11.44,11.44,0,0,0,7.66-2.94c-.5-2.71-3.73-4.8-7.66-4.8s-7.16,2.09-7.66,4.8A11.44,11.44,0,0,0,12.5,24Z"
        />
      </svg>

      {open && coords
        ? createPortal(
            <div
              className="mbg-menu"
              role="menu"
              ref={menuRef}
              style={{ top: coords.top, right: coords.right }}
            >
                {email ? <p className="mbg-menu__who">{email}</p> : null}
                <Link className="mbg-menu__item" role="menuitem" href="/admin/account">
                  Account settings
                </Link>
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
            </div>,
            document.body,
          )
        : null}
    </span>
  )
}
