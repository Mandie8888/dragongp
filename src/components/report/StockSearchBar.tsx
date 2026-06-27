import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Loader2 } from "lucide-react";

interface StockSearchBarProps {
  onSearch: (symbol: string, market: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  onDisabledClick?: () => void;
  initialValue?: string;
  initialMarket?: string;
}

export type MarketType = "US" | "HK" | "TW";

// Company name mappings for display
export const companyNames: Record<string, { en: string; "zh-TW": string; "zh-CN": string }> = {
  // US Stocks
  AAPL: { en: "Apple Inc.", "zh-TW": "蘋果公司", "zh-CN": "苹果公司" },
  TSLA: { en: "Tesla, Inc.", "zh-TW": "特斯拉", "zh-CN": "特斯拉" },
  NVDA: { en: "NVIDIA Corporation", "zh-TW": "輝達", "zh-CN": "英伟达" },
  MSFT: { en: "Microsoft Corporation", "zh-TW": "微軟", "zh-CN": "微软" },
  GOOGL: { en: "Alphabet Inc.", "zh-TW": "谷歌母公司", "zh-CN": "谷歌母公司" },
  AMZN: { en: "Amazon.com, Inc.", "zh-TW": "亞馬遜", "zh-CN": "亚马逊" },
  META: { en: "Meta Platforms, Inc.", "zh-TW": "Meta 平台", "zh-CN": "Meta 平台" },
  AMD: { en: "Advanced Micro Devices", "zh-TW": "超微半導體", "zh-CN": "超威半导体" },
  NFLX: { en: "Netflix, Inc.", "zh-TW": "網飛", "zh-CN": "网飞" },
  BABA: { en: "Alibaba Group", "zh-TW": "阿里巴巴", "zh-CN": "阿里巴巴" },
  // HK Stocks
  "0001.HK": { en: "CK Hutchison Holdings", "zh-TW": "長江和記實業", "zh-CN": "长江和记实业" },
  "0005.HK": { en: "HSBC Holdings plc", "zh-TW": "滙豐控股", "zh-CN": "汇丰控股" },
  "0700.HK": { en: "Tencent Holdings Ltd.", "zh-TW": "騰訊控股", "zh-CN": "腾讯控股" },
  "0941.HK": { en: "China Mobile Ltd.", "zh-TW": "中國移動", "zh-CN": "中国移动" },
  "1299.HK": { en: "AIA Group Ltd.", "zh-TW": "友邦保險", "zh-CN": "友邦保险" },
  "2318.HK": { en: "Ping An Insurance", "zh-TW": "中國平安", "zh-CN": "中国平安" },
  "9988.HK": { en: "Alibaba Group (HK)", "zh-TW": "阿里巴巴集團", "zh-CN": "阿里巴巴集团" },
  "3690.HK": { en: "Meituan", "zh-TW": "美團", "zh-CN": "美团" },
  "9618.HK": { en: "JD.com, Inc.", "zh-TW": "京東", "zh-CN": "京东" },
  "1810.HK": { en: "Xiaomi Corporation", "zh-TW": "小米集團", "zh-CN": "小米集团" },
  // TW Stocks
  "2330.TW": { en: "TSMC", "zh-TW": "台積電", "zh-CN": "台积电" },
  "2317.TW": { en: "Hon Hai Precision", "zh-TW": "鴻海精密", "zh-CN": "鸿海精密" },
  "2454.TW": { en: "MediaTek Inc.", "zh-TW": "聯發科", "zh-CN": "联发科" },
  "2308.TW": { en: "Delta Electronics", "zh-TW": "台達電", "zh-CN": "台达电" },
  "2882.TW": { en: "Cathay Financial", "zh-TW": "國泰金控", "zh-CN": "国泰金控" },
  "2881.TW": { en: "Fubon Financial", "zh-TW": "富邦金控", "zh-CN": "富邦金控" },
  "2303.TW": { en: "United Microelectronics", "zh-TW": "聯電", "zh-CN": "联电" },
  "2412.TW": { en: "Chunghwa Telecom", "zh-TW": "中華電信", "zh-CN": "中华电信" },
};

// Currency symbols for each market
export const currencySymbols: Record<MarketType, string> = {
  US: "$",
  HK: "HK$",
  TW: "NT$",
};

// Currency codes for each market
export const currencyCodes: Record<MarketType, string> = {
  US: "USD",
  HK: "HKD",
  TW: "TWD",
};

// Helper to validate and normalize ticker symbols
export function validateTicker(symbol: string, selectedMarket?: MarketType): { isValid: boolean; market: MarketType; normalizedSymbol: string } {
  const trimmed = symbol.trim().toUpperCase();
  
  if (!trimmed) {
    return { isValid: false, market: "US", normalizedSymbol: "" };
  }

  // Hong Kong market (.HK suffix)
  if (trimmed.endsWith(".HK")) {
    const code = trimmed.replace(".HK", "");
    // HK stocks typically have 4-5 digit codes
    if (/^\d{1,5}$/.test(code)) {
      return { isValid: true, market: "HK", normalizedSymbol: trimmed };
    }
  }

  // Taiwan market (.TW suffix)
  if (trimmed.endsWith(".TW")) {
    const code = trimmed.replace(".TW", "");
    // Taiwan stocks typically have 4 digit codes
    if (/^\d{4}$/.test(code)) {
      return { isValid: true, market: "TW", normalizedSymbol: trimmed };
    }
  }

  // If user typed just numbers and a market is selected
  if (/^\d{1,5}$/.test(trimmed) && selectedMarket) {
    if (selectedMarket === "HK") {
      const paddedCode = trimmed.padStart(4, "0");
      return { isValid: true, market: "HK", normalizedSymbol: `${paddedCode}.HK` };
    }
    if (selectedMarket === "TW" && trimmed.length === 4) {
      return { isValid: true, market: "TW", normalizedSymbol: `${trimmed}.TW` };
    }
  }

  // US market (no suffix, letters only)
  if (/^[A-Z]{1,5}$/.test(trimmed)) {
    return { isValid: true, market: "US", normalizedSymbol: trimmed };
  }

  // Also accept BTC/USD style crypto pairs (treat as US for now)
  if (/^[A-Z]{2,5}\/[A-Z]{2,5}$/.test(trimmed)) {
    return { isValid: true, market: "US", normalizedSymbol: trimmed };
  }

  return { isValid: false, market: "US", normalizedSymbol: "" };
}

// Get company name based on symbol and language
export function getCompanyName(symbol: string, language: string): string | null {
  const company = companyNames[symbol];
  if (!company) return null;
  return company[language as keyof typeof company] || company.en;
}

export function StockSearchBar({ 
  onSearch, 
  isLoading = false, 
  disabled = false, 
  onDisabledClick,
  initialValue = "",
  initialMarket = "US"
}: StockSearchBarProps) {
  const { language } = useLanguage();
  const [inputValue, setInputValue] = useState(initialValue);
  const [selectedMarket, setSelectedMarket] = useState<MarketType>(initialMarket as MarketType);
  const [error, setError] = useState("");
  const [detectedCompany, setDetectedCompany] = useState<string | null>(null);

  // Update input when initialValue changes
  useEffect(() => {
    if (initialValue) {
      setInputValue(initialValue);
      // Auto-detect market from initial value
      const validation = validateTicker(initialValue);
      if (validation.isValid) {
        setSelectedMarket(validation.market);
      }
    }
  }, [initialValue]);

  // Update initial market
  useEffect(() => {
    if (initialMarket) {
      setSelectedMarket(initialMarket as MarketType);
    }
  }, [initialMarket]);

  // Smart detection: Update market when .HK or .TW is typed
  useEffect(() => {
    const trimmed = inputValue.trim().toUpperCase();
    
    if (trimmed.endsWith(".HK")) {
      setSelectedMarket("HK");
    } else if (trimmed.endsWith(".TW")) {
      setSelectedMarket("TW");
    }

    // Try to detect company name
    const validation = validateTicker(trimmed, selectedMarket);
    if (validation.isValid && validation.normalizedSymbol) {
      const name = getCompanyName(validation.normalizedSymbol, language);
      setDetectedCompany(name);
    } else {
      setDetectedCompany(null);
    }
  }, [inputValue, selectedMarket, language]);

  const content = {
    en: {
      placeholder: {
        US: "Enter US ticker (e.g., TSLA, AAPL, NVDA)",
        HK: "Enter HK code (e.g., 0001, 0700, 9988)",
        TW: "Enter TW code (e.g., 2330, 2317)",
      },
      searchButton: "Analyze",
      helperTitle: "Supported Markets:",
      helperHK: "Hong Kong (HKEX)",
      helperUS: "United States (NYSE/NASDAQ)",
      helperTW: "Taiwan (TWSE)",
      errorInvalid: "Please enter a valid ticker symbol",
      currencyNote: "Prices displayed in",
    },
    "zh-TW": {
      placeholder: {
        US: "輸入美股代號（例如：TSLA, AAPL, NVDA）",
        HK: "輸入港股代號（例如：0001, 0700, 9988）",
        TW: "輸入台股代號（例如：2330, 2317）",
      },
      searchButton: "分析",
      helperTitle: "支援市場：",
      helperHK: "香港（港交所）",
      helperUS: "美國（紐約/納斯達克）",
      helperTW: "台灣（台灣證交所）",
      errorInvalid: "請輸入有效的股票代號",
      currencyNote: "價格以",
    },
    "zh-CN": {
      placeholder: {
        US: "输入美股代号（例如：TSLA, AAPL, NVDA）",
        HK: "输入港股代号（例如：0001, 0700, 9988）",
        TW: "输入台股代号（例如：2330, 2317）",
      },
      searchButton: "分析",
      helperTitle: "支持市场：",
      helperHK: "香港（港交所）",
      helperUS: "美国（纽约/纳斯达克）",
      helperTW: "台湾（台湾证交所）",
      errorInvalid: "请输入有效的股票代号",
      currencyNote: "价格以",
    },
  };

  const t = content[language] || content.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If disabled, trigger the popup callback
    if (disabled && onDisabledClick) {
      onDisabledClick();
      return;
    }
    
    const validation = validateTicker(inputValue, selectedMarket);
    
    if (!validation.isValid) {
      setError(t.errorInvalid);
      return;
    }

    setError("");
    onSearch(validation.normalizedSymbol, validation.market);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) setError("");
  };

  const handleMarketChange = (market: MarketType) => {
    setSelectedMarket(market);
    setError("");
    // Clear input when switching markets to avoid confusion
    if (inputValue) {
      // Check if current input is valid for new market
      const validation = validateTicker(inputValue, market);
      if (!validation.isValid) {
        setInputValue("");
        setDetectedCompany(null);
      }
    }
  };

  const marketButtons: { key: MarketType; label: string; flag: string }[] = [
    { key: "US", label: "US", flag: "🇺🇸" },
    { key: "HK", label: "HK", flag: "🇭🇰" },
    { key: "TW", label: "TW", flag: "🇹🇼" },
  ];

  return (
    <div className="space-y-5">
      {/* Market Selector Toggle */}
      <div className="flex items-center justify-center gap-1 p-1 rounded-lg" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
        {marketButtons.map((market) => (
          <button
            key={market.key}
            type="button"
            onClick={() => handleMarketChange(market.key)}
            disabled={isLoading || disabled}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-md text-sm font-bold transition-all duration-200
              ${selectedMarket === market.key 
                ? 'bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black shadow-lg shadow-[#FFD700]/20' 
                : 'text-[#C0C0C0] hover:text-white hover:bg-white/10'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <span className="text-lg">{market.flag}</span>
            <span>{market.key}</span>
          </button>
        ))}
      </div>

      {/* Currency Indicator */}
      <div className="flex items-center justify-center">
        <span className="text-sm text-[#C0C0C0]">
          {t.currencyNote} <span className="font-bold text-[#FFD700]">{currencySymbols[selectedMarket]} ({currencyCodes[selectedMarket]})</span>
        </span>
      </div>

      {/* Search Form - Large and Clear with Gold Frame */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gold-400 z-10" style={{ color: '#D4AF37' }} />
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={t.placeholder[selectedMarket]}
            className="pl-14 h-16 text-xl font-medium rounded-xl transition-all duration-300 placeholder:text-muted-foreground/40"
            disabled={isLoading || disabled}
            style={{ 
              fontSize: '1.25rem',
              border: '2px solid #D4AF37',
              backgroundColor: 'rgba(255, 253, 245, 0.05)',
              color: 'white',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 16px -2px rgba(212, 175, 55, 0.5)';
              e.target.style.backgroundColor = 'rgba(255, 253, 245, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = 'rgba(255, 253, 245, 0.05)';
            }}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          onClick={(e) => {
            if (disabled && onDisabledClick) {
              e.preventDefault();
              onDisabledClick();
            }
          }}
          className={`h-16 px-8 text-lg font-bold rounded-xl shadow-lg transition-all ${
            disabled 
              ? 'bg-gray-600 text-gray-400 cursor-pointer opacity-70'
              : 'bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black hover:opacity-90 shadow-[#FFD700]/20'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            t.searchButton
          )}
        </Button>
      </form>

      {/* Detected Company Name Display */}
      {detectedCompany && (
        <div className="flex items-center justify-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
          <span className="text-[#FFD700] font-semibold text-lg">
            {inputValue.toUpperCase()} — {detectedCompany}
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-400 pl-1 text-center">{error}</p>
      )}

      {/* Helper Text - Minimal */}
      <div className="flex items-center justify-center gap-6 text-xs text-[#C0C0C0]/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FFD700' }}></span>
          <span>{t.helperUS}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#DC2626' }}></span>
          <span>{t.helperHK}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }}></span>
          <span>{t.helperTW}</span>
        </div>
      </div>
    </div>
  );
}
