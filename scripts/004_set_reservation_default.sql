-- scripts/004_set_reservation_default.sql
-- Make reservation status default to 'pending' and normalize existing rows
-- Run this in Supabase SQL Editor after reviewing backups.

BEGIN;

-- Set existing NULL or empty statuses to 'pending' where appropriate
UPDATE public.reservations
SET status = 'pending'
WHERE status IS NULL OR TRIM(status) = '';

-- Set the default for new rows to 'pending'
ALTER TABLE public.reservations
  ALTER COLUMN status SET DEFAULT 'pending';

COMMIT;

-- Note: application code already inserts 'pending' on create; this ensures consistency
