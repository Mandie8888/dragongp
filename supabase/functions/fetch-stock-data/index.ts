import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  high: number;
  low: number;
  companyName: string;
  exchange: string;
  currency: string;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  marketCap: number | null;
  dividendYield: number | null;
  forwardDividendRate: number | null;
  forwardDividendYield: number | null;
  declaredDividendPerShare: number | null;
  exDividendDate: string | null;
  trailingPE: number | null;
  sector: string | null;
  industry: string | null;
  longBusinessSummary: string | null;
  rsi: number | null;
  macd: number | null;
  macdSignal: number | null;
  macdHistogram: number | null;
}

// ---- Technical indicators (standard parameters) ----
// RSI: 14-period Daily, Wilder smoothing
function computeRSI(closes: number[], period = 14): number | null {
  if (closes.length < period + 1) return null;
  let gainSum = 0;
  let lossSum = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gainSum += diff;
    else lossSum -= diff;
  }
  let avgGain = gainSum / period;
  let avgLoss = lossSum / period;
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function emaSeries(values: number[], period: number): number[] {
  if (values.length < period) return [];
  const k = 2 / (period + 1);
  const out: number[] = [];
  // seed with SMA of first `period` values
  let sma = 0;
  for (let i = 0; i < period; i++) sma += values[i];
  sma /= period;
  out.push(sma);
  for (let i = period; i < values.length; i++) {
    const prev = out[out.length - 1];
    out.push(values[i] * k + prev * (1 - k));
  }
  return out;
}

