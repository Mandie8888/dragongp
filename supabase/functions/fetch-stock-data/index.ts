// supabase/functions/fetch-stock-data/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

console.log("Hello from fetch-stock-data!");

// Calculate RSI (14-period) - More accurate implementation
function calculateRSI(closes: number[], period: number = 14): number {
  if (closes.length < period + 1) {
    console.log(`Not enough data for RSI: ${closes.length} closes, need ${period + 1}`);
    return 50;
  }
  
  // Use the last (period + 1) closes for more accurate calculation
  const data = closes.slice(-period - 1);
  let gains = 0;
  let losses = 0;
  
  // Calculate initial gains and losses
  for (let i = 1; i < data.length; i++) {
    const change = data[i] - data[i - 1];
    if (change >= 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }
  
  // Calculate average gain and loss
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  // For subsequent periods (if we have more data)
  if (closes.length > period + 1) {
    const remainingData = closes.slice(-closes.length + period + 1);
    for (let i = 0; i < remainingData.length; i++) {
      const change = remainingData[i] - (i === 0 ? data[data.length - 1] : remainingData[i - 1]);
      if (change >= 0) {
        avgGain = ((avgGain * (period - 1)) + change) / period;
        avgLoss = (avgLoss * (period - 1)) / period;
      } else {
        avgGain = (avgGain * (period - 1)) / period;
        avgLoss = ((avgLoss * (period - 1)) + Math.abs(change)) / period;
      }
    }
  }
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  console.log(`RSI calculation: avgGain=${avgGain.toFixed(4)}, avgLoss=${avgLoss.toFixed(4)}, rs=${rs.toFixed(4)}, rsi=${rsi.toFixed(2)}`);
  return rsi;
}

// Calculate MACD (12, 26, 9)
function calculateMACD(closes: number[]): { macd: number; signal: number; histogram: number } {
  if (closes.length < 26) {
    console.log(`Not enough data for MACD: ${closes.length} closes, need 26`);
    return { macd: 0, signal: 0, histogram: 0 };
  }
  
  function calculateEMA(data: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    // Start with SMA for the first period
    let sum = 0;
    for (let i = 0; i < period && i < data.length; i++) {
      sum += data[i];
    }
    const initialSMA = sum / Math.min(period, data.length);
    ema.push(initialSMA);
    
    // Calculate EMA
    for (let i = period; i < data.length; i++) {
      const emaValue = (data[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
      ema.push(emaValue);
    }
    return ema;
  }
  
  // Use the last 50 closes for better accuracy
  const data = closes.slice(-50);
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  
  // Calculate MACD line
  const macdLine: number[] = [];
  const minLength = Math.min(ema12.length, ema26.length);
  for (let i = 0; i < minLength; i++) {
    macdLine.push(ema12[i] - ema26[i]);
  }
  
  // Calculate signal line (9-period EMA of MACD)
  const signalLine = calculateEMA(macdLine, 9);
  
  // Get latest values
  const macd = macdLine[macdLine.length - 1] || 0;
  const signal = signalLine[signalLine.length - 1] || 0;
  const histogram = macd - signal;
  
  console.log(`MACD calculation: macd=${macd.toFixed(4)}, signal=${signal.toFixed(4)}, histogram=${histogram.toFixed(4)}`);
  
  return { macd, signal, histogram };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await req.json();
    const { symbol, market } = body;
    
    console.log(`Fetching data for ${symbol} (${market || 'US'})`);

    if (!symbol) {
      throw new Error("Symbol is required");
    }

    // Use Yahoo Finance API with proper endpoint - get more data for better RSI calculation
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1y&interval=1d`;
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

    // Parse the response
    const chart = data.chart;
    if (!chart || !chart.result || chart.result.length === 0) {
      console.error("No results found in Yahoo response");
      throw new Error(`No data found for symbol: ${symbol}`);
    }

    const result = chart.result[0];
    const meta = result.meta;
    const quotes = result.indicators.quote[0];
    const closes = quotes.close || [];
    
    if (!meta) {
      throw new Error("No metadata found");
    }

    // Get the closing prices from the quotes
    let previousClose = meta.previousClose || 0;
    let currentPrice = meta.regularMarketPrice || 0;
    
    // If we have enough data points, use the actual closing prices
    if (closes.length >= 2) {
      const lastClose = closes[closes.length - 1];
      const prevClose = closes[closes.length - 2];
      
      if (lastClose && prevClose && lastClose > 0 && prevClose > 0) {
        const metaChange = meta.regularMarketPrice - meta.previousClose;
        const closeChange = lastClose - prevClose;
        
        if ((metaChange > 0 && closeChange < 0) || (metaChange < 0 && closeChange > 0)) {
          console.log("Meta data shows opposite direction, using close prices");
          currentPrice = lastClose;
          previousClose = prevClose;
        }
      }
    }
    
    if (previousClose === 0) {
      previousClose = meta.previousClose || meta.regularMarketPreviousClose || 0;
    }
    
    if (currentPrice === 0) {
      currentPrice = meta.regularMarketPrice || meta.regularMarketPreviousClose || 0;
    }
    
    if (currentPrice === 0 && closes.length > 0) {
      currentPrice = closes[closes.length - 1];
    }
    
    // Calculate change and change percent
    const change = currentPrice - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
    
    const roundedChange = parseFloat(change.toFixed(2));
    const roundedChangePercent = parseFloat(changePercent.toFixed(2));

    console.log(`Current Price: ${currentPrice}`);
    console.log(`Previous Close: ${previousClose}`);
    console.log(`Change: ${roundedChange} (${roundedChangePercent}%)`);

    // --- Calculate RSI and MACD ---
    let rsi = 50;
    let macd = 0;
    let macdSignal = 0;
    let macdHistogram = 0;
    
    // Filter out null/undefined values and get valid closes
    const validCloses = closes.filter((c: number | null) => c !== null && c !== undefined && c > 0);
    console.log(`Valid closes count: ${validCloses.length}`);
    
    if (validCloses.length >= 15) {
      rsi = calculateRSI(validCloses, 14);
      console.log(`RSI (14): ${rsi.toFixed(2)}`);
    } else {
      console.log(`Not enough data for RSI: ${validCloses.length} closes (need 15)`);
    }
    
    if (validCloses.length >= 26) {
      const macdResult = calculateMACD(validCloses);
      macd = macdResult.macd;
      macdSignal = macdResult.signal;
      macdHistogram = macdResult.histogram;
      console.log(`MACD: ${macd.toFixed(4)}, Signal: ${macdSignal.toFixed(4)}, Histogram: ${macdHistogram.toFixed(4)}`);
    } else {
      console.log(`Not enough data for MACD: ${validCloses.length} closes (need 26)`);
    }

    // Get volume
    const volumeNum = meta.regularMarketVolume || (quotes.volume ? quotes.volume[quotes.volume.length - 1] : 0);
    let volumeDisplay = volumeNum.toString();
    if (volumeNum >= 1000000) {
      volumeDisplay = (volumeNum / 1000000).toFixed(2) + 'M';
    } else if (volumeNum >= 1000) {
      volumeDisplay = (volumeNum / 1000).toFixed(2) + 'K';
    }

    // Build the response data
    const responseData = {
      symbol: meta.symbol || symbol,
      companyName: meta.longName || meta.shortName || symbol,
      price: currentPrice,
      change: roundedChange,
      changePercent: roundedChangePercent,
      previousClose: previousClose,
      dayHigh: meta.regularMarketDayHigh || meta.dayHigh || currentPrice,
      dayLow: meta.regularMarketDayLow || meta.dayLow || currentPrice,
      high52Week: meta.fiftyTwoWeekHigh || currentPrice * 1.35,
      low52Week: meta.fiftyTwoWeekLow || currentPrice * 0.65,
      volume: volumeNum,
      volumeDisplay: volumeDisplay,
      currency: meta.currency || "USD",
      market: market || "US",
      marketState: meta.marketState || "REGULAR",
      high: meta.regularMarketDayHigh || currentPrice,
      low: meta.regularMarketDayLow || currentPrice,
      open: meta.regularMarketOpen || currentPrice,
      // Technical indicators
      rsi: parseFloat(rsi.toFixed(2)),
      macd: parseFloat(macd.toFixed(4)),
      macdSignal: parseFloat(macdSignal.toFixed(4)),
      macdHistogram: parseFloat(macdHistogram.toFixed(4)),
      // Additional financial data
      trailingPE: meta.trailingPE || null,
      dividendYield: meta.dividendYield || null,
      marketCap: meta.marketCap || null,
    };

    console.log("Returning data with RSI and MACD:", {
      rsi: responseData.rsi,
      macd: responseData.macd,
      macdSignal: responseData.macdSignal,
      macdHistogram: responseData.macdHistogram,
    });

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