import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type SignalLevel = "strong-buy" | "neutral-hold" | "not-recommended";

interface StrategicVerdictBadgeProps {
  direction: "bullish" | "bearish" | "neutral";
  probability: number;
  rsi?: number;
  loading?: boolean;
  size?: "small" | "large";
}

export function StrategicVerdictBadge({ direction, probability, rsi = 50, loading, size = "small" }: StrategicVerdictBadgeProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      strongBuy: "STRONG BUY",
      neutralHold: "NEUTRAL / HOLD",
      notRecommended: "NOT RECOMMENDED",
    },
    tc: {
      strongBuy: "強力買入",
      neutralHold: "中性 / 持有",
      notRecommended: "不建議",
    },
    sc: {
      strongBuy: "强力买入",
      neutralHold: "中性 / 持有",
      notRecommended: "不建议",
    },
  };

  const t = content[language === "zh-TW" ? "tc" : language === "zh-CN" ? "sc" : "en"] || content.en;

  // Enhanced signal logic based on probability + RSI
  // STRONG BUY: High probability AND low RSI (not overbought)
  // NOT RECOMMENDED: Low probability OR RSI > 75 (extreme overbought)
  // NEUTRAL: Everything else
  const getSignalLevel = (): SignalLevel => {
    // NOT RECOMMENDED: Extreme overbought (RSI > 75) regardless of direction
    if (rsi > 75) return "not-recommended";
    
    // NOT RECOMMENDED: Bearish direction with high probability
    if (direction === "bearish" && probability >= 55) return "not-recommended";
    
    // STRONG BUY: Bullish with high probability AND RSI is low (room to grow)
    if (direction === "bullish" && probability >= 60 && rsi < 65) return "strong-buy";
    
    // NEUTRAL: Mid-range consolidation or mixed signals
    return "neutral-hold";
  };

  const signalLevel = getSignalLevel();

  const signalConfig = {
    "strong-buy": {
      label: t.strongBuy,
      bg: "bg-green-500/20",
      border: "border-green-400",
      text: "text-green-400",
      glow: "shadow-[0_0_30px_-5px_rgba(74,222,128,0.8)]",
      icon: TrendingUp,
    },
    "neutral-hold": {
      label: t.neutralHold,
      bg: "bg-amber-500/20",
      border: "border-amber-400",
      text: "text-amber-400",
      glow: "shadow-[0_0_30px_-5px_rgba(251,191,36,0.7)]",
      icon: Minus,
    },
    "not-recommended": {
      label: t.notRecommended,
      bg: "bg-red-500/20",
      border: "border-red-400",
      text: "text-red-400",
      glow: "shadow-[0_0_30px_-5px_rgba(239,68,68,0.8)]",
      icon: TrendingDown,
    },
  };

  const config = signalConfig[signalLevel];
  const Icon = config.icon;

  if (loading) {
    return (
      <div className={`${size === "large" ? "h-14 w-40" : "h-10 w-32"} bg-[#1E293B] rounded-lg animate-pulse border border-[#334155]`} />
    );
  }

  const isLarge = size === "large";

  return (
    <div 
      className={`inline-flex items-center gap-2 rounded-lg border-2 ${config.bg} ${config.border} ${config.glow} transition-all duration-300 animate-pulse-glow ${
        isLarge ? "px-5 py-3" : "px-4 py-2"
      }`}
    >
      <Icon className={`${isLarge ? "w-6 h-6" : "w-4 h-4"} ${config.text}`} />
      <span className={`font-bold tracking-wide ${config.text} ${isLarge ? "text-base" : "text-sm"}`}>
        {config.label}
      </span>
    </div>
  );
}
