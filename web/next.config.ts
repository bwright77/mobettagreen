import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Media is served straight from Supabase Storage's public CDN (see the media
// collection config), so next/image optimizes remote URLs from that host.
const supabaseHost = (() => {
  try {
    return new URL(process.env.S3_ENDPOINT || 'https://eiaimbjpvmkpwzwhbqmf.supabase.co').hostname
  } catch {
    return 'eiaimbjpvmkpwzwhbqmf.supabase.co'
  }
})()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
    ],
    localPatterns: [
      {
        // Static brand assets committed under public/images
        pathname: '/images/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
