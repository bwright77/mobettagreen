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

// The canonical origin. Facebook and Twitter need absolute URLs for the card
// image, and metadataBase is what resolves the relative paths below to them.
// Override in the environment if the domain ever moves.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mobettagreen.org'

const title = "R&B's Mo'Betta Green MarketPlace"
const description =
  "A Black-owned farmers market in Denver's Five Points. Fresh food, free classes, and neighbors feeding neighbors."

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s — Mo'Betta Green MarketPlace",
  },
  description,
  // Facebook is Miss Bev's primary channel — without these a shared link
  // previews as a blank box. The image is 1200×630, the size FB and Twitter
  // both crop from cleanly.
  openGraph: {
    type: 'website',
    siteName: "R&B's Mo'Betta Green MarketPlace",
    title,
    description:
      "Growing food and sharing it changes lives. A Black-owned farmers market rooted in Denver's Five Points.",
    url: siteUrl,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "R&B's Mo'Betta Green MarketPlace",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description:
      "Growing food and sharing it changes lives. A Black-owned farmers market rooted in Denver's Five Points.",
    images: ['/og-image.png'],
  },
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
