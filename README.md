# starter-next-supa-stripe

Production-ready SaaS boilerplate: **Next.js (App Router, TS)** + **Prisma** + **Supabase Postgres** + **Auth.js (magic links via Resend)** + **Stripe Checkout** + **PostHog**.

- Auth with email magic links (console fallback for local dev)
- Payments (one-time or subscriptions) with verified webhooks
- Type-safe DB access with Prisma
- Supabase client for Storage/Realtime (Prisma for relational data)
- PostHog product analytics
- Tailwind + Geist fonts, sensible layout + header

---

## ✨ Stack

- **Web**: Next.js 14 (App Router), TypeScript, Tailwind
- **Auth**: Auth.js (NextAuth v5) + Prisma Adapter, magic links via **Resend**
- **DB**: Supabase **Postgres** (Prisma ORM)
- **Payments**: Stripe (Checkout + Webhook)
- **Analytics**: posthog-js (client)
- **Tooling**: ESLint, Turbopack (dev), Zod

---

## 🚀 Quickstart

### 1) Install
```bash
npm i
```

### 2) Env
Copy the template and fill values **locally** (do not commit `.env`):
```bash
cp .env.example .env
```

Set (at minimum):
- `DATABASE_URL` (Supabase **Session Pooler** URI; URL-encode password; add `sslmode=require`)
- `AUTH_SECRET` (generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`)
- `NEXTAUTH_URL=http://localhost:3000`
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- (Optional now) `RESEND_API_KEY` + `EMAIL_FROM="App Team <no-reply@auth.example.com>"`  
  *If unset, magic link prints to server console for dev.*
- Stripe: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_PRICE_ID`
- PostHog: `NEXT_PUBLIC_POSTHOG_KEY`

### 3) Database (Prisma)
```bash
npx prisma migrate dev --name init
```

### 4) Run
```bash
npm run dev
```
Open http://localhost:3000

### 5) Stripe webhooks (local)
Install Stripe CLI, then:
```bash
stripe login
stripe listen --latest --forward-to localhost:3000/api/webhook
```
Copy the printed signing secret into `.env` as `STRIPE_WEBHOOK_SECRET`.

Trigger a test:
```bash
stripe trigger checkout.session.completed
```

## Stripe: Local Test & Billing Portal Checklist

> Use Stripe **Test mode** for everything below.

### 1) Env vars
Set these in `.env.local` (copy from `.env.example`):
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET` (filled in step 3)
- *(optional)* `STRIPE_PORTAL_CONFIGURATION_ID` — if you save a named Portal config

### 2) Configure the Customer Portal (once, in Test mode)
Dashboard → **Settings → Billing → Customer portal** → **Configure / Save**.
Select features (update card, cancel sub, invoices), set **Return URL** to `http://localhost:3000`.
Copy the **Configuration ID** (e.g. `pc_123…`) if you want to pin it via `STRIPE_PORTAL_CONFIGURATION_ID`.

### 3) Start the webhook listener
Run this in a separate terminal:
```bash
stripe listen --latest --forward-to http://127.0.0.1:3000/api/webhook
Copy the printed signing secret and set:

# .env.local
STRIPE_WEBHOOK_SECRET=whsec_...
Restart npm run dev after changing envs.

4) Run the app
npm run dev
5) Test checkout (subscription)
Visit /signin, enter any email (magic link via Resend or local dev fallback).

Go to /subscribe and click Start Checkout.

Complete payment on Stripe (test card 4242 4242 4242 4242, any future expiry, any CVC).

You’ll be redirected to /success?session_id=….

6) Test Billing Portal
Go to /protected and click Manage billing → you should land in Stripe’s portal for the signed-in email (update card, cancel, invoices).

7) CLI trigger (optional)
You can simulate a successful checkout without the UI:

stripe trigger checkout.session.completed
Notes & Troubleshooting
“No configuration provided…” → Save the Customer Portal settings in Test mode (step 2).

Webhook “connection refused” → Use http://127.0.0.1:3000 (not localhost), ensure npm run dev is running on port 3000.

Portal says “No billing profile yet” → The signed-in email must have at least one Stripe Customer (complete checkout once with that email).

Checkout uses a 303 redirect from /api/checkout; /subscribe requires sign-in and prefills your email on Stripe.

makefile

---

## 🔧 Scripts

- `npm run dev` — Next.js dev (Turbopack)
- `npm run build` / `npm start` — production
- `npx prisma studio` — DB browser

---

## 🗂️ Project structure

```
src/
  app/
    api/
      auth/
        [...nextauth]/route.ts     # Auth.js handlers (catch-all)
      webhook/route.ts             # Stripe webhook (add this in step 5)
    (public)/
      signin/page.tsx              # Sign-in page
    protected/page.tsx             # Example protected route
    layout.tsx                     # Root layout (fonts + Header)
    page.tsx                       # Home
  components/
    Header.tsx
    AuthButtons.tsx
  lib/
    prisma.ts                      # Prisma client (dev-safe)
    supabase.ts                    # Public Supabase client
    supabaseAdmin.ts               # Server-only client (service role)
auth.ts                            # Auth.js config (providers, adapter, callbacks)
prisma/
  schema.prisma
```

---

## 🔐 Environment variables

| Key | Purpose | Notes |
|---|---|---|
| `AUTH_SECRET` | Token/email hash secret | Generate per project |
| `NEXTAUTH_URL` | App URL | `http://localhost:3000` in dev |
| `DATABASE_URL` | Prisma client conn | Use **Session Pooler**; encode password; `sslmode=require` |
| `DIRECT_URL` | Prisma Migrate conn | Direct host; helpful for migrations |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | Public, safe for client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Public, safe for client |
| `RESEND_API_KEY` | Email provider | Optional for dev; verify domain later |
| `EMAIL_FROM` | Sender address | e.g., `App Team <no-reply@auth.example.com>` |
| `STRIPE_SECRET_KEY` | Server SDK | Required for checkout/webhooks |
| `STRIPE_WEBHOOK_SECRET` | Verify webhooks | From `stripe listen` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Frontend Stripe | Public |
| `NEXT_PUBLIC_STRIPE_PRICE_ID` | Your price id | One-time or recurring |
| `NEXT_PUBLIC_SITE_URL` | Success/Cancel URLs | `http://localhost:3000` in dev |
| `NEXT_PUBLIC_POSTHOG_KEY` | Analytics key | Public |
| `NEXT_PUBLIC_POSTHOG_HOST` | Analytics host | Optional; defaults to US host |

---

## 🧭 Usage notes

- **Auth**: Email magic links via Resend; when unset locally, link prints to server console.
- **DB access**: Use **Prisma** for relational data. Use **Supabase client** for Storage/Realtime.
- **Stripe**: Pin an API version in `src/lib/stripe.ts` and match your webhook endpoint’s version in the dashboard.
- **Protected routes**: Use `auth()` inside server components or add middleware later.

---

## 📦 Reusing this boilerplate

1. Click “Use this template” on GitHub or clone and rename.  
2. Copy `.env.example` → `.env`, set project-specific keys.  
3. `npx prisma migrate dev` → `npm run dev`.  
4. Customize branding (title, header), add features, ship.

---

## 🛰️ Deploy

**Vercel** recommended:
- Add all env vars in Vercel → Project Settings → Environment Variables.
- Set `NEXTAUTH_URL` to your production URL.
- Keep `DATABASE_URL` pointing to the **Session Pooler**; use `DIRECT_URL` only for migrations.

---

## 🩺 Troubleshooting

- **Prisma “Missing DATABASE_URL”**: ensure `.env` exists at project root and is loaded (if using `prisma.config.ts`, import `dotenv/config` there).  
- **Supabase IPv4/IPv6**: if direct host fails on IPv4, use Session Pooler for `DATABASE_URL`.  
- **Magic link not received**: in dev, check server console for the fallback link; in prod, verify your domain in Resend.  
- **Webhook signature error**: double-check `STRIPE_WEBHOOK_SECRET` and ensure raw body parsing in your route (App Router `req.text()`).

---

## 📚 Learn More

- [Next.js docs](https://nextjs.org/docs)  
- [Prisma](https://www.prisma.io/docs)  
- [Supabase](https://supabase.com/docs)  
- [Auth.js](https://authjs.dev/)  
- [Stripe](https://stripe.com/docs)  
- [PostHog](https://posthog.com/docs)
