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
Features
--------
- User registration and login (Supabase Auth)
- Browse active rooms and check availability
- Create and manage reservations with overlap prevention
- Admin panel: manage rooms and view all reservations

Tech stack
----------
- Next.js (app dir)
- Supabase (Postgres, Auth, RLS)
- TypeScript, Tailwind CSS

Files you may need
------------------
- `scripts/001_init_schema.sql` — create tables, RLS and triggers
- `scripts/002_seed_rooms.sql` — seed sample rooms
- `scripts/003_migrate_rooms.sql` — optional migration to add `room_number`, `beds`, `is_active`

Environment variables (required)
-------------------------------
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only — keep secret)

Minimal API overview
--------------------
- `GET /api/rooms` — list active rooms (public)
- `GET /api/rooms/:id` — room details
- `POST /api/reservations` — create a reservation (authenticated users)
- `GET /api/reservations` — list user's reservations
- Admin-only (server checks): `/api/admin/*` — manage rooms & reservations

How to run the DB migration quickly
----------------------------------
1. Open Supabase project → SQL Editor
2. Paste and run `scripts/001_init_schema.sql`
3. Optionally run `scripts/002_seed_rooms.sql` and `scripts/003_migrate_rooms.sql`

Make a user admin
-----------------
Run the SQL snippet above in the Supabase SQL Editor to set a profile's `role` to `admin`.

Notes
-----
- Do not commit `SUPABASE_SERVICE_ROLE_KEY` to source control.
- After pushing to GitHub, deploy on Vercel and add the environment variables in the project settings.

