-- Fix can_generate_report to allow users with credits regardless of explorer restrictions
CREATE OR REPLACE FUNCTION public.can_generate_report(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_profile RECORD;
BEGIN
  -- SECURITY: Verify caller owns this user_id
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('can_generate', false, 'reason', 'not_authenticated');
  END IF;
  
  IF auth.uid() != p_user_id THEN
    RETURN jsonb_build_object('can_generate', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_profile FROM public.profiles WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('can_generate', false, 'reason', 'no_profile');
  END IF;
  
  -- PRIORITY: Check credit balance FIRST
  -- If user has credits > 0, allow them to generate regardless of explorer restrictions
  IF v_profile.credit_balance > 0 THEN
    RETURN jsonb_build_object('can_generate', true, 'credits_remaining', v_profile.credit_balance);
  END IF;
  
  -- Only apply explorer restrictions if user has NO credits
  -- Check if explorer tier and hit 5-report limit
  IF v_profile.tier = 'explorer' AND v_profile.total_reports_generated >= 5 THEN
    RETURN jsonb_build_object('can_generate', false, 'reason', 'explorer_limit_reached');
  END IF;
  
  -- Check if explorer tier and expired
  IF v_profile.tier = 'explorer' AND v_profile.explorer_expires_at IS NOT NULL AND v_profile.explorer_expires_at < now() THEN
    RETURN jsonb_build_object('can_generate', false, 'reason', 'explorer_expired');
  END IF;
  
  -- If we reach here, user has 0 credits
  RETURN jsonb_build_object('can_generate', false, 'reason', 'no_credits');
END;
$function$;

-- Fix add_credits to upgrade tier from 'explorer' to 'coffee' when buying coffee plan
CREATE OR REPLACE FUNCTION public.add_credits(p_user_id uuid, p_credits integer, p_plan_type text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_new_balance INTEGER;
  v_new_tier TEXT;
BEGIN
  -- SECURITY: Block all direct client calls (authenticated users)
  -- This function should ONLY be called by the stripe-webhook edge function
  -- which uses the service_role key (no auth.uid() present)
  IF auth.uid() IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized_direct_call');
  END IF;
  
  -- Determine new tier based on plan
  -- Always upgrade to at least 'coffee' tier when purchasing
  v_new_tier := CASE 
    WHEN p_plan_type = 'vip' THEN 'vip'
    WHEN p_plan_type = 'pro' THEN 'pro'
    ELSE 'coffee'
  END;
  
  UPDATE public.profiles 
  SET 
    credit_balance = credit_balance + p_credits,
    -- Always upgrade tier when purchasing any plan (including coffee)
    tier = v_new_tier,
    updated_at = now()
  WHERE user_id = p_user_id
  RETURNING credit_balance INTO v_new_balance;
  
  RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$function$;