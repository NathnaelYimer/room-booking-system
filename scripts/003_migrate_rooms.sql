-- scripts/003_migrate_rooms.sql
-- Adds `room_number`, `beds`, and `is_active` to `public.rooms` and populates sensible defaults.
-- Run this in Supabase SQL Editor. Back up your data before running in production.

-- Ensure pgcrypto is available for UUID generation used when deduplicating
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

BEGIN;

ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS room_number text,
  ADD COLUMN IF NOT EXISTS beds integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Populate room_number from name if missing (safe default)
UPDATE public.rooms
SET room_number = COALESCE(NULLIF(TRIM(room_number), ''), LEFT(REGEXP_REPLACE(COALESCE(name, ''), '\s+', '_', 'g'), 64))
WHERE room_number IS NULL OR TRIM(room_number) = '';

-- For duplicated room_number values, append a short uuid suffix
WITH duplicates AS (
  SELECT room_number
  FROM public.rooms
  GROUP BY room_number
  HAVING COUNT(*) > 1
)
UPDATE public.rooms r
SET room_number = r.room_number || '-' || RIGHT(gen_random_uuid()::text, 8)
FROM duplicates d
WHERE r.room_number = d.room_number;

-- Fill beds from capacity where available, fallback to 1
UPDATE public.rooms
SET beds = COALESCE(beds, NULLIF(capacity, 0), 1)
WHERE beds IS NULL;

-- Ensure is_active is set to true for existing rows unless explicitly false
UPDATE public.rooms
SET is_active = true
WHERE is_active IS NULL;

-- Optional: add a UNIQUE constraint on room_number after manual verification
-- ALTER TABLE public.rooms
--   ADD CONSTRAINT rooms_room_number_unique UNIQUE (room_number);

COMMIT;

-- Note: review the table contents after running. If you want the script to
-- also clean or migrate specific fields, modify above accordingly.
