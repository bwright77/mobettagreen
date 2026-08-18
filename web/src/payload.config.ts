import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Events } from './collections/Events'
import { Registrations } from './collections/Registrations'
import { Press } from './collections/Press'
import { Partners } from './collections/Partners'
import { Producers } from './collections/Producers'
import { Settings } from './globals/Settings'
import { Home } from './globals/Home'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " — Mo'Betta Green",
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' }],
    },
    avatar: { Component: '@/components/admin/AdminAvatar#AdminAvatar' },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo#Logo',
        Icon: '@/components/admin/Icon#Icon',
      },
      // A branded launchpad above the stock collection cards — quick actions,
      // sign-ups filling up, and who just registered.
      beforeDashboard: ['@/components/admin/DashboardHome#DashboardHome'],
    },
  },
  collections: [Pages, Events, Registrations, Press, Partners, Producers, Media, Users],
  globals: [Home, Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      /**
       * Supabase's session pooler allows 15 clients total, and node-postgres
       * defaults to 10 per pool. A dev server, a one-off script and the
       * deployed app together blow through that and everything starts failing
       * with EMAXCONNSESSION.
       *
       * Keep each process's share small, and hand connections back quickly
       * rather than holding them idle.
       */
      max: Number(process.env.DATABASE_POOL_MAX ?? 3),
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 15_000,
    },
  }),
  sharp,
  plugins: [
    /**
     * Media goes to Supabase Storage, which speaks S3 — no extra vendor, and no
     * local disk, which Vercel wipes between invocations. Enabling this turns
     * off Payload's local file storage.
     *
     * The bucket must exist and be public-read for images to serve directly.
     * S3 credentials come from the Supabase dashboard under Storage > S3 access
     * keys; they are separate from the database password and the API keys.
     */
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      collections: { media: true },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'us-east-2',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        // Supabase requires path-style addressing rather than virtual-hosted.
        forcePathStyle: true,
      },
    }),
  ],
})
