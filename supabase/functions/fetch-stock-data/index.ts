import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

console.log("Hello from fetch-stock-data!");

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { symbol, market } = body;
    
    console.log(`Fetching data for ${symbol} (${market || 'US'})`);

    if (!symbol) {
      throw new Error("Symbol is required");
    }

    // Use Yahoo Finance API
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=3mo`;
    console.log(`Fetching from Yahoo: ${yahooUrl}`);
    
    const response = await fetch(yahooUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      console.error(`Yahoo API returned ${response.status}`);
      throw new Error(`Failed to fetch data from Yahoo Finance: ${response.status}`);
    }

    const data = await response.json();
    console.log("Yahoo API response received");

    const chart = data.chart;
    if (!chart || !chart.result || chart.result.length === 0) {
      console.error("No results found in Yahoo response");
      throw new Error(`No data found for symbol: ${symbol}`);
    }

    const result = chart.result[0];
    const meta = result.meta;
    
    if (!meta) {
      throw new Error("No metadata found");
    }

    // ============================================================
    // FIX: Use ACTUAL closing prices for accurate change calculation
    // ============================================================
    
    // Get the closing prices from the quotes
    const quotes = result.indicators?.quote?.[0];
    const closes = quotes?.close || [];
    const validCloses = closes.filter((c: number) => c !== null && c > 0);
    
    if (validCloses.length < 2) {
      console.log(`❌ Not enough data points for ${symbol}`);
      // Fallback to meta data
      const price = meta.regularMarketPrice || meta.previousClose || 0;
      const previousClose = meta.previousClose || price;
      const changePercent = previousClose > 0 ? ((price - previousClose) / previousClose) * 100 : 0;
      
      return new Response(
        JSON.stringify({
          symbol: meta.symbol || symbol,
          companyName: meta.longName || meta.shortName || symbol,
          price: price,
          change: price - previousClose,
          changePercent: parseFloat(changePercent.toFixed(2)),
          previousClose: previousClose,
          dayHigh: meta.regularMarketDayHigh || price,
          dayLow: meta.regularMarketDayLow || price,
          high52Week: meta.fiftyTwoWeekHigh || price * 1.35,
          low52Week: meta.fiftyTwoWeekLow || price * 0.65,
          volume: meta.regularMarketVolume || 0,
          currency: meta.currency || "USD",
          market: market || "US",
          marketState: meta.marketState || "REGULAR",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    // Use the ACTUAL closing prices for accurate calculation
    const latestClose = validCloses[validCloses.length - 1];
    const previousClosePrice = validCloses[validCloses.length - 2];
    
    // Calculate change based on ACTUAL closing prices
    const change = latestClose - previousClosePrice;
    const changePercent = previousClosePrice > 0 ? (change / previousClosePrice) * 100 : 0;
    
    const price = latestClose;
    const previousClose = previousClosePrice;
    
    console.log(`📊 ${symbol} - Close: ${price}, Previous: ${previousClose}, Change: ${changePercent.toFixed(2)}%`);

    // Calculate day high/low from the data
    const allHighs = quotes?.high || [];
    const allLows = quotes?.low || [];
    const validHighs = allHighs.filter((h: number) => h !== null && h > 0);
    const validLows = allLows.filter((l: number) => l !== null && l > 0);
    
    const dayHigh = validHighs.length > 0 ? Math.max(...validHighs.slice(-5)) : price;
    const dayLow = validLows.length > 0 ? Math.min(...validLows.slice(-5)) : price;

    // Format volume
    const volumeNum = meta.regularMarketVolume || (quotes?.volume?.[quotes.volume.length - 1] || 0);
    let volumeDisplay = volumeNum.toString();
    if (volumeNum >= 1000000) {
      volumeDisplay = (volumeNum / 1000000).toFixed(2) + 'M';
    } else if (volumeNum >= 1000) {
      volumeDisplay = (volumeNum / 1000).toFixed(2) + 'K';
    }

    const responseData = {
      symbol: meta.symbol || symbol,
      companyName: meta.longName || meta.shortName || symbol,
      price: price,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      previousClose: previousClose,
      dayHigh: dayHigh,
      dayLow: dayLow,
      high52Week: meta.fiftyTwoWeekHigh || price * 1.35,
      low52Week: meta.fiftyTwoWeekLow || price * 0.65,
      volume: volumeNum,
      volumeDisplay: volumeDisplay,
      currency: meta.currency || "USD",
      market: market || "US",
      marketState: meta.marketState || "REGULAR",
      high: dayHigh,
      low: dayLow,
      open: meta.regularMarketOpen || price,
    };

    console.log("Returning data:", responseData);

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack || "No stack trace available"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});