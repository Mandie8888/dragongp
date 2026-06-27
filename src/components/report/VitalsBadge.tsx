import { useLanguage } from "@/contexts/LanguageContext";

interface VitalsBadgeProps {
  type: "rsi" | "macd";
  rsiValue?: number;
  macdHistogram?: number;
  loading?: boolean;
}

export function VitalsBadge({ type, rsiValue, macdHistogram, loading }: VitalsBadgeProps) {
  const { language } = useLanguage();

  if (loading) {
    return (
      <div className="h-8 w-32 bg-[#1E293B] rounded-md animate-pulse border border-[#334155]" />
    );
  }

  if (type === "rsi" && rsiValue !== undefined) {
    const getZone = () => {
      if (rsiValue <= 30) return { label: language === "en" ? "Oversold" : language === "zh-TW" ? "超賣" : "超卖", color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/30" };
      if (rsiValue >= 70) return { label: language === "en" ? "Overbought" : language === "zh-TW" ? "超買" : "超买", color: "text-dragon", bg: "bg-dragon/10", border: "border-dragon/30" };
      return { label: language === "en" ? "Neutral" : "中性", color: "text-gold", bg: "bg-gold/10", border: "border-gold/30" };
    };
    const zone = getZone();
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md ${zone.bg} border ${zone.border}`}>
        <span className="text-xs font-medium text-[#94A3B8]">RSI:</span>
        <span className="text-sm font-bold text-white">{rsiValue.toFixed(0)}%</span>
        <span className={`text-xs font-medium ${zone.color}`}>• {zone.label}</span>
      </div>
    );
  }

  if (type === "macd" && macdHistogram !== undefined) {
    const isBullish = macdHistogram > 0;
    const label = isBullish 
      ? (language === "en" ? "Bullish" : language === "zh-TW" ? "看漲" : "看涨")
      : (language === "en" ? "Bearish" : language === "zh-TW" ? "看跌" : "看跌");
    const color = isBullish ? "text-green-400" : "text-dragon";
    const bg = isBullish ? "bg-green-400/10" : "bg-dragon/10";
    const border = isBullish ? "border-green-400/30" : "border-dragon/30";
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md ${bg} border ${border}`}>
        <span className="text-xs font-medium text-[#94A3B8]">MACD:</span>
        <span className="text-sm font-bold text-white">{macdHistogram > 0 ? "+" : ""}{macdHistogram.toFixed(2)}</span>
        <span className={`text-xs font-medium ${color}`}>• {label}</span>
      </div>
    );
  }

  return null;
}
