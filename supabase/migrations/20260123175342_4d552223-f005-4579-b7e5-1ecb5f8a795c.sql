-- Fix DEFINER_OR_RPC_BYPASS: Add auth.uid() validation to consume_credit
CREATE OR REPLACE FUNCTION public.consume_credit(p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_can_generate JSONB;
  v_new_balance INTEGER;
BEGIN
  -- SECURITY: Verify caller owns this user_id
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_authenticated');
  END IF;
  
  IF auth.uid() != p_user_id THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  -- First check if user can generate
  v_can_generate := public.can_generate_report(p_user_id);
  
  IF NOT (v_can_generate->>'can_generate')::boolean THEN
    RETURN v_can_generate;
  END IF;
  
  -- Consume credit and increment report count
  UPDATE public.profiles 
  SET 
    credit_balance = credit_balance - 1,
    total_reports_generated = total_reports_generated + 1,
    updated_at = now()
  WHERE user_id = p_user_id
  RETURNING credit_balance INTO v_new_balance;
  
  RETURN jsonb_build_object('success', true, 'credits_remaining', v_new_balance);
END;
$function$;

-- Fix DEFINER_OR_RPC_BYPASS: Add auth.uid() validation to can_generate_report
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
  
  -- Check if explorer tier and hit 5-report limit
  IF v_profile.tier = 'explorer' AND v_profile.total_reports_generated >= 5 THEN
    RETURN jsonb_build_object('can_generate', false, 'reason', 'explorer_limit_reached');
  END IF;
  
  -- Check if explorer tier and expired
  IF v_profile.tier = 'explorer' AND v_profile.explorer_expires_at IS NOT NULL AND v_profile.explorer_expires_at < now() THEN
    RETURN jsonb_build_object('can_generate', false, 'reason', 'explorer_expired');
  END IF;
  
  -- Check credit balance
  IF v_profile.credit_balance <= 0 THEN
    RETURN jsonb_build_object('can_generate', false, 'reason', 'no_credits');
  END IF;
  
  RETURN jsonb_build_object('can_generate', true, 'credits_remaining', v_profile.credit_balance);
END;
$function$;

-- Fix PUBLIC_DATA_EXPOSURE: Require authentication for testimonial submission
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON public.testimonials;

CREATE POLICY "Authenticated users can submit testimonials"
ON public.testimonials
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);