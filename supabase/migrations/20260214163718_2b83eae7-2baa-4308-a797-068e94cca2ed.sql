-- Update handle_new_user to capture referral_source from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, credit_balance, tier, explorer_expires_at, is_explorer_used, explorer_claimed_at, referral_source)
  VALUES (
    NEW.id, 
    NEW.email, 
    CASE 
      WHEN now() < '2026-02-25T00:00:00+00:00'::timestamptz THEN 10
      ELSE 5
    END,
    'explorer',
    CASE 
      WHEN now() < '2026-02-25T00:00:00+00:00'::timestamptz THEN '2026-02-25T00:00:00+00:00'::timestamptz
      ELSE now() + INTERVAL '48 hours'
    END,
    true,
    now(),
    COALESCE(NEW.raw_user_meta_data->>'referral_source', 'direct')
  );
  RETURN NEW;
END;
$function$;
