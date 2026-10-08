# B.L. DIAGNOSTIC CENTER — DEPLOYMENT & MIGRATION GUIDE

## Technology Stack
- **Frontend**: Next.js 15 / React SPA with TypeScript, Tailwind CSS, Shadcn-style UI
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: Supabase PostgreSQL (Free Tier with Connection Pooling)
- **Authentication**: Supabase Auth (Phone Number OTP)
- **File Storage**: Supabase Storage (`reports`, `user-documents`, `website-assets`)
- **Hosting Platforms**: Vercel (Frontend) & Render (Backend)

---

## 1. Supabase Setup Instructions

### 1.1 Create Supabase Project
1. Log in to [Supabase](https://supabase.com) and create a new project (e.g. `bl-diagnostic-center`).
2. Note your **Project URL**, **Anon Key**, **Service Role Key**, and **PostgreSQL Database URL**.

### 1.2 Run PostgreSQL Schema Migration
In the Supabase SQL Editor, run the SQL script located at:
`supabase/migrations/20261007_init_bl_diagnostic.sql`

This creates:
- `users`, `addresses`, `categories`, `tests`, `packages`, `package_tests`
- `bookings`, `booking_items`, `booking_status_history`, `collections`, `payments`
- `reports`, `report_versions`, `notifications`, `admin_users`, `activity_logs`
- Indexes, foreign key constraints, and Row Level Security (RLS) policies
- Pre-seeds Chief Admin record for phone `9649183422`

### 1.3 Create Supabase Storage Buckets
In the Supabase Storage dashboard, create three buckets:
1. `reports` (Private — access controlled via signed download URLs)
2. `user-documents` (Private — for prescription and referral uploads)
3. `website-assets` (Public — for laboratory test banner imagery)

### 1.4 Configure Phone Auth
1. Under **Authentication > Providers > Phone**, enable SMS / Phone provider (e.g. Twilio or MessageBird).
2. Set OTP expiration time (default 60 seconds).

---

## 2. Frontend Deployment (Vercel)

1. Connect your repository to [Vercel](https://vercel.com).
2. Framework Preset: **Next.js** or **Vite**.
3. Set Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Public Anon Key
4. Deploy! Custom domain (`.bl-diagnostic.in`) can be added under **Project Settings > Domains**.

---

## 3. Backend Deployment (Render)

1. Connect your repository to [Render](https://render.com) as a **Web Service**.
2. Runtime: **Node**.
3. Build Command: `npm install && npm run build`
4. Start Command: `node server.ts` or `tsx server.ts`
5. Set Environment Variables:
   - `PORT`: `3000` or `10000`
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Secret Key
   - `DATABASE_URL`: Your Supabase PostgreSQL Connection Pooler URL (`pgbouncer=true`)
   - `JWT_SECRET`: Random 64-character secret string

---

## 4. Verification & Testing

- **Patient Flow**: Book tests, choose slot & home pickup address, verify via Phone OTP, download verified reports.
- **Admin Flow**: Access Admin Suite using authorized number `9649183422`, assign phlebotomists, upload PDF reports to Supabase Storage, and inspect revenue analytics.
- **Zero Google Cloud**: All dependencies, SDKs, storage, and authentication are strictly running on Supabase, PostgreSQL, Vercel, and Render.
