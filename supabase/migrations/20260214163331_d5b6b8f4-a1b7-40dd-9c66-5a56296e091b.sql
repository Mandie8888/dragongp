-- Add referral_source column to track where users came from (utm_source, old site, etc.)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_source text DEFAULT NULL;

-- Add report_views_count to track how many reports a user has viewed (for feedback trigger)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS report_views_count integer NOT NULL DEFAULT 0;
