import React from 'react'
import { Analytics } from '@vercel/analytics/next'
import { Archivo, Archivo_Black, Anton } from 'next/font/google'

import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import './styles.css'

// Self-hosted by next/font, so no render-blocking request to a font CDN.
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-archivo',
  display: 'swap',
})
const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo-black',
  display: 'swap',
})
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
})

export const metadata = {
  title: {
    default: "R&B's Mo'Betta Green MarketPlace",
    template: "%s — Mo'Betta Green MarketPlace",
  },
  description:
    "A Black-owned farmers market in Denver's Five Points. Fresh food, free classes, and neighbors feeding neighbors.",
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html
      lang="en"
      className={`${archivo.variable} ${archivoBlack.variable} ${anton.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        {/* Needs no configuration or env vars — posts to /_vercel/insights on our domain. */}
        <Analytics />
      </body>
    </html>
  )
}
