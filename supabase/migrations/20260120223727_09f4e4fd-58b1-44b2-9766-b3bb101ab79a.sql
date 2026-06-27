-- Update the handle_new_user function to set explorer_claimed_at
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, credit_balance, tier, explorer_expires_at, is_explorer_used, explorer_claimed_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    5, -- Explorer gift: 5 free credits
    'explorer',
    now() + INTERVAL '48 hours',
    true, -- Mark as used immediately on signup
    now() -- Record when the gift was claimed
  );
  RETURN NEW;
END;
$function$;