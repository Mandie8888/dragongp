
CREATE TABLE IF NOT EXISTS public.stock_data_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  market text NOT NULL,
  data jsonb NOT NULL,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  UNIQUE (symbol, market)
);

CREATE INDEX IF NOT EXISTS idx_stock_data_cache_expires ON public.stock_data_cache (expires_at);

ALTER TABLE public.stock_data_cache ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read cached stock data (it's market data, not user-specific)
CREATE POLICY "Authenticated users can read stock cache"
ON public.stock_data_cache
FOR SELECT
TO authenticated
USING (true);

-- Writes happen only from the edge function (service role bypasses RLS); no client write policy.
