-- Add column to track when the explorer gift was last claimed
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS explorer_claimed_at TIMESTAMP WITH TIME ZONE;

-- Add comment explaining the column
COMMENT ON COLUMN public.profiles.explorer_claimed_at IS 'Timestamp of when the explorer gift was last claimed. Used for 6-month anti-abuse logic.';