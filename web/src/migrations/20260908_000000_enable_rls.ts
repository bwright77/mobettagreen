import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Enable Row-Level Security on every table in the public schema.
 *
 * Supabase auto-exposes public tables through its REST API to the anon and
 * authenticated roles. With RLS off, anyone holding the project's (public) anon
 * key could read, edit, or delete everything — including registrant PII in the
 * `registrations` table. The app never touches that API: it connects as the
 * `postgres` role, which has BYPASSRLS and owns the tables, so it is completely
 * unaffected. Enabling RLS with no policies is therefore deny-all for the API
 * roles and a no-op for the app.
 *
 * Runs over pg_tables so it covers whatever exists when it runs — all current
 * tables on the live DB, and every baseline table on a fresh one. A future new
 * table won't be covered retroactively; enable RLS on it in its own migration.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE r RECORD;
    BEGIN
      FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
      END LOOP;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE r RECORD;
    BEGIN
      FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      LOOP
        EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
      END LOOP;
    END $$;
  `)
}
