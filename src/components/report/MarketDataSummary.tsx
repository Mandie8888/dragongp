import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";
import { MarketType, currencySymbols, getCompanyName } from "./StockSearchBar";

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  high: number;
  low: number;
  companyName?: string;
  exchange?: string;
  currency?: string;
}

interface MarketDataSummaryProps {
  data: MarketData;
  loading?: boolean;
  market?: MarketType;
}

export function MarketDataSummary({ data, loading, market = "US" }: MarketDataSummaryProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Market Data Summary",
      currentPrice: "Current Price",
      change: "24h Change",
      volume: "Volume",
      high: "24h High",
      low: "24h Low",
      exchange: "Exchange",
    },
    tc: {
      title: "市場數據摘要",
      currentPrice: "當前價格",
      change: "24小時變動",
      volume: "成交量",
      high: "24小時最高",
      low: "24小時最低",
      exchange: "交易所",
    },
    sc: {
      title: "市场数据摘要",
      currentPrice: "当前价格",
      change: "24小时变动",
      volume: "成交量",
      high: "24小时最高",
      low: "24小时最低",
      exchange: "交易所",
    },
  };

  const t = content[language === "zh-TW" ? "tc" : language === "zh-CN" ? "sc" : "en"] || content.en;

  const isPositive = data.change >= 0;
  // Use currency from data if available, otherwise fallback to market-based symbol
  const currencySymbol = data.currency ? 
    (data.currency === "HKD" ? "HK$" : data.currency === "TWD" ? "NT$" : "$") : 
    currencySymbols[market];
  // Use company name from data if available, otherwise try to look it up
  const displayCompanyName = data.companyName || getCompanyName(data.symbol, language);
  // Use exchange from data if available
  const exchangeName = data.exchange || (market === "HK" ? "HKEX" : market === "TW" ? "TWSE" : "NYSE/NASDAQ");

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-6 w-48 bg-muted/30 rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-foreground">{t.title}</h3>
        <div className="text-right">
          <span className="text-xl font-bold text-gold">{data.symbol}</span>
          {displayCompanyName && (
            <p className="text-sm text-muted-foreground">{displayCompanyName}</p>
          )}
          <p className="text-xs text-[#FFD700] font-medium mt-0.5">
            {t.exchange}: {exchangeName}
          </p>
        </div>
      </div>

      {/* Price hero */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/10 border border-border">
        <div>
          <p className="text-xs text-muted-foreground">{t.currentPrice}</p>
          <p className="text-3xl font-bold text-foreground">
            <span className="text-xl text-muted-foreground mr-1">{currencySymbol}</span>
            {data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
          isPositive ? "bg-green-500/20" : "bg-dragon/20"
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-dragon" />
          )}
          <span className={`text-sm font-semibold ${isPositive ? "text-green-400" : "text-dragon"}`}>
            {isPositive ? "+" : ""}{data.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-muted/10 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-xs">{t.volume}</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{data.volume}</p>
        </div>
        
        <div className="p-3 rounded-lg bg-muted/10 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="text-xs">{t.change}</span>
          </div>
          <p className={`text-sm font-semibold ${isPositive ? "text-green-400" : "text-dragon"}`}>
            {isPositive ? "+" : ""}{currencySymbol}{Math.abs(data.change).toFixed(2)}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
          <p className="text-xs text-muted-foreground">{t.high}</p>
          <p className="text-sm font-semibold text-green-400">
            {currencySymbol}{data.high.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-dragon/5 border border-dragon/20">
          <p className="text-xs text-muted-foreground">{t.low}</p>
          <p className="text-sm font-semibold text-dragon">
            {currencySymbol}{data.low.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}
