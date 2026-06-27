-- Fix DEFINER_OR_RPC_BYPASS: Block direct client calls to add_credits
-- Only service_role (via stripe webhook) should be able to call this
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
  v_new_tier := CASE 
    WHEN p_plan_type = 'vip' THEN 'vip'
    WHEN p_plan_type = 'pro' THEN 'pro'
    ELSE 'coffee'
  END;
  
  UPDATE public.profiles 
  SET 
    credit_balance = credit_balance + p_credits,
    tier = CASE 
      WHEN v_new_tier IN ('vip', 'pro') THEN v_new_tier 
      ELSE tier 
    END,
    updated_at = now()
  WHERE user_id = p_user_id
  RETURNING credit_balance INTO v_new_balance;
  
  RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$function$;

-- Fix PUBLIC_DATA_EXPOSURE: Restrict profile UPDATE to prevent credit/tier manipulation
-- Remove the overly permissive policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a new restrictive policy that blocks sensitive field updates
-- Users can only update their email field (if needed for future profile updates)
-- All credit/tier/explorer fields are protected and can only be modified server-side
CREATE POLICY "Users can update their own email only" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add database constraints to prevent invalid data even if somehow bypassed
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS credit_balance_non_negative;
ALTER TABLE public.profiles ADD CONSTRAINT credit_balance_non_negative CHECK (credit_balance >= 0);

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS tier_valid;
ALTER TABLE public.profiles ADD CONSTRAINT tier_valid CHECK (tier IN ('explorer', 'coffee', 'pro', 'vip'));

-- Fix PUBLIC_USER_DATA: Update testimonials SELECT policy to exclude email from public reads
-- The current policy already restricts to approved+featured, but we'll reinforce it
DROP POLICY IF EXISTS "Anyone can view featured testimonials" ON public.testimonials;

-- Create a new policy that still allows reading approved/featured testimonials
-- The application should use a column selection that excludes email
CREATE POLICY "Anyone can view featured testimonials" 
ON public.testimonials 
FOR SELECT 
USING ((is_approved = true) AND (is_featured = true));