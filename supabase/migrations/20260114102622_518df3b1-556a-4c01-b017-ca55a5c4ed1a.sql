-- Create table to track ticker searches for trending feature
CREATE TABLE public.ticker_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  market TEXT NOT NULL CHECK (market IN ('HK', 'US', 'TW', 'CRYPTO')),
  user_id UUID REFERENCES auth.users(id),
  searched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient querying of recent searches
CREATE INDEX idx_ticker_searches_symbol ON public.ticker_searches(symbol);
CREATE INDEX idx_ticker_searches_market ON public.ticker_searches(market);
CREATE INDEX idx_ticker_searches_searched_at ON public.ticker_searches(searched_at DESC);

-- Enable Row Level Security
ALTER TABLE public.ticker_searches ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own searches
CREATE POLICY "Users can insert their own searches" 
ON public.ticker_searches 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow anyone to read aggregated data (for trending)
CREATE POLICY "Anyone can view ticker searches for trending" 
ON public.ticker_searches 
FOR SELECT 
USING (true);

-- Create a function to get trending tickers
CREATE OR REPLACE FUNCTION public.get_trending_tickers(p_market TEXT DEFAULT NULL, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  symbol TEXT,
  market TEXT,
  search_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ts.symbol,
    ts.market,
    COUNT(*) as search_count
  FROM public.ticker_searches ts
  WHERE ts.searched_at > now() - INTERVAL '24 hours'
    AND (p_market IS NULL OR ts.market = p_market)
  GROUP BY ts.symbol, ts.market
  ORDER BY search_count DESC
  LIMIT p_limit;
END;
$$;

-- Add some sample trending data for demo purposes
INSERT INTO public.ticker_searches (symbol, market, searched_at) VALUES
  ('TSLA', 'US', now() - INTERVAL '1 hour'),
  ('TSLA', 'US', now() - INTERVAL '2 hours'),
  ('TSLA', 'US', now() - INTERVAL '3 hours'),
  ('AAPL', 'US', now() - INTERVAL '1 hour'),
  ('AAPL', 'US', now() - INTERVAL '4 hours'),
  ('NVDA', 'US', now() - INTERVAL '2 hours'),
  ('NVDA', 'US', now() - INTERVAL '5 hours'),
  ('NVDA', 'US', now() - INTERVAL '6 hours'),
  ('MSFT', 'US', now() - INTERVAL '3 hours'),
  ('AMZN', 'US', now() - INTERVAL '4 hours'),
  ('GOOGL', 'US', now() - INTERVAL '5 hours'),
  ('META', 'US', now() - INTERVAL '6 hours'),
  ('AMD', 'US', now() - INTERVAL '7 hours'),
  ('INTC', 'US', now() - INTERVAL '8 hours'),
  ('COIN', 'US', now() - INTERVAL '9 hours'),
  ('0700.HK', 'HK', now() - INTERVAL '1 hour'),
  ('0700.HK', 'HK', now() - INTERVAL '2 hours'),
  ('0700.HK', 'HK', now() - INTERVAL '3 hours'),
  ('0001.HK', 'HK', now() - INTERVAL '1 hour'),
  ('0001.HK', 'HK', now() - INTERVAL '4 hours'),
  ('9988.HK', 'HK', now() - INTERVAL '2 hours'),
  ('9988.HK', 'HK', now() - INTERVAL '5 hours'),
  ('3690.HK', 'HK', now() - INTERVAL '3 hours'),
  ('1810.HK', 'HK', now() - INTERVAL '4 hours'),
  ('2318.HK', 'HK', now() - INTERVAL '5 hours'),
  ('0005.HK', 'HK', now() - INTERVAL '6 hours'),
  ('0388.HK', 'HK', now() - INTERVAL '7 hours'),
  ('0941.HK', 'HK', now() - INTERVAL '8 hours'),
  ('1299.HK', 'HK', now() - INTERVAL '9 hours');