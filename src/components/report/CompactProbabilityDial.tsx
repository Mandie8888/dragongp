import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CompactProbabilityDialProps {
  probability: number;
  direction: "bullish" | "bearish" | "neutral";
  loading?: boolean;
}

export function CompactProbabilityDial({ probability, direction, loading }: CompactProbabilityDialProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      bullish: "Bullish",
      bearish: "Bearish",
      neutral: "Neutral",
    },
    tc: {
      bullish: "看漲",
      bearish: "看跌",
      neutral: "中性",
    },
    sc: {
      bullish: "看涨",
      bearish: "看跌",
      neutral: "中性",
    },
  };

  const t = content[language === "zh-TW" ? "tc" : language === "zh-CN" ? "sc" : "en"] || content.en;

  const { directionLabel, strokeColor, glowColor } = useMemo(() => {
    switch (direction) {
      case "bullish":
        return {
          directionLabel: t.bullish,
          strokeColor: "#4ade80",
          glowColor: "shadow-[0_0_30px_-8px_rgba(74,222,128,0.5)]",
        };
      case "bearish":
        return {
          directionLabel: t.bearish,
          strokeColor: "hsl(12 85% 55%)",
          glowColor: "shadow-[0_0_30px_-8px_rgba(239,68,68,0.5)]",
        };
      default:
        return {
          directionLabel: t.neutral,
          strokeColor: "hsl(38 92% 50%)",
          glowColor: "shadow-[0_0_30px_-8px_rgba(251,191,36,0.5)]",
        };
    }
  }, [direction, t]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability / 100) * circumference;

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-[#1E293B] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Compact circular dial */}
      <div className={`relative w-32 h-32 ${glowColor}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#1E293B"
            strokeWidth="6"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Glow effect */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out opacity-20 blur-[2px]"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white leading-none">{probability.toFixed(0)}</span>
          <span className="text-sm text-[#94A3B8]">%</span>
        </div>
      </div>

      {/* Small direction label */}
      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${
        direction === "bullish" ? "bg-green-400/10 text-green-400 border border-green-400/30" :
        direction === "bearish" ? "bg-dragon/10 text-dragon border border-dragon/30" :
        "bg-gold/10 text-gold border border-gold/30"
      }`}>
        {directionLabel}
      </div>
    </div>
  );
}
