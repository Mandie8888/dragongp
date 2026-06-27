import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type SignalLevel = "strong-buy" | "neutral" | "avoid";

interface ActionSignalBadgeProps {
  direction: "bullish" | "bearish" | "neutral";
  probability: number;
  loading?: boolean;
}

export function ActionSignalBadge({ direction, probability, loading }: ActionSignalBadgeProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      strongBuy: "Strong Buy",
      neutral: "Neutral",
      avoid: "Avoid",
    },
    tc: {
      strongBuy: "強力買入",
      neutral: "中性",
      avoid: "避免",
    },
    sc: {
      strongBuy: "强力买入",
      neutral: "中性",
      avoid: "避免",
    },
  };

  const t = content[language === "zh-TW" ? "tc" : language === "zh-CN" ? "sc" : "en"] || content.en;

  // Determine signal level based on direction and probability
  const getSignalLevel = (): SignalLevel => {
    if (direction === "bullish" && probability >= 60) return "strong-buy";
    if (direction === "bearish" && probability >= 60) return "avoid";
    return "neutral";
  };

  const signalLevel = getSignalLevel();

  const signalConfig = {
    "strong-buy": {
      label: t.strongBuy,
      bg: "bg-green-500/20",
      border: "border-green-400/50",
      text: "text-green-400",
      glow: "shadow-[0_0_20px_-5px_rgba(74,222,128,0.6)]",
      icon: TrendingUp,
    },
    neutral: {
      label: t.neutral,
      bg: "bg-gold/20",
      border: "border-gold/50",
      text: "text-gold",
      glow: "shadow-[0_0_20px_-5px_rgba(251,191,36,0.5)]",
      icon: Minus,
    },
    avoid: {
      label: t.avoid,
      bg: "bg-dragon/20",
      border: "border-dragon/50",
      text: "text-dragon",
      glow: "shadow-[0_0_20px_-5px_rgba(239,68,68,0.6)]",
      icon: TrendingDown,
    },
  };

  const config = signalConfig[signalLevel];
  const Icon = config.icon;

  if (loading) {
    return (
      <div className="h-10 w-28 bg-[#1E293B] rounded-lg animate-pulse border border-[#334155]" />
    );
  }

  return (
    <div 
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${config.bg} ${config.border} ${config.glow} transition-all duration-300`}
    >
      <Icon className={`w-4 h-4 ${config.text}`} />
      <span className={`text-sm font-bold ${config.text}`}>{config.label}</span>
    </div>
  );
}
