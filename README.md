## Room Booking System

Small Next.js + Supabase app to book rooms.

Quick start
----------
- Install dependencies: `npm install`
- Run locally: `npm run dev` (open `http://localhost:3000`)

Environment variables
---------------------
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)

Database
--------
- Run `scripts/001_init_schema.sql` in Supabase SQL Editor.
- Optional migration: `scripts/003_migrate_rooms.sql`.

Make a user admin
-----------------
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'user@example.com';
```

Key endpoints
-------------
- `GET /api/rooms` — active rooms
- `POST /api/reservations` — create reservation
- Admin APIs: `/api/admin/*` (server-side `profiles.role = 'admin'` required)

Deployment
----------
- Push to GitHub and deploy on Vercel. Add the environment variables in project settings.
