# mobettagreen — web app

Next.js + Payload CMS v3 on Supabase Postgres. This becomes the real site; the static
coming-soon page at the repo root stays live until this replaces it.

Requirements and decisions live in [../REQUIREMENTS.md](../REQUIREMENTS.md).

## Setup

Dependencies are already installed. You need two environment values:

```bash
cp .env.example .env.local
```

Then fill in:

- **`DATABASE_URL`** — Supabase dashboard → **Connect**. Use the **session pooler**
  (port `5432`), not the transaction pooler (`6543`): Payload runs migrations, and the
  transaction pooler doesn't support them.
- **`PAYLOAD_SECRET`** — generate one with `openssl rand -base64 32`.

`.env.local` is gitignored. Don't commit either value.

## Run

```bash
npm run dev
```

Admin panel is at http://localhost:3000/admin — first load prompts you to create the
initial admin user. The front end is at http://localhost:3000.

Other scripts:

```bash
npm run generate:types    # regenerate src/payload-types.ts after schema changes
npm run lint
npm run test:int
```

## Notes on the scaffold

Built from the official Payload `blank` template at tag `v3.88.0`, with three changes:

- **Postgres instead of MongoDB** — `postgresAdapter` against Supabase, per the stack
  decision.
- **`baseUrl` removed from tsconfig** — TypeScript 6 deprecates it, and the `paths`
  entries are already relative to the tsconfig, so it was redundant.
- **ESLint config imports flat configs directly** — `eslint-config-next` 16 ships native
  flat configs, and the template's `FlatCompat` wrapper throws
  "Converting circular structure to JSON" against them.

Take the template from the release tag rather than `main`. The templates on `main` track
unreleased APIs and won't typecheck against the published packages.

## Deployment

Vercel currently serves the repo root as a static site, so this app is not built or
deployed yet — that's deliberate, and it's what keeps the coming-soon page live. At
launch, change the Vercel project's **Root Directory** to `web`, and set `DATABASE_URL`
and `PAYLOAD_SECRET` in the project's environment variables.
