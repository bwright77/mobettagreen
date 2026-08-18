import Link from 'next/link'
import React from 'react'

import { Wordmark } from './Wordmark'

const NAV = [
  { href: '/events', label: 'Market & Events' },
  { href: '/rgc-day', label: 'RGC Day' },
  { href: '/producers', label: 'Producers' },
  { href: '/partners', label: 'Partners' },
  { href: '/press', label: 'Press' },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link href="/" style={{ fontSize: '1.4rem', textDecoration: 'none' }}>
          <Wordmark compact />
          <span className="visually-hidden">R&apos;s Mo&apos;Betta Green MarketPlace — home</span>
        </Link>
        <nav className="site-nav" aria-label="Main">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
