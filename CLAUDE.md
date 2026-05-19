# Retatrutide Research Center — CLAUDE.md

## Project Overview

**Retatrutide Research Center (RRC)** is a B2B e-commerce platform for pharmaceutical research compounds (GLP-1/GIP/Glucagon triple agonist peptides). Products are sold exclusively for laboratory and in-vitro research.

- **Domain**: retatrutideresearchcenter.vercel.app
- **Support email**: support@vertexbiolabs.com
- **App directory**: `alluvi/` (Next.js app lives here — always `cd alluvi` before running commands)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Auth | Supabase magic-link (passwordless OTP) |
| Database | Supabase (PostgreSQL + RLS) |
| Styling | Tailwind CSS 4, Framer Motion 12 |
| Icons | Lucide React |
| Email | Resend API |
| Deployment | Vercel |

---

## Directory Structure

```
alluvi/
├── app/
│   ├── admin/            # Admin dashboard (orders, products, chat)
│   ├── api/              # API routes (send-order, send-order-email)
│   ├── auth/callback/    # OAuth/magic-link callback handler
│   ├── login/            # Magic link auth page
│   ├── home/             # Homepage
│   ├── products/         # Product catalog
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── orders/           # User order history
│   └── chat/             # Customer support chat
├── components/           # Shared UI (Header, Footer, BrandLogo, ThemeProvider)
├── lib/
│   ├── supabase.ts       # Supabase client + TypeScript types
│   └── admin.ts          # Admin email whitelist + isAdminEmail()
├── supabase/
│   └── schema.sql        # Full DB schema, RLS policies, triggers
└── .env.local            # Supabase URL/key + Resend key (not committed)
```

---

## Authentication & Admin Access

### Auth Flow
Magic link (passwordless): user enters email → Supabase sends link → `/auth/callback` exchanges code → session stored in cookies.

### Admin Access — Two Checks (EITHER satisfies access)
1. **Email whitelist** in `lib/admin.ts` — fast, no DB round-trip
2. **`profiles.is_admin = true`** in Supabase DB

### Current Admin Emails (`lib/admin.ts`)
```typescript
export const ADMIN_EMAILS = [
  'doungmolagoungvaldes@gmail.com',
  'kentrellzaza83@gmail.com',
] as const
```

To add a new admin: add their email to this array OR set `is_admin = true` in the `profiles` table.

Admin pages (`/admin/*`) redirect to `/home` if neither check passes.

---

## Database Tables

| Table | Purpose |
|---|---|
| `profiles` | User accounts, `is_admin` flag |
| `products` | Catalog, `is_active` flag |
| `orders` | Purchases with status (pending/confirmed/cancelled) |
| `order_items` | Line items per order |
| `cart` | Per-user shopping cart |
| `chat_conversations` | Support threads |
| `chat_messages` | Individual messages with realtime |
| `categories` | Product categories |

RLS is enabled on all tables. Admins bypass user-scoped policies.

---

## Environment Variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://itzlpefmzkptkpihgcca.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<jwt>
RESEND_API_KEY=<key>
```

Never commit `.env.local` — it's in `.gitignore`.

---

## Common Commands

```bash
cd alluvi
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
```

---

## Key Patterns

- **Admin guard pattern**: every `/admin` page checks `isAdminEmail(user.email) || profile.is_admin` then redirects if false.
- **Supabase client**: use `lib/supabase.ts` helpers — don't instantiate raw clients in page files.
- **Email**: all transactional email goes through `app/api/send-order/` or `app/api/send-order-email/` via Resend.
- **Design system**: use `ds-*` CSS classes defined in `globals.css`; avoid raw Tailwind one-offs for brand-level styles.
- **No passwords**: auth is purely magic-link — never add password fields.
