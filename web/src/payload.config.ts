import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { resendAdapter } from '@payloadcms/email-resend'
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
  /**
   * Transactional email via Resend. Only wired up when a key is present — with
   * no key Payload falls back to logging emails to the console, so dev and
   * one-off scripts keep working without credentials. The from-address and
   * name come from the environment so the sandbox sender can be swapped for
   * noreply@mobettagreen.org (once the domain's verified) with no code change.
   */
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev',
        defaultFromName: process.env.EMAIL_FROM_NAME || "R&B's Mo'Betta Green",
      })
    : undefined,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    /**
     * Migration-driven, no auto-push in any environment.
     *
     * Dev and prod share one database right now, and dev push can't coexist
     * with prod migrations on the same DB — push keeps re-marking it as "dev
     * mode", which makes `payload migrate` refuse to run without a data-loss
     * prompt. Turning push off makes the schema change through migrations only,
     * the same way in every environment, which also ends the surprise auto-push
     * schema edits we hit while iterating.
     *
     * Workflow for a schema change: edit the config, then
     *   npm run migrate:create <name>   # generates a migration from the diff
     *   npm run migrate                 # applies it locally
     * and the deploy build runs `payload migrate` to apply it in production.
     */
    push: false,
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
      collections: {
        media: {
          /**
           * The bucket is public, so serve images straight from Supabase's CDN
           * rather than proxying every one through Payload's /api/media/file
           * route. Proxying meant each image was a serverless invocation that
           * looked the file up in the DB and streamed it from S3 — under the
           * pool's 3-connection cap they serialized, so a page full of images
           * loaded one per reload. Direct CDN URLs load in parallel with no
           * function involved.
           */
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const base = (process.env.S3_ENDPOINT || '').replace(
              /\/storage\/v1\/s3\/?$/,
              '/storage/v1/object/public',
            )
            return [base, process.env.S3_BUCKET, prefix, filename].filter(Boolean).join('/')
          },
        },
      },
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
