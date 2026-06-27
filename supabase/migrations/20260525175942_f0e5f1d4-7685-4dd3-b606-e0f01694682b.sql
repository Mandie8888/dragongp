
-- 1) ticker_searches: hide user_id from public reads
DROP POLICY IF EXISTS "Anyone can view ticker searches for trending" ON public.ticker_searches;

CREATE POLICY "Public can view anonymous searches"
ON public.ticker_searches
FOR SELECT
TO anon, authenticated
USING (user_id IS NULL);

CREATE POLICY "Users can view their own searches"
ON public.ticker_searches
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2) testimonials: enforce email ownership on insert
DROP POLICY IF EXISTS "Authenticated users can submit testimonials" ON public.testimonials;

CREATE POLICY "Authenticated users can submit their own testimonials"
ON public.testimonials
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND lower(email) = lower((SELECT p.email FROM public.profiles p WHERE p.user_id = auth.uid()))
);

-- 3) payments: only the backend (service_role) may write payment rows
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payments;

-- 4) SECURITY DEFINER helper functions: revoke public/anon execute
REVOKE EXECUTE ON FUNCTION public.consume_credit(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.can_generate_report(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_trending_tickers(text, integer) FROM PUBLIC, anon;

-- add_credits must only be callable by the service_role (stripe-webhook),
-- never by anon or authenticated end-users.
REVOKE EXECUTE ON FUNCTION public.add_credits(uuid, integer, text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.consume_credit(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_generate_report(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_trending_tickers(text, integer) TO authenticated;
