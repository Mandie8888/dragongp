
DROP POLICY IF EXISTS "Users can insert their own searches" ON public.ticker_searches;

CREATE POLICY "Anyone can insert anonymous searches"
ON public.ticker_searches
FOR INSERT
TO anon, authenticated
WITH CHECK (user_id IS NULL);
