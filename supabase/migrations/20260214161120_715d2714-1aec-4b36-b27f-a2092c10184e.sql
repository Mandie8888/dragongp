-- Update handle_new_user to give 10 credits during Lunar Valentine trial (until Feb 24, 2026)
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
    now()
  );
  RETURN NEW;
END;
$function$;