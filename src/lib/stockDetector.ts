export const STOCK_ALIASES: Record<string, string> = {
  // ============================================
  // HONG KONG STOCKS (HKEX)
  // ============================================
  
  // Blue Chips & Major Companies
  "長江和記實業": "0001.HK",
  "長和": "0001.HK",
  "ck hutchison": "0001.HK",
  "ckh": "0001.HK",
  
  "中電": "0002.HK",
  "中電控股": "0002.HK",
  "clp": "0002.HK",
  "clp holdings": "0002.HK",
  
  "香港中華煤氣": "0003.HK",
  "煤氣": "0003.HK",
  "towngas": "0003.HK",
  
  "匯豐": "0005.HK",
  "匯豐控股": "0005.HK",
  "汇丰": "0005.HK",
  "hsbc": "0005.HK",
  
  "恒生銀行": "0011.HK",
  "恒生": "0011.HK",
  "hang seng": "0011.HK",
  "hangseng": "0011.HK",
  
  "騰訊": "0700.HK",
  "腾讯": "0700.HK",
  "tencent": "0700.HK",
  "tencent holdings": "0700.HK",
  
  "港交所": "0388.HK",
  "香港交易所": "0388.HK",
  "hkex": "0388.HK",
  
  "比亞迪": "1211.HK",
  "比亚迪": "1211.HK",
  "byd": "1211.HK",
  "byd company": "1211.HK",
  
  "小米": "1810.HK",
  "xiaomi": "1810.HK",
  "小米集團": "1810.HK",
  
  "美團": "3690.HK",
  "美团": "3690.HK",
  "meituan": "3690.HK",
  
  "阿里巴巴": "9988.HK",
  "alibaba": "9988.HK",
  "ali baba": "9988.HK",
  
  // ============================================
  // TAIWAN STOCKS (TWSE)
  // ============================================
  
  "台積電": "2330.TW",
  "台积电": "2330.TW",
  "tsmc": "2330.TW",
  "taiwan semiconductor": "2330.TW",
  
  "聯發科": "2454.TW",
  "联发科": "2454.TW",
  "mediatek": "2454.TW",
  
  "鴻海": "2317.TW",
  "鸿海": "2317.TW",
  "foxconn": "2317.TW",
  "hon hai": "2317.TW",
  
  // ============================================
  // US STOCKS (NASDAQ/NYSE)
  // ============================================
  
  "特斯拉": "TSLA",
  "tesla": "TSLA",
  "Tesla": "TSLA",

  "太空探索": "SPCX",
  "SpaceX": "SPCX",
  "Spacex": "SPCX",

  "Nebius": "NBIS",
  "nebius": "NBIS",  // ✅ FIXED: removed extra quote

  "苹果": "AAPL",
  "蘋果": "AAPL",
  "apple": "AAPL",
  "Apple": "AAPL",

  "微軟": "MSFT",
  "微软": "MSFT",
  "microsoft": "MSFT",
  "Microsoft": "MSFT",
  
  "谷歌": "GOOGL",
  "google": "GOOGL",
  "Google": "GOOGL",
  "alphabet": "GOOGL",
  
  "亞馬遜": "AMZN",
  "亚马逊": "AMZN",
  "amazon": "AMZN",
  "Amazon": "AMZN",

  "英偉達": "NVDA",
  "辉达": "NVDA",
  "nvidia": "NVDA",
  "Nvidia": "NVDA",
  "輝達": "NVDA",
  
  "英特尔": "INTC",
  "intel": "INTC",
  "Intel": "INTC",
  
  "超微半導體": "AMD",
  "amd": "AMD",
  "Amd": "AMD",
  "advanced micro devices": "AMD",
  
  "高通": "QCOM",
  "qualcomm": "QCOM",
  "Qualcomm": "QCOM",
  
  "博通": "AVGO",
  "broadcom": "AVGO",
  "Broadcom": "AVGO",
  
  "meta": "META",
  "Meta": "META",
  "facebook": "META",
  "Facebook": "META",
  "meta platforms": "META",
  
  "网飞": "NFLX",
  "netflix": "NFLX",
  "Netflix": "NFLX",
};

export function detectStock(input: string): string {
  if (!input || input.trim() === '') return '';
  
  const cleanInput = input.trim();
  const lowerInput = cleanInput.toLowerCase();
  
  // Check if it's already a valid stock symbol format
  if (/^[A-Z0-9]+\.(HK|TW)$/i.test(cleanInput)) {
    return cleanInput.toUpperCase();
  }
  
  // 4-digit number (likely HK stock)
  if (/^\d{4}$/.test(cleanInput)) {
    return `${cleanInput}.HK`;
  }
  
  // 5-digit number (likely TW stock)
  if (/^\d{5}$/.test(cleanInput)) {
    return `${cleanInput}.TW`;
  }
  
  // All caps letter symbol (US stock) - extended to handle longer symbols
  if (/^[A-Z]{1,5}$/i.test(cleanInput)) {
    return cleanInput.toUpperCase();
  }
  
  // Handle common US stock symbols with dots (like BRK.B)
  if (/^[A-Z]+\.[A-Z]$/i.test(cleanInput)) {
    return cleanInput.toUpperCase();
  }
  
  // Check aliases map (case-insensitive)
  for (const [name, symbol] of Object.entries(STOCK_ALIASES)) {
    if (lowerInput.includes(name.toLowerCase())) {
      return symbol;
    }
  }
  
  // If nothing matches, return as is
  return cleanInput.toUpperCase();
}

export function isQuestion(input: string): boolean {
  const questionWords = ['?', '？', 'should', 'buy', 'sell', '買', '賣', '點睇', '如何', '怎樣', '怎样', '是否', '會', '会'];
  return questionWords.some(word => input.includes(word));
}

export function extractStockFromQuestion(input: string): string | null {
  const symbol = detectStock(input);
  if (symbol !== input.trim().toUpperCase()) {
    return symbol;
  }
  return null;
}