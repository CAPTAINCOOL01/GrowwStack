# GrowwStack

Marketing site for GrowwStack — https://growwstack.in

React + Vite, deployed on Vercel, with Supabase for lead capture and
visitor telemetry.

## Running locally

```bash
npm ci
npm run dev
```

Copy `.env.example` to `.env.local` and fill it in. `.env.local` is
gitignored and must stay that way — it holds the admin password.

## Build

```bash
npm run build   # -> dist/
```

Use **npm, not pnpm**. pnpm 10 hits `ERR_INVALID_THIS` against the npm
registry on Node 24, which is what Vercel runs, and it fails the install
before the build starts.

## Environment variables

`VITE_`-prefixed variables are compiled into the JavaScript that every
visitor downloads. **Never put a secret behind that prefix.** The admin
password was once set as `VITE_ADMIN_PASSWORD` and shipped in plaintext in
the public bundle.

Client (safe to expose):

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Publishable key — INSERT only, cannot read |
| `VITE_CONTACT_PHONE` | Country-coded, e.g. `917017138349` |
| `VITE_GA_ID` | GA4 measurement ID. Empty = analytics fully off |

Server-only (used by `api/admin.ts`, never sent to the browser):

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Verified server-side to reach the dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key. Bypasses RLS — treat as root |
| `SUPABASE_URL` | Same as the client URL |

## Admin dashboard

`/growwstack/admin`, gated by `ADMIN_PASSWORD`.

Reads go through `api/admin.ts`, which verifies the password server-side and
queries with the service-role key. The browser only ever receives a
short-lived HMAC-signed token — never the password, never a credential that
can read leads.

This matters: the anon key is public by definition, so `gs_leads` and
`gs_visitors` grant `anon` **INSERT only**. Both anon SELECT policies were
dropped (migration `revoke_anon_read_on_leads_and_visitors`) after it was
found that anyone could read every lead with a single request. Don't
re-add them.

## Analytics

GA4 loads only when `VITE_GA_ID` is set. Consent Mode v2 defaults are
declared before `gtag.js`, so nothing is stored until the visitor accepts.
The three advertising signals stay denied even after acceptance.

The Supabase `gs_visitors` ping in `src/lib/tracking.ts` is separate and is
**not** gated by that banner.

## Deploys

Pushing to `master` deploys via the GitHub integration. Vercel builds only
commits pushed *after* the repo was connected — reconnecting does not
backfill existing ones.

CSP lives in `vercel.json`. Any new third-party script needs its origin
added there or the browser blocks it silently.

## Regenerating the OG image

`tools/og-image.html` is the source for `public/og.png` (1200x630):

```bash
chrome --headless --window-size=1200,630 \
  --screenshot=public/og.png tools/og-image.html
```
