# B.L. DIAGNOSTIC CENTER — DEPLOYMENT & MIGRATION GUIDE

## Technology Stack
- **Frontend**: React SPA with TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL (Neon or any PostgreSQL instance)
- **Authentication**: Local auth with JWT tokens
- **File Storage**: Local state / Browser print
- **Hosting Platforms**: Vercel (Frontend) & Render (Backend)

---

## 1. Database Setup Instructions

### 1.1 Create PostgreSQL Database
1. Set up a PostgreSQL database using [Neon](https://neon.tech) or any PostgreSQL provider.
2. Note your **Database Connection URL**.

### 1.2 Run PostgreSQL Schema Migration
Run the SQL script located at:
`src/data/schemaSql.ts` (exported as `PRODUCTION_SCHEMA_SQL`)

This creates:
- `users`, `addresses`, `categories`, `tests`, `packages`
- `bookings`, `booking_items`, `booking_status_history`, `collections`
- `reports`, `activity_logs`
- Indexes and foreign key constraints

---

## 2. Frontend Deployment (Vercel)

1. Connect your repository to [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Set Environment Variables:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://bl-diagnostic-backend.onrender.com`)
4. Deploy! Custom domain can be added under **Project Settings > Domains**.

---

## 3. Backend Deployment (Render)

1. Connect your repository to [Render](https://render.com) as a **Web Service**.
2. Runtime: **Node**.
3. Build Command: `npm install && npm run build`
4. Start Command: `node server.ts` or `tsx server.ts`
5. Set Environment Variables:
   - `PORT`: `3000` or `10000`
   - `DATABASE_URL`: Your PostgreSQL connection URL
   - `JWT_SECRET`: Random 64-character secret string

---

## 4. Verification & Testing

- **Patient Flow**: Book tests, choose slot & home pickup address, download verified reports via browser print.
- **Admin Flow**: Access Admin Suite using authorized number `9649183422`, assign phlebotomists, generate reports, and inspect revenue analytics.
