import React from 'react'
import { Analytics } from '@vercel/analytics/next'
import './styles.css'

export const metadata = {
  description:
    "R&B's Mo'Betta Green MarketPlace — a Black-owned farmers market in Denver's Five Points.",
  title: "R&B's Mo'Betta Green MarketPlace",
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        {/* Needs no configuration or env vars — posts to /_vercel/insights on our domain. */}
        <Analytics />
      </body>
    </html>
  )
}