// MACD: 12/26/9 EMA on daily closes
function computeMACD(closes: number[]): { macd: number; signal: number; histogram: number } | null {
  if (closes.length < 26 + 9) return null;
  const ema12 = emaSeries(closes, 12);
  const ema26 = emaSeries(closes, 26);
  // Align: ema12 starts at index 11, ema26 starts at index 25
  const offset = 26 - 12; // 14 — drop first 14 of ema12 to align with ema26
  const aligned12 = ema12.slice(offset);
  const macdLine: number[] = [];
  for (let i = 0; i < ema26.length; i++) {
    macdLine.push(aligned12[i] - ema26[i]);
  }
  const signalLine = emaSeries(macdLine, 9);
  if (signalLine.length === 0) return null;
  const macd = macdLine[macdLine.length - 1];
  const signal = signalLine[signalLine.length - 1];
  return { macd, signal, histogram: macd - signal };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Require authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: authError } = await supabaseClient.auth.getClaims(token);
    
    if (authError || !claimsData?.claims) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log(`Authenticated user: ${userId}`);

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('credit_balance, tier')
      .eq('user_id', userId)
      .single();
    
    if (profileError || !profile) {
      console.error("Profile error:", profileError);
      return new Response(
        JSON.stringify({ error: "User profile not found" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { symbol, market } = await req.json();

    if (!symbol || typeof symbol !== 'string') {
      return new Response(
        JSON.stringify({ error: "Symbol is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const symbolRegex = /^[A-Za-z0-9.\-]{1,20}$/;
    if (!symbolRegex.test(symbol)) {
      return new Response(
        JSON.stringify({ error: "Invalid symbol format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching stock data for ${symbol} in market ${market} for user ${userId}`);

    // Shared cache: both domains pull from the same row → identical numbers within TTL.
    const CACHE_TTL_SECONDS = 900; // 15 minutes
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    const cacheKeySymbol = symbol.toUpperCase();
    const cacheKeyMarket = (market || 'US').toUpperCase();
    try {
      const { data: cached } = await adminClient
        .from('stock_data_cache')
        .select('data, expires_at')
        .eq('symbol', cacheKeySymbol)
        .eq('market', cacheKeyMarket)
        .maybeSingle();
      if (cached && new Date(cached.expires_at).getTime() > Date.now()) {
        console.log(`Cache HIT for ${cacheKeySymbol}/${cacheKeyMarket}`);
        return new Response(
          JSON.stringify(cached.data),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log(`Cache MISS for ${cacheKeySymbol}/${cacheKeyMarket}`);
    } catch (e) {
      console.warn("Cache read failed, proceeding with live fetch:", e);
    }

    const yahooSymbol = symbol;

    const baseHeaders = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    };

    // Step 1: Get Yahoo Finance crumb + cookies for authenticated API access
    let crumb = "";
    let cookieHeader = "";
    try {
      const consentRes = await fetch("https://fc.yahoo.com/", { headers: baseHeaders, redirect: "manual" });
      const setCookies = consentRes.headers.get("set-cookie") || "";
      cookieHeader = setCookies.split(",").map(c => c.split(";")[0].trim()).filter(Boolean).join("; ");
      
      const crumbRes = await fetch("https://query2.finance.yahoo.com/v1/test/getcrumb", {
        headers: { ...baseHeaders, "Cookie": cookieHeader },
      });
      if (crumbRes.ok) {
        crumb = await crumbRes.text();
        console.log(`Got Yahoo crumb: ${crumb.substring(0, 8)}...`);
      } else {
        console.warn(`Crumb fetch failed: ${crumbRes.status}`);
      }
    } catch (e) {
      console.warn("Failed to get Yahoo crumb/cookies:", e);
    }

    const apiHeaders = {
      ...baseHeaders,
      "Accept": "application/json",
      ...(cookieHeader ? { "Cookie": cookieHeader } : {}),
    };

    // Fetch chart data AND quote summary in parallel
    // Fetch chart data AND quote summary in parallel
    // Use 1y of daily candles so we have enough data for RSI(14) + MACD(12,26,9)
    const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1y`;
    const crumbParam = crumb ? `&crumb=${encodeURIComponent(crumb)}` : "";
    const quoteUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(yahooSymbol)}?modules=summaryDetail,assetProfile,defaultKeyStatistics,price,calendarEvents${crumbParam}`;
    const v7Url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(yahooSymbol)}${crumbParam}`;

    console.log(`Fetching chart: ${chartUrl}`);
    console.log(`Fetching quote summary: ${quoteUrl}`);

    const [chartResponse, quoteResponse, v7Response] = await Promise.all([
      fetch(chartUrl, { headers: apiHeaders }),
      fetch(quoteUrl, { headers: apiHeaders }).catch((e) => { console.error("quoteSummary fetch error:", e); return null; }),
      fetch(v7Url, { headers: apiHeaders }).catch((e) => { console.error("v7 quote fetch error:", e); return null; }),
    ]);

    if (!chartResponse.ok) {
      console.error(`Yahoo Finance API error: ${chartResponse.status}`);
      if (chartResponse.status === 404) {
        return new Response(
          JSON.stringify({ error: "Stock symbol not found. Please check the ticker and try again.", code: "NOT_FOUND" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`Failed to fetch stock data: ${chartResponse.status}`);
    }

    const data = await chartResponse.json();
    
    if (data.chart?.error) {
      console.error(`Yahoo Finance returned error: ${JSON.stringify(data.chart.error)}`);
      throw new Error(data.chart.error.description || "Stock not found");
    }

    const result = data.chart?.result?.[0];
    if (!result) {
      throw new Error("No data returned for this symbol");
    }

    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];
    
    const currentPrice = meta.regularMarketPrice || meta.previousClose;
    const previousClose = meta.previousClose || meta.chartPreviousClose;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;
    
    // Day high/low: prefer meta (the actual current/last session), fall back to last candle
    const closesAll: number[] = (quote?.close || []).filter((c: number | null) => c !== null) as number[];
    const lastIdx = (quote?.close?.length || 0) - 1;
    const lastHigh = lastIdx >= 0 ? quote?.high?.[lastIdx] : null;
    const lastLow = lastIdx >= 0 ? quote?.low?.[lastIdx] : null;
    const high = meta.regularMarketDayHigh ?? lastHigh ?? currentPrice * 1.01;
    const low = meta.regularMarketDayLow ?? lastLow ?? currentPrice * 0.99;

    // Compute standardized technical indicators (RSI-14 daily, MACD 12/26/9 daily)
    const closesForIndicators = [...closesAll];
    // Ensure latest live price is included as the most recent close
    if (currentPrice && closesForIndicators[closesForIndicators.length - 1] !== currentPrice) {
      closesForIndicators.push(currentPrice);
    }
    const rsiValue = computeRSI(closesForIndicators, 14);
    const macdValue = computeMACD(closesForIndicators);
    console.log(`Indicators for ${symbol}: rsi=${rsiValue}, macd=${macdValue?.macd}, signal=${macdValue?.signal}, hist=${macdValue?.histogram}, closes=${closesForIndicators.length}`);

    // Use regularMarketVolume; if 0, try to get from the last available trading day in chart data
    let volume = meta.regularMarketVolume || 0;
    if (volume === 0 && quote?.volume) {
      const volumes = quote.volume.filter((v: number | null) => v !== null && v > 0);
      if (volumes.length > 0) {
        volume = volumes[volumes.length - 1]; // last non-zero volume
      }
    }

    let volumeFormatted: string;
    if (volume >= 1e9) {
      volumeFormatted = `${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      volumeFormatted = `${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      volumeFormatted = `${(volume / 1e3).toFixed(2)}K`;
    } else {
      volumeFormatted = volume.toString();
    }

    let exchangeName: string;
    if (market === "HK") {
      exchangeName = "HKEX";
    } else if (market === "TW") {
      exchangeName = "TWSE";
    } else {
      exchangeName = meta.exchangeName || meta.fullExchangeName || "NYSE/NASDAQ";
    }

    const currency = meta.currency || (market === "HK" ? "HKD" : market === "TW" ? "TWD" : "USD");
    const companyName = meta.longName || meta.shortName || symbol;

    // Extract quote summary data
    let marketCap: number | null = null;
    let dividendYield: number | null = null;
    let forwardDividendRate: number | null = null;
    let forwardDividendYield: number | null = null;
    let exDividendDate: string | null = null;
    let trailingPE: number | null = null;
    let sector: string | null = null;
    let industry: string | null = null;
    let longBusinessSummary: string | null = null;
    let declaredDividendPerShare: number | null = null;

    if (quoteResponse && quoteResponse.ok) {
      try {
        const quoteData = await quoteResponse.json();
        const qr = quoteData?.quoteSummary?.result?.[0];
        if (qr) {
          const sd = qr.summaryDetail;
          const ap = qr.assetProfile;
          const dks = qr.defaultKeyStatistics;
          const priceModule = qr.price;
          const cal = qr.calendarEvents;

          marketCap = priceModule?.marketCap?.raw || sd?.marketCap?.raw || null;
          dividendYield = sd?.dividendYield?.raw != null ? sd.dividendYield.raw * 100 : null;
          forwardDividendRate = sd?.dividendRate?.raw ?? null;
          forwardDividendYield = sd?.dividendYield?.raw != null ? sd.dividendYield.raw * 100 : null;
          if (dks?.forwardAnnualDividendYield?.raw != null) {
            forwardDividendYield = dks.forwardAnnualDividendYield.raw * 100;
          }
          if (dks?.forwardAnnualDividendRate?.raw != null) {
            forwardDividendRate = dks.forwardAnnualDividendRate.raw;
          }
          // Calendar events may have upcoming dividend info (per-payment amount)
          if (cal?.dividendValue?.raw != null) {
            declaredDividendPerShare = cal.dividendValue.raw;
          }
          // Fallback: lastDividendValue from defaultKeyStatistics (single payment)
          if (declaredDividendPerShare === null && dks?.lastDividendValue?.raw != null) {
            declaredDividendPerShare = dks.lastDividendValue.raw;
          }
          if (cal?.exDividendDate?.raw) {
            const exDate = new Date(cal.exDividendDate.raw * 1000);
            exDividendDate = exDate.toISOString().split('T')[0];
          }
          if (!exDividendDate && sd?.exDividendDate?.raw) {
            const exDate = new Date(sd.exDividendDate.raw * 1000);
            exDividendDate = exDate.toISOString().split('T')[0];
          }
          trailingPE = sd?.trailingPE?.raw || dks?.trailingPE?.raw || null;
          sector = ap?.sector || null;
          industry = ap?.industry || null;
          longBusinessSummary = ap?.longBusinessSummary || null;
          console.log(`quoteSummary data: divYield=${dividendYield}, fwdRate=${forwardDividendRate}, exDate=${exDividendDate}, marketCap=${marketCap}`);
        }
      } catch (e) {
        console.error("Error parsing quote summary:", e);
      }
    } else {
      console.warn(`quoteSummary failed: status=${quoteResponse?.status}, ok=${quoteResponse?.ok}`);
    }

    // Fallback: use v7 quote endpoint if quoteSummary returned no data
    if (v7Response && v7Response.ok && (marketCap === null || dividendYield === null)) {
      try {
        const v7Data = await v7Response.json();
        const q = v7Data?.quoteResponse?.result?.[0];
        if (q) {
          console.log(`v7 fallback data available for ${symbol}: marketCap=${q.marketCap}, divYield=${q.dividendYield}, divRate=${q.dividendRate}, sector=${q.sector}`);
          if (marketCap === null) marketCap = q.marketCap ?? null;
          if (dividendYield === null && q.trailingAnnualDividendYield != null) {
            dividendYield = q.trailingAnnualDividendYield * 100;
          }
          if (forwardDividendRate === null) forwardDividendRate = q.dividendRate ?? null;
          if (forwardDividendYield === null && q.dividendYield != null) {
            forwardDividendYield = q.dividendYield * 100;
          }
          if (trailingPE === null) trailingPE = q.trailingPE ?? null;
          if (sector === null) sector = q.sector ?? null;
          if (industry === null) industry = q.industry ?? null;
          if (exDividendDate === null && q.dividendDate) {
            const exDate = new Date(q.dividendDate * 1000);
            exDividendDate = exDate.toISOString().split('T')[0];
          }
        }
      } catch (e) {
        console.error("Error parsing v7 quote:", e);
      }
    } else if (v7Response && !v7Response.ok) {
      console.warn(`v7 quote failed: status=${v7Response.status}`);
    }

    const stockData: StockData = {
      symbol,
      price: Number(currentPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: volumeFormatted,
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      companyName,
      exchange: exchangeName,
      currency,
      previousClose: Number(previousClose.toFixed(2)),
      dayHigh: Number(high.toFixed(2)),
      dayLow: Number(low.toFixed(2)),
      marketCap,
      dividendYield: dividendYield != null ? Number(dividendYield.toFixed(2)) : null,
      forwardDividendRate: forwardDividendRate != null ? Number(forwardDividendRate.toFixed(4)) : null,
      forwardDividendYield: forwardDividendYield != null ? Number(forwardDividendYield.toFixed(2)) : null,
      declaredDividendPerShare: declaredDividendPerShare != null ? Number(declaredDividendPerShare.toFixed(4)) : null,
      exDividendDate,
      trailingPE: trailingPE != null ? Number(trailingPE.toFixed(2)) : null,
      sector,
      industry,
      longBusinessSummary,
      rsi: rsiValue != null ? Number(rsiValue.toFixed(2)) : null,
      macd: macdValue ? Number(macdValue.macd.toFixed(4)) : null,
      macdSignal: macdValue ? Number(macdValue.signal.toFixed(4)) : null,
      macdHistogram: macdValue ? Number(macdValue.histogram.toFixed(4)) : null,
    };

    console.log(`Successfully fetched data for ${symbol}:`, JSON.stringify(stockData).substring(0, 500));

    // Write to shared cache so both domains return identical values for the TTL window.
    try {
      const expiresAt = new Date(Date.now() + CACHE_TTL_SECONDS * 1000).toISOString();
      await adminClient
        .from('stock_data_cache')
        .upsert({
          symbol: cacheKeySymbol,
          market: cacheKeyMarket,
          data: stockData,
          fetched_at: new Date().toISOString(),
          expires_at: expiresAt,
        }, { onConflict: 'symbol,market' });
      console.log(`Cache WRITE for ${cacheKeySymbol}/${cacheKeyMarket} expires ${expiresAt}`);
    } catch (e) {
      console.warn("Cache write failed:", e);
    }

    return new Response(
      JSON.stringify(stockData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error fetching stock data:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch stock data";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
